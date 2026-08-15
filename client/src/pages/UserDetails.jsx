import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const UserDetails = () => {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    usersResponse,
                    projectsResponse,
                    tasksResponse
                ] = await Promise.all([
                    api.get("/users"),
                    api.get("/projects"),
                    api.get("/tasks")
                ]);

                const users =
                    usersResponse.data.users || [];

                const allProjects =
                    projectsResponse.data.projects || [];

                const allTasks =
                    tasksResponse.data.tasks || [];

                const selectedUser = users.find(
                    (item) => item._id === id
                );

                if (!selectedUser) {
                    setError("User not found.");
                    return;
                }

                setUser(selectedUser);

                // Projects where the user is manager
                // OR a project member
                const userProjects = allProjects.filter(
                    (project) => {
                        const managerId =
                            project.manager?._id ||
                            project.manager;

                        const memberIds =
                            project.members?.map(
                                (member) =>
                                    member._id || member
                            ) || [];

                        return (
                            managerId === id ||
                            memberIds.includes(id)
                        );
                    }
                );

                // Tasks assigned to the user
                const userTasks = allTasks.filter(
                    (task) => {
                        const assignedUserId =
                            task.assignedTo?._id ||
                            task.assignedTo;

                        return assignedUserId === id;
                    }
                );

                setProjects(userProjects);
                setTasks(userTasks);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load user details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);


    const getStatusClasses = (status) => {
        const normalized =
            status?.toUpperCase();

        if (
            normalized === "COMPLETED" ||
            normalized === "DONE"
        ) {
            return `
                bg-emerald-50
                text-emerald-700
                border-emerald-200
            `;
        }

        if (
            normalized === "IN_PROGRESS" ||
            normalized === "IN PROGRESS"
        ) {
            return `
                bg-[#FFF3ED]
                text-[#E86632]
                border-[#FFD8C5]
            `;
        }

        return `
            bg-[#F5F5F5]
            text-[#666666]
            border-[#E3E3E3]
        `;
    };


    const getRoleClasses = (role) => {
        switch (role) {
            case "ADMIN":
                return `
                    bg-[#FFF3ED]
                    text-[#E86632]
                    border-[#FFD8C5]
                `;

            case "MANAGER":
                return `
                    bg-[#F3F3F3]
                    text-[#444444]
                    border-[#DCDCDC]
                `;

            default:
                return `
                    bg-emerald-50
                    text-emerald-700
                    border-emerald-200
                `;
        }
    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <AppLayout>

                <div
                    className="
                        min-h-[500px]
                        flex
                        items-center
                        justify-center
                        bg-[#F4F3F1]
                    "
                >

                    <div className="text-center">

                        <div
                            className="
                                mx-auto
                                h-10
                                w-10
                                rounded-full
                                border-2
                                border-[#E4E0DC]
                                border-t-[#FF7A45]
                                animate-spin
                            "
                        />

                        <p
                            className="
                                mt-4
                                text-sm
                                font-medium
                                text-[#777777]
                            "
                        >
                            Loading user profile...
                        </p>

                    </div>

                </div>

            </AppLayout>
        );
    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error || !user) {
        return (
            <AppLayout>

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-5
                        text-sm
                        text-red-700
                    "
                >
                    {error || "User not found."}
                </div>

            </AppLayout>
        );
    }


    return (
        <AppLayout>

            <div
                className="
                    min-h-full
                    bg-[#F4F3F1]
                    p-1 sm:p-2
                "
            >

                {/* =================================================
                    BACK
                ================================================== */}

                <Link
                    to="/users"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        mb-5

                        text-xs
                        font-semibold
                        text-[#777777]

                        hover:text-[#E86632]

                        transition-colors
                        duration-200
                    "
                >
                    <span className="text-base">
                        ←
                    </span>

                    Back to Users
                </Link>


                {/* =================================================
                    USER HEADER
                ================================================== */}

                <section
                    className="
                        relative
                        overflow-hidden

                        rounded-2xl

                        border
                        border-[#292929]

                        bg-[#0A0A0A]

                        p-6
                        sm:p-7

                        shadow-[0_12px_35px_rgba(0,0,0,0.12)]
                    "
                >

                    {/* Orange glow */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-28

                            h-64
                            w-64

                            rounded-full

                            bg-[#FF7A45]/10

                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            bottom-0
                            left-10

                            h-px
                            w-40

                            bg-gradient-to-r
                            from-transparent
                            via-[#FF7A45]/50
                            to-transparent
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-6

                            sm:flex-row
                            sm:items-center
                        "
                    >

                        {/* Avatar */}

                        <div
                            className="
                                flex
                                h-20
                                w-20
                                shrink-0
                                items-center
                                justify-center

                                rounded-2xl

                                bg-[#FF7A45]

                                text-3xl
                                font-bold
                                text-white

                                shadow-[0_0_25px_rgba(255,122,69,0.18)]
                            "
                        >
                            {user.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>


                        {/* User Information */}

                        <div className="min-w-0">

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >

                                <h1
                                    className="
                                        text-2xl
                                        sm:text-3xl
                                        font-semibold
                                        tracking-tight
                                        text-[#EEEEEE]
                                    "
                                >
                                    {user.name}
                                </h1>


                                <span
                                    className={`
                                        rounded-full
                                        border
                                        px-3
                                        py-1

                                        text-[10px]
                                        font-bold

                                        uppercase
                                        tracking-wider

                                        ${getRoleClasses(user.role)}
                                    `}
                                >
                                    {user.role}
                                </span>

                            </div>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-[#888888]
                                "
                            >
                                {user.email}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        STATS
                    ================================================== */}

                    <div
                        className="
                            relative
                            mt-7

                            grid
                            grid-cols-2
                            gap-3

                            sm:grid-cols-4
                        "
                    >

                        {/* Projects */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#292929]
                                bg-[#111111]
                                p-4

                                transition-colors
                                duration-200

                                hover:border-[#3A3A3A]
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-[#777777]
                                "
                            >
                                Projects
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    text-[#EEEEEE]
                                "
                            >
                                {projects.length}
                            </p>

                        </div>


                        {/* Tasks */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#292929]
                                bg-[#111111]
                                p-4

                                transition-colors
                                duration-200

                                hover:border-[#3A3A3A]
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-[#777777]
                                "
                            >
                                Tasks
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    text-[#EEEEEE]
                                "
                            >
                                {tasks.length}
                            </p>

                        </div>


                        {/* Completed */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#292929]
                                bg-[#111111]
                                p-4

                                transition-colors
                                duration-200

                                hover:border-[#3A3A3A]
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-[#777777]
                                "
                            >
                                Completed
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    text-[#FF7A45]
                                "
                            >
                                {
                                    tasks.filter(
                                        (task) =>
                                            task.status?.toUpperCase() ===
                                                "COMPLETED" ||
                                            task.status?.toUpperCase() ===
                                                "DONE"
                                    ).length
                                }
                            </p>

                        </div>


                        {/* Role */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-[#292929]
                                bg-[#111111]
                                p-4

                                transition-colors
                                duration-200

                                hover:border-[#3A3A3A]
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-[#777777]
                                "
                            >
                                Role
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-bold
                                    text-[#EEEEEE]
                                "
                            >
                                {user.role}
                            </p>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    PROJECTS
                ================================================== */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-[#E2DEDA]
                        bg-white

                        shadow-[0_6px_22px_rgba(0,0,0,0.04)]
                    "
                >

                    {/* Section Header */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between

                            border-b
                            border-[#ECE9E5]

                            px-5
                            py-5

                            sm:px-6
                        "
                    >

                        <div>

                            <div
                                className="
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
                                    "
                                />

                                <h2
                                    className="
                                        font-semibold
                                        text-[#171717]
                                    "
                                >
                                    Projects
                                </h2>

                            </div>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-[#888888]
                                "
                            >
                                Projects associated with this user
                            </p>

                        </div>


                        <span
                            className="
                                rounded-full

                                bg-[#FFF3ED]

                                border
                                border-[#FFD8C5]

                                px-3
                                py-1

                                text-xs
                                font-bold
                                text-[#E86632]
                            "
                        >
                            {projects.length}
                        </span>

                    </div>


                    <div className="p-5 sm:p-6">

                        {projects.length === 0 ? (

                            <div className="py-8 text-center">

                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center

                                        rounded-xl

                                        bg-[#F5F5F5]

                                        text-[#999999]
                                    "
                                >
                                    —
                                </div>

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        text-[#777777]
                                    "
                                >
                                    No projects associated with this user.
                                </p>

                            </div>

                        ) : (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-3
                                    md:grid-cols-2
                                "
                            >

                                {projects.map((project) => (

                                    <Link
                                        key={project._id}
                                        to={`/projects/${project._id}`}
                                        className="
                                            group

                                            rounded-xl

                                            border
                                            border-[#E8E4E0]

                                            p-4

                                            transition-all
                                            duration-200

                                            hover:border-[#FFD5C2]
                                            hover:bg-[#FFFBF8]
                                            hover:-translate-y-0.5
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            <h3
                                                className="
                                                    font-semibold
                                                    text-[#333333]

                                                    group-hover:text-[#E86632]

                                                    transition-colors
                                                "
                                            >
                                                {project.name}
                                            </h3>


                                            {project.status && (
                                                <span
                                                    className={`
                                                        shrink-0
                                                        rounded-full
                                                        border
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        ${getStatusClasses(
                                                            project.status
                                                        )}
                                                    `}
                                                >
                                                    {project.status}
                                                </span>
                                            )}

                                        </div>


                                        {project.description && (
                                            <p
                                                className="
                                                    mt-2
                                                    line-clamp-2
                                                    text-xs
                                                    leading-5
                                                    text-[#888888]
                                                "
                                            >
                                                {project.description}
                                            </p>
                                        )}

                                    </Link>

                                ))}

                            </div>

                        )}

                    </div>

                </section>


                {/* =================================================
                    TASKS
                ================================================== */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-[#E2DEDA]
                        bg-white

                        shadow-[0_6px_22px_rgba(0,0,0,0.04)]
                    "
                >

                    {/* Header */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between

                            border-b
                            border-[#ECE9E5]

                            px-5
                            py-5

                            sm:px-6
                        "
                    >

                        <div>

                            <div
                                className="
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
                                        bg-[#555555]
                                    "
                                />

                                <h2
                                    className="
                                        font-semibold
                                        text-[#171717]
                                    "
                                >
                                    Tasks
                                </h2>

                            </div>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-[#888888]
                                "
                            >
                                Tasks assigned to this user
                            </p>

                        </div>


                        <span
                            className="
                                rounded-full

                                bg-[#F3F3F3]

                                border
                                border-[#DEDEDE]

                                px-3
                                py-1

                                text-xs
                                font-bold
                                text-[#555555]
                            "
                        >
                            {tasks.length}
                        </span>

                    </div>


                    <div className="p-5 sm:p-6">

                        {tasks.length === 0 ? (

                            <div className="py-8 text-center">

                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center

                                        rounded-xl

                                        bg-[#F5F5F5]

                                        text-[#999999]
                                    "
                                >
                                    —
                                </div>

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        text-[#777777]
                                    "
                                >
                                    No tasks assigned to this user.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {tasks.map((task) => (

                                    <Link
                                        key={task._id}
                                        to={`/tasks/${task._id}`}
                                        className="
                                            group

                                            flex
                                            flex-col
                                            gap-3

                                            rounded-xl

                                            border
                                            border-[#E8E4E0]

                                            p-4

                                            transition-all
                                            duration-200

                                            hover:border-[#FFD5C2]
                                            hover:bg-[#FFFBF8]

                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                    >

                                        <div className="min-w-0">

                                            <h3
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-[#333333]

                                                    group-hover:text-[#E86632]

                                                    transition-colors
                                                "
                                            >
                                                {task.title}
                                            </h3>


                                            {task.description && (
                                                <p
                                                    className="
                                                        mt-1
                                                        line-clamp-1
                                                        text-xs
                                                        text-[#888888]
                                                    "
                                                >
                                                    {task.description}
                                                </p>
                                            )}

                                        </div>


                                        {task.status && (
                                            <span
                                                className={`
                                                    w-fit
                                                    shrink-0
                                                    rounded-full
                                                    border
                                                    px-2.5
                                                    py-1
                                                    text-[10px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    ${getStatusClasses(
                                                        task.status
                                                    )}
                                                `}
                                            >
                                                {task.status}
                                            </span>
                                        )}

                                    </Link>

                                ))}

                            </div>

                        )}

                    </div>

                </section>

            </div>

        </AppLayout>
    );
};

export default UserDetails;