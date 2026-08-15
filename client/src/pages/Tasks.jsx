import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [projectFilter, setProjectFilter] = useState("ALL");
    const [assigneeFilter, setAssigneeFilter] = useState("ALL");


    /* =========================================================
       FETCH TASKS
    ========================================================= */

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks");

            setTasks(response.data.tasks || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load tasks"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTasks();
    }, []);


    /* =========================================================
       PERMISSIONS
    ========================================================= */

    const canCreateTask =
        user?.role === "ADMIN" ||
        user?.role === "MANAGER";


    /* =========================================================
       UNIQUE PROJECTS
    ========================================================= */

    const projects = useMemo(() => {
        const projectMap = new Map();

        tasks.forEach((task) => {
            if (task.project?._id) {
                projectMap.set(
                    task.project._id,
                    task.project
                );
            }
        });

        return Array.from(projectMap.values()).sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }, [tasks]);


    /* =========================================================
       UNIQUE ASSIGNEES
    ========================================================= */

    const assignees = useMemo(() => {
        const userMap = new Map();

        tasks.forEach((task) => {
            if (task.assignedTo?._id) {
                userMap.set(
                    task.assignedTo._id,
                    task.assignedTo
                );
            }
        });

        return Array.from(userMap.values()).sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }, [tasks]);


    /* =========================================================
       FILTER TASKS
    ========================================================= */

    const filteredTasks = useMemo(() => {

        const searchValue = search
            .trim()
            .toLowerCase();

        return tasks.filter((task) => {

            const matchesSearch =
                !searchValue ||
                task.title
                    ?.toLowerCase()
                    .includes(searchValue) ||
                task.description
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "ALL" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "ALL" ||
                task.priority === priorityFilter;

            const matchesProject =
                projectFilter === "ALL" ||
                task.project?._id === projectFilter;

            const matchesAssignee =
                assigneeFilter === "ALL" ||
                task.assignedTo?._id === assigneeFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesProject &&
                matchesAssignee
            );
        });

    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
        projectFilter,
        assigneeFilter
    ]);


    /* =========================================================
       STATISTICS
    ========================================================= */

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) =>
            task.status?.toUpperCase() === "COMPLETED"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) =>
            task.status?.toUpperCase() === "IN_PROGRESS"
    ).length;

    const pendingTasks = tasks.filter(
        (task) =>
            task.status?.toUpperCase() === "PENDING" ||
            task.status?.toUpperCase() === "TODO"
    ).length;


    /* =========================================================
       FILTER HELPERS
    ========================================================= */

    const hasFilters =
        search.trim() !== "" ||
        statusFilter !== "ALL" ||
        priorityFilter !== "ALL" ||
        projectFilter !== "ALL" ||
        assigneeFilter !== "ALL";


    const clearFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setPriorityFilter("ALL");
        setProjectFilter("ALL");
        setAssigneeFilter("ALL");
    };


    /* =========================================================
       PRIORITY
    ========================================================= */

    const getPriorityClasses = (priority) => {

        switch (priority?.toUpperCase()) {

            case "HIGH":
                return `
                    border-[#F4C8C3]
                    bg-[#FFF3F1]
                    text-[#C74B3C]
                `;

            case "MEDIUM":
                return `
                    border-[#F1D9A8]
                    bg-[#FFF8E8]
                    text-[#9A6A12]
                `;

            case "LOW":
                return `
                    border-[#BFE3D2]
                    bg-[#EDF9F3]
                    text-[#27805B]
                `;

            default:
                return `
                    border-[#DDD9D5]
                    bg-[#F8F7F5]
                    text-[#706B66]
                `;
        }
    };


    const getPriorityDot = (priority) => {

        switch (priority?.toUpperCase()) {

            case "HIGH":
                return "bg-[#D95748]";

            case "MEDIUM":
                return "bg-[#D89B24]";

            case "LOW":
                return "bg-[#2E9B70]";

            default:
                return "bg-[#99938D]";
        }
    };


    /* =========================================================
       STATUS
    ========================================================= */

    const getStatusClasses = (status) => {

        switch (status?.toUpperCase()) {

            case "COMPLETED":
                return `
                    border-[#BFE3D2]
                    bg-[#EDF9F3]
                    text-[#27805B]
                `;

            case "IN_PROGRESS":
                return `
                    border-[#C7DCEF]
                    bg-[#EFF6FC]
                    text-[#3975A8]
                `;

            case "PENDING":
            case "TODO":
                return `
                    border-[#F1D9A8]
                    bg-[#FFF8E8]
                    text-[#9A6A12]
                `;

            default:
                return `
                    border-[#DDD9D5]
                    bg-[#F8F7F5]
                    text-[#706B66]
                `;
        }
    };


    const getStatusDot = (status) => {

        switch (status?.toUpperCase()) {

            case "COMPLETED":
                return "bg-[#2E9B70]";

            case "IN_PROGRESS":
                return "bg-[#4C91C9]";

            case "PENDING":
            case "TODO":
                return "bg-[#D89B24]";

            default:
                return "bg-[#99938D]";
        }
    };


    const formatStatus = (status) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (letter) => letter.toUpperCase()
            );
    };


    return (
        <AppLayout>

            {/* =====================================================
                MAIN PAGE
                Horizontal margin keeps content away from edges.
            ====================================================== */}

            <div className="mx-4 space-y-6 pb-8 sm:mx-6 lg:mx-8 xl:mx-10">

                {/* =================================================
                    TOP HEADER
                ================================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        pt-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-[#292725]
                            "
                        >
                            Tasks
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-[#817B76]
                            "
                        >
                            Track, organize and manage work across your projects.
                        </p>

                    </div>


                    {canCreateTask && (

                        <Link
                            to="/tasks/new"

                            className="
                                inline-flex
                                w-fit
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                bg-[#FF7A45]

                                px-5
                                py-3

                                text-sm
                                font-semibold
                                text-white

                                shadow-[0_6px_18px_rgba(255,122,69,0.18)]

                                transition-all
                                duration-200

                                hover:-translate-y-0.5
                                hover:bg-[#FF8B5C]
                                hover:shadow-[0_9px_24px_rgba(255,122,69,0.25)]

                                active:scale-95
                            "
                        >

                            <span className="text-lg leading-none">
                                +
                            </span>

                            New Task

                        </Link>

                    )}

                </div>


                {/* =================================================
                    STATISTICS
                ================================================== */}

                {!loading && !error && (

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4

                            lg:grid-cols-4
                        "
                    >

                        {/* TOTAL */}

                        <div
                            className="
                                group
                                relative
                                overflow-hidden

                                rounded-2xl

                                border
                                border-[#E4DFDB]

                                bg-white

                                p-5

                                shadow-[0_5px_20px_rgba(0,0,0,0.035)]

                                transition-all
                                duration-200

                                hover:-translate-y-1
                                hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)]
                            "
                        >

                            <div
                                className="
                                    absolute
                                    -right-8
                                    -top-8

                                    h-24
                                    w-24

                                    rounded-full

                                    bg-[#FF7A45]/[0.07]

                                    blur-2xl
                                "
                            />

                            <p className="relative text-xs font-semibold uppercase tracking-wider text-[#99928C]">
                                Total Tasks
                            </p>

                            <p className="relative mt-2 text-3xl font-bold text-[#2C2927]">
                                {totalTasks}
                            </p>

                            <p className="relative mt-1 text-xs text-[#A19B96]">
                                All visible tasks
                            </p>

                        </div>


                        {/* PENDING */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#E4DFDB]
                                bg-white
                                p-5

                                shadow-[0_5px_20px_rgba(0,0,0,0.035)]

                                transition-all
                                duration-200

                                hover:-translate-y-1
                                hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)]
                            "
                        >

                            <div className="flex items-center justify-between">

                                <p className="text-xs font-semibold uppercase tracking-wider text-[#99928C]">
                                    Pending
                                </p>

                                <span
                                    className="
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        bg-[#D89B24]

                                        shadow-[0_0_8px_rgba(216,155,36,0.3)]
                                    "
                                />

                            </div>

                            <p className="mt-2 text-3xl font-bold text-[#9A6A12]">
                                {pendingTasks}
                            </p>

                            <p className="mt-1 text-xs text-[#A19B96]">
                                Waiting to start
                            </p>

                        </div>


                        {/* IN PROGRESS */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#E4DFDB]
                                bg-white
                                p-5

                                shadow-[0_5px_20px_rgba(0,0,0,0.035)]

                                transition-all
                                duration-200

                                hover:-translate-y-1
                                hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)]
                            "
                        >

                            <div className="flex items-center justify-between">

                                <p className="text-xs font-semibold uppercase tracking-wider text-[#99928C]">
                                    In Progress
                                </p>

                                <span
                                    className="
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        bg-[#4C91C9]

                                        shadow-[0_0_8px_rgba(76,145,201,0.3)]
                                    "
                                />

                            </div>

                            <p className="mt-2 text-3xl font-bold text-[#3975A8]">
                                {inProgressTasks}
                            </p>

                            <p className="mt-1 text-xs text-[#A19B96]">
                                Currently active
                            </p>

                        </div>


                        {/* COMPLETED */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[#E4DFDB]
                                bg-white
                                p-5

                                shadow-[0_5px_20px_rgba(0,0,0,0.035)]

                                transition-all
                                duration-200

                                hover:-translate-y-1
                                hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)]
                            "
                        >

                            <div className="flex items-center justify-between">

                                <p className="text-xs font-semibold uppercase tracking-wider text-[#99928C]">
                                    Completed
                                </p>

                                <span
                                    className="
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        bg-[#2E9B70]

                                        shadow-[0_0_8px_rgba(46,155,112,0.3)]
                                    "
                                />

                            </div>

                            <p className="mt-2 text-3xl font-bold text-[#27805B]">
                                {completedTasks}
                            </p>

                            <p className="mt-1 text-xs text-[#A19B96]">
                                Finished tasks
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    FILTERS
                ================================================== */}

                <div
                    className="
                        rounded-2xl

                        border
                        border-[#E2DEDA]

                        bg-white

                        p-4
                        sm:p-5

                        shadow-[0_6px_22px_rgba(0,0,0,0.035)]
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3

                            md:grid-cols-2
                            xl:grid-cols-5
                        "
                    >

                        {/* SEARCH */}

                        <div className="relative xl:col-span-2">

                            <svg
                                className="
                                    pointer-events-none

                                    absolute
                                    left-3
                                    top-1/2

                                    h-5
                                    w-5

                                    -translate-y-1/2

                                    text-[#AAA49F]
                                "
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                                />

                            </svg>


                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search tasks..."

                                className="
                                    w-full

                                    rounded-xl

                                    border
                                    border-[#DDD9D5]

                                    bg-[#FCFBFA]

                                    py-3
                                    pl-10
                                    pr-4

                                    text-sm
                                    text-[#333333]

                                    outline-none

                                    transition-all
                                    duration-200

                                    placeholder:text-[#AAA49F]

                                    hover:border-[#CFC9C4]

                                    focus:border-[#FFAD86]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[#FF7A45]/[0.08]
                                "
                            />

                        </div>


                        {/* STATUS */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }

                            className="
                                rounded-xl
                                border
                                border-[#DDD9D5]

                                bg-[#FCFBFA]

                                px-3
                                py-3

                                text-sm
                                font-medium
                                text-[#55504B]

                                outline-none

                                transition-all

                                hover:border-[#CFC9C4]

                                focus:border-[#FFAD86]
                                focus:bg-white
                                focus:ring-4
                                focus:ring-[#FF7A45]/[0.08]
                            "
                        >

                            <option value="ALL">
                                All Status
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="IN_PROGRESS">
                                In Progress
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                        </select>


                        {/* PRIORITY */}

                        <select
                            value={priorityFilter}
                            onChange={(e) =>
                                setPriorityFilter(e.target.value)
                            }

                            className="
                                rounded-xl
                                border
                                border-[#DDD9D5]

                                bg-[#FCFBFA]

                                px-3
                                py-3

                                text-sm
                                font-medium
                                text-[#55504B]

                                outline-none

                                transition-all

                                hover:border-[#CFC9C4]

                                focus:border-[#FFAD86]
                                focus:bg-white
                                focus:ring-4
                                focus:ring-[#FF7A45]/[0.08]
                            "
                        >

                            <option value="ALL">
                                All Priority
                            </option>

                            <option value="HIGH">
                                High
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="LOW">
                                Low
                            </option>

                        </select>


                        {/* PROJECT */}

                        <select
                            value={projectFilter}
                            onChange={(e) =>
                                setProjectFilter(e.target.value)
                            }

                            className="
                                rounded-xl
                                border
                                border-[#DDD9D5]

                                bg-[#FCFBFA]

                                px-3
                                py-3

                                text-sm
                                font-medium
                                text-[#55504B]

                                outline-none

                                transition-all

                                hover:border-[#CFC9C4]

                                focus:border-[#FFAD86]
                                focus:bg-white
                                focus:ring-4
                                focus:ring-[#FF7A45]/[0.08]
                            "
                        >

                            <option value="ALL">
                                All Projects
                            </option>

                            {projects.map((project) => (
                                <option
                                    key={project._id}
                                    value={project._id}
                                >
                                    {project.name}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* SECOND ROW */}

                    <div
                        className="
                            mt-3

                            flex
                            flex-col
                            gap-3

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <select
                            value={assigneeFilter}
                            onChange={(e) =>
                                setAssigneeFilter(e.target.value)
                            }

                            className="
                                rounded-xl
                                border
                                border-[#DDD9D5]

                                bg-[#FCFBFA]

                                px-3
                                py-3

                                text-sm
                                font-medium
                                text-[#55504B]

                                outline-none

                                transition-all

                                hover:border-[#CFC9C4]

                                focus:border-[#FFAD86]
                                focus:bg-white
                                focus:ring-4
                                focus:ring-[#FF7A45]/[0.08]

                                sm:w-64
                            "
                        >

                            <option value="ALL">
                                All Assignees
                            </option>

                            {assignees.map((assignee) => (
                                <option
                                    key={assignee._id}
                                    value={assignee._id}
                                >
                                    {assignee.name}
                                </option>
                            ))}

                        </select>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4

                                text-xs
                                text-[#8B8580]
                            "
                        >

                            <span>
                                Showing{" "}
                                <strong className="text-[#55504B]">
                                    {filteredTasks.length}
                                </strong>{" "}
                                of{" "}
                                <strong className="text-[#55504B]">
                                    {tasks.length}
                                </strong>{" "}
                                tasks
                            </span>


                            {hasFilters && (

                                <button
                                    type="button"
                                    onClick={clearFilters}

                                    className="
                                        whitespace-nowrap

                                        font-semibold
                                        text-[#E86632]

                                        transition-colors

                                        hover:text-[#C84F20]
                                    "
                                >
                                    Clear filters
                                </button>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div
                        className="
                            rounded-xl

                            border
                            border-red-200

                            bg-red-50

                            p-4

                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================== */}

                {loading && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5

                            md:grid-cols-2
                        "
                    >

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (

                                <div
                                    key={item}

                                    className="
                                        h-64

                                        animate-pulse

                                        rounded-2xl

                                        border
                                        border-[#E4DFDB]

                                        bg-white
                                    "
                                />

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================== */}

                {!loading &&
                    !error &&
                    filteredTasks.length === 0 && (

                        <div
                            className="
                                rounded-2xl

                                border
                                border-[#E2DEDA]

                                bg-white

                                py-16

                                text-center

                                shadow-[0_6px_22px_rgba(0,0,0,0.035)]
                            "
                        >

                            <div
                                className="
                                    mx-auto

                                    flex
                                    h-14
                                    w-14

                                    items-center
                                    justify-center

                                    rounded-2xl

                                    bg-[#FFF3ED]

                                    text-[#E86632]
                                "
                            >

                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.8"
                                        d="M9 5h6m-7 4h8m-8 4h5m-7 7h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.5a2.5 2.5 0 0 0-5 0H10a2.5 2.5 0 0 0-5 0H3.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
                                    />

                                </svg>

                            </div>


                            <h3
                                className="
                                    mt-4

                                    text-sm
                                    font-semibold
                                    text-[#333333]
                                "
                            >
                                {hasFilters
                                    ? "No tasks match your filters"
                                    : "No tasks yet"}
                            </h3>


                            <p
                                className="
                                    mt-1

                                    text-sm
                                    text-[#88827D]
                                "
                            >
                                {hasFilters
                                    ? "Try changing your search or filters."
                                    : "Tasks assigned to you or created for your projects will appear here."}
                            </p>


                            {hasFilters && (

                                <button
                                    type="button"
                                    onClick={clearFilters}

                                    className="
                                        mt-4

                                        rounded-xl

                                        bg-[#FF7A45]

                                        px-4
                                        py-2.5

                                        text-sm
                                        font-semibold
                                        text-white

                                        shadow-[0_4px_12px_rgba(255,122,69,0.15)]

                                        transition-all

                                        hover:bg-[#FF8B5C]
                                        hover:-translate-y-0.5

                                        active:scale-95
                                    "
                                >
                                    Clear Filters
                                </button>

                            )}

                        </div>

                    )}


                {/* =================================================
                    TASK CARDS
                ================================================== */}

                {!loading &&
                    !error &&
                    filteredTasks.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5

                                md:grid-cols-2
                            "
                        >

                            {filteredTasks.map((task) => (

                                <div
                                    key={task._id}

                                    className="
                                        group
                                        relative
                                        overflow-hidden

                                        flex
                                        flex-col

                                        rounded-2xl

                                        border
                                        border-[#E2DEDA]

                                        bg-white

                                        p-5

                                        shadow-[0_6px_22px_rgba(0,0,0,0.035)]

                                        transition-all
                                        duration-200

                                        hover:-translate-y-1

                                        hover:border-[#F0B79A]

                                        hover:shadow-[0_14px_30px_rgba(0,0,0,0.075)]
                                    "
                                >

                                    {/* Orange top line */}

                                    <div
                                        className="
                                            absolute
                                            left-0
                                            right-0
                                            top-0

                                            h-1

                                            bg-gradient-to-r
                                            from-[#FF7A45]
                                            via-[#FF9B70]
                                            to-[#F5C3AC]

                                            opacity-70

                                            group-hover:opacity-100
                                        "
                                    />


                                    {/* Header */}

                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        "
                                    >

                                        <div className="min-w-0">

                                            <div
                                                className="
                                                    mb-2
                                                    flex
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <span
                                                    className="
                                                        h-2
                                                        w-2
                                                        rounded-full

                                                        bg-[#FF7A45]

                                                        shadow-[0_0_7px_rgba(255,122,69,0.35)]
                                                    "
                                                />

                                                <span
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-[#A09A95]
                                                    "
                                                >
                                                    Task
                                                </span>

                                            </div>


                                            <h3
                                                className="
                                                    truncate

                                                    text-lg
                                                    font-bold
                                                    text-[#292725]

                                                    transition-colors

                                                    group-hover:text-[#E86632]
                                                "
                                            >
                                                {task.title}
                                            </h3>

                                        </div>


                                        {/* Priority */}

                                        <span
                                            className={`
                                                flex
                                                shrink-0
                                                items-center
                                                gap-1.5

                                                rounded-full

                                                border

                                                px-2.5
                                                py-1

                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-wide

                                                ${getPriorityClasses(
                                                    task.priority
                                                )}
                                            `}
                                        >

                                            <span
                                                className={`
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full

                                                    ${getPriorityDot(
                                                        task.priority
                                                    )}
                                                `}
                                            />

                                            {task.priority}

                                        </span>

                                    </div>


                                    {/* Description */}

                                    <p
                                        className="
                                            mt-4

                                            min-h-[60px]

                                            line-clamp-3

                                            text-sm
                                            leading-5

                                            text-[#77716C]
                                        "
                                    >
                                        {task.description ||
                                            "No description provided."}
                                    </p>


                                    {/* Information */}

                                    <div
                                        className="
                                            mt-5

                                            space-y-3

                                            rounded-xl

                                            border
                                            border-[#EEEAE6]

                                            bg-[#FCFBFA]

                                            p-3.5
                                        "
                                    >

                                        {/* Project */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <span
                                                className="
                                                    text-xs
                                                    text-[#9A948F]
                                                "
                                            >
                                                Project
                                            </span>

                                            <strong
                                                className="
                                                    max-w-[210px]
                                                    truncate

                                                    text-right

                                                    text-sm
                                                    font-semibold
                                                    text-[#494541]
                                                "
                                            >
                                                {task.project?.name ||
                                                    "Unknown"}
                                            </strong>

                                        </div>


                                        {/* Assignee */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <span
                                                className="
                                                    text-xs
                                                    text-[#9A948F]
                                                "
                                            >
                                                Assigned to
                                            </span>


                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-6
                                                        w-6
                                                        shrink-0
                                                        items-center
                                                        justify-center

                                                        rounded-full

                                                        bg-[#FFF0E8]

                                                        text-[10px]
                                                        font-bold
                                                        text-[#E86632]
                                                    "
                                                >
                                                    {task.assignedTo?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                        "—"}
                                                </div>


                                                <strong
                                                    className="
                                                        max-w-[150px]
                                                        truncate

                                                        text-right

                                                        text-xs
                                                        font-semibold
                                                        text-[#494541]
                                                    "
                                                >
                                                    {task.assignedTo?.name ||
                                                        "Unassigned"}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* Due Date */}

                                        {task.dueDate && (

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                <span
                                                    className="
                                                        text-xs
                                                        text-[#9A948F]
                                                    "
                                                >
                                                    Due
                                                </span>


                                                <strong
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-[#494541]
                                                    "
                                                >
                                                    {new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </strong>

                                            </div>

                                        )}

                                    </div>


                                    {/* Footer */}

                                    <div
                                        className="
                                            mt-5

                                            flex
                                            items-center
                                            justify-between
                                            gap-3

                                            border-t
                                            border-[#EEEAE6]

                                            pt-4
                                        "
                                    >

                                        <span
                                            className={`
                                                flex
                                                items-center
                                                gap-1.5

                                                rounded-full

                                                border

                                                px-3
                                                py-1

                                                text-[11px]
                                                font-semibold

                                                ${getStatusClasses(
                                                    task.status
                                                )}
                                            `}
                                        >

                                            <span
                                                className={`
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full

                                                    ${getStatusDot(
                                                        task.status
                                                    )}
                                                `}
                                            />

                                            {formatStatus(task.status)}

                                        </span>


                                        <Link
                                            to={`/tasks/${task._id}`}

                                            className="
                                                inline-flex
                                                items-center
                                                gap-2

                                                rounded-xl

                                                border
                                                border-[#E0DBD6]

                                                bg-[#FCFBFA]

                                                px-4
                                                py-2

                                                text-sm
                                                font-semibold
                                                text-[#625D58]

                                                transition-all
                                                duration-200

                                                hover:border-[#FFB08C]
                                                hover:bg-[#FFF5EF]
                                                hover:text-[#E86632]

                                                active:scale-[0.98]
                                            "
                                        >
                                            View Details

                                            <span
                                                className="
                                                    transition-transform
                                                    duration-200

                                                    group-hover:translate-x-1
                                                "
                                            >
                                                →
                                            </span>

                                        </Link>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </div>

        </AppLayout>
    );
};

export default Tasks;