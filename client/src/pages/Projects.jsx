import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [personFilter, setPersonFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");


    /* =========================================================
       FETCH PROJECTS
    ========================================================= */

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/projects");

            setProjects(response.data.projects || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load projects"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, []);


    /* =========================================================
       PEOPLE FILTER
    ========================================================= */

    const people = useMemo(() => {
        const peopleMap = new Map();

        projects.forEach((project) => {

            if (project.manager?._id) {
                peopleMap.set(
                    project.manager._id,
                    project.manager
                );
            }

            project.members?.forEach((member) => {
                if (member?._id) {
                    peopleMap.set(
                        member._id,
                        member
                    );
                }
            });

        });

        return Array.from(peopleMap.values()).sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }, [projects]);


    /* =========================================================
       FILTER PROJECTS
    ========================================================= */

    const filteredProjects = useMemo(() => {

        const searchValue = search
            .trim()
            .toLowerCase();

        return projects.filter((project) => {

            const matchesSearch =
                !searchValue ||
                project.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                project.description
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesStatus =
                statusFilter === "ALL" ||
                project.status === statusFilter;


            let matchesPerson = true;

            if (
                user?.role === "ADMIN" &&
                personFilter !== "ALL"
            ) {

                const managerId =
                    project.manager?._id;

                const memberIds =
                    project.members?.map(
                        (member) => member._id
                    ) || [];

                matchesPerson =
                    managerId === personFilter ||
                    memberIds.includes(personFilter);
            }


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPerson
            );
        });

    }, [
        projects,
        search,
        personFilter,
        statusFilter,
        user?.role
    ]);


    /* =========================================================
       FILTER HELPERS
    ========================================================= */

    const hasFilters =
        search.trim() !== "" ||
        personFilter !== "ALL" ||
        statusFilter !== "ALL";


    const clearFilters = () => {
        setSearch("");
        setPersonFilter("ALL");
        setStatusFilter("ALL");
    };


    /* =========================================================
       STATUS STYLES
    ========================================================= */

    const getStatusClasses = (status) => {

        switch (status?.toUpperCase()) {

            case "COMPLETED":
            case "DONE":
                return `
                    border-[#BFE3D2]
                    bg-[#EDF9F3]
                    text-[#27805B]
                `;

            case "IN_PROGRESS":
            case "IN PROGRESS":
                return `
                    border-[#C7DCEF]
                    bg-[#EFF6FC]
                    text-[#3975A8]
                `;

            case "PLANNING":
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


    /* =========================================================
       STATUS DOT
    ========================================================= */

    const getStatusDot = (status) => {

        switch (status?.toUpperCase()) {

            case "COMPLETED":
            case "DONE":
                return "bg-[#2E9B70]";

            case "IN_PROGRESS":
            case "IN PROGRESS":
                return "bg-[#4C91C9]";

            case "PLANNING":
            case "TODO":
                return "bg-[#D89B24]";

            default:
                return "bg-[#99938D]";
        }
    };


    return (
        <AppLayout className="space-y-5 space-x-2">

            <div className="mx-4 space-y-5 pb-8 sm:mx-6 lg:mx-8 xl:mx-10">

                {/* =================================================
                    FILTER / ACTION BAR
                ================================================== */}

                <div
                    className="
                        rounded-2xl

                        border
                        border-[#E2DEDA]

                        bg-white

                        p-4
                        mt-2
                        shadow-[0_6px_22px_rgba(0,0,0,0.035)]
                    "
                >


                    <div
                        className="
                            flex
                            flex-col
                            gap-3

                            lg:flex-row
                            lg:items-center
                        "
                    >

                        {/* =================================================
                            SEARCH
                        ================================================== */}

                        <div className="relative flex-1">

                            <svg
                                className="
                                    pointer-events-none

                                    absolute
                                    left-3
                                    top-1/2

                                    h-5
                                    w-5

                                    -translate-y-1/2

                                    text-[#A5A09B]
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
                                placeholder="Search projects..."

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

                                    placeholder:text-[#AAA5A0]

                                    hover:border-[#CFC9C4]

                                    focus:border-[#FFAD86]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[#FF7A45]/[0.08]
                                "
                            />

                        </div>


                        {/* =================================================
                            ADMIN PEOPLE FILTER
                        ================================================== */}

                        {user?.role === "ADMIN" && (

                            <select
                                value={personFilter}
                                onChange={(e) =>
                                    setPersonFilter(e.target.value)
                                }

                                className="
                                    rounded-xl

                                    border
                                    border-[#DDD9D5]

                                    bg-[#FCFBFA]

                                    px-4
                                    py-3

                                    text-sm
                                    font-medium
                                    text-[#55504B]

                                    outline-none

                                    transition-all
                                    duration-200

                                    hover:border-[#CFC9C4]

                                    focus:border-[#FFAD86]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[#FF7A45]/[0.08]

                                    lg:w-48
                                "
                            >

                                <option value="ALL">
                                    All People
                                </option>

                                {people.map((person) => (
                                    <option
                                        key={person._id}
                                        value={person._id}
                                    >
                                        {person.name}
                                    </option>
                                ))}

                            </select>

                        )}


                        {/* =================================================
                            STATUS FILTER
                        ================================================== */}

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

                                px-4
                                py-3

                                text-sm
                                font-medium
                                text-[#55504B]

                                outline-none

                                transition-all
                                duration-200

                                hover:border-[#CFC9C4]

                                focus:border-[#FFAD86]
                                focus:bg-white
                                focus:ring-4
                                focus:ring-[#FF7A45]/[0.08]

                                lg:w-44
                            "
                        >

                            <option value="ALL">
                                All Statuses
                            </option>

                            <option value="PLANNING">
                                Planning
                            </option>

                            <option value="IN_PROGRESS">
                                In Progress
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                        </select>


                        {/* =================================================
                            NEW PROJECT
                        ================================================== */}

                        {(user?.role === "ADMIN" ||
                            user?.role === "MANAGER") && (

                            <Link
                                to="/projects/new"

                                className="
                                    inline-flex
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

                                    whitespace-nowrap

                                    shadow-[0_5px_16px_rgba(255,122,69,0.18)]

                                    transition-all
                                    duration-200

                                    hover:bg-[#FF8B5C]
                                    hover:-translate-y-0.5
                                    hover:shadow-[0_8px_20px_rgba(255,122,69,0.25)]

                                    active:scale-95
                                "
                            >

                                <span className="text-lg leading-none">
                                    +
                                </span>

                                New Project

                            </Link>

                        )}

                    </div>


                    {/* =================================================
                        FILTER SUMMARY
                    ================================================== */}

                    <div
                        className="
                            mt-4

                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-2

                            text-xs
                            text-[#8B8580]
                        "
                    >

                        <span>
                            Showing{" "}
                            <strong className="text-[#55504B]">
                                {filteredProjects.length}
                            </strong>{" "}
                            of{" "}
                            <strong className="text-[#55504B]">
                                {projects.length}
                            </strong>{" "}
                            projects
                        </span>


                        {hasFilters && (

                            <button
                                type="button"
                                onClick={clearFilters}

                                className="
                                    font-semibold
                                    text-[#E86632]

                                    transition-colors
                                    duration-200

                                    hover:text-[#C84F20]
                                "
                            >
                                Clear filters
                            </button>

                        )}

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

                            px-4
                            py-3

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
                            xl:grid-cols-3
                            
                        "
                    >

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (

                                <div
                                    key={item}

                                    className="
                                        h-72

                                        animate-pulse

                                        rounded-2xl

                                        border
                                        border-[#E5E1DD]

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
                    filteredProjects.length === 0 && (

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
                                        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2h7A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
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
                                    ? "No projects match your filters"
                                    : "No projects yet"}
                            </h3>


                            <p
                                className="
                                    mt-1

                                    text-sm
                                    text-[#888888]
                                "
                            >
                                {hasFilters
                                    ? "Try changing your search or filters."
                                    : "Create your first project to get started."}
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
                                        duration-200

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
                    PROJECT CARDS
                ================================================== */}

                {!loading &&
                    !error &&
                    filteredProjects.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5

                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {filteredProjects.map(
                                (project) => (

                                    <div
                                        key={project._id}

                                        className="
                                            group
                                            relative

                                            flex
                                            flex-col

                                            overflow-hidden

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

                                        {/* =================================================
                                            TOP ACCENT
                                        ================================================== */}

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

                                                opacity-80

                                                transition-opacity
                                                duration-200

                                                group-hover:opacity-100
                                            "
                                        />


                                        {/* =================================================
                                            SUBTLE CORNER GLOW
                                        ================================================== */}

                                        <div
                                            className="
                                                pointer-events-none

                                                absolute
                                                -right-12
                                                -top-12

                                                h-32
                                                w-32

                                                rounded-full

                                                bg-[#FF7A45]/[0.06]

                                                blur-2xl

                                                transition-all
                                                duration-300

                                                group-hover:bg-[#FF7A45]/[0.10]
                                            "
                                        />


                                        {/* =================================================
                                            CARD TOP
                                        ================================================== */}

                                        <div
                                            className="
                                                relative

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
                                                            shrink-0

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
                                                        Project
                                                    </span>

                                                </div>


                                                <h3
                                                    className="
                                                        truncate

                                                        text-lg
                                                        font-bold
                                                        text-[#252525]

                                                        transition-colors
                                                        duration-200

                                                        group-hover:text-[#E86632]
                                                    "
                                                >
                                                    {project.name}
                                                </h3>

                                            </div>


                                            {/* Status */}

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

                                                    ${getStatusClasses(
                                                        project.status
                                                    )}
                                                `}
                                            >

                                                <span
                                                    className={`
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full

                                                        ${getStatusDot(
                                                            project.status
                                                        )}
                                                    `}
                                                />

                                                {project.status}

                                            </span>

                                        </div>


                                        {/* =================================================
                                            DESCRIPTION
                                        ================================================== */}

                                        <p
                                            className="
                                                relative

                                                mt-4

                                                min-h-[60px]

                                                line-clamp-3

                                                text-sm
                                                leading-5

                                                text-[#77716C]
                                            "
                                        >
                                            {project.description ||
                                                "No description provided."}
                                        </p>


                                        {/* =================================================
                                            PROJECT INFORMATION
                                        ================================================== */}

                                        <div
                                            className="
                                                relative

                                                mt-5

                                                rounded-xl

                                                border
                                                border-[#EEEAE6]

                                                bg-[#FCFBFA]

                                                p-3.5

                                                space-y-3
                                            "
                                        >

                                            {/* Manager */}

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
                                                    Manager
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
                                                        {project.manager?.name
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
                                                        {project.manager?.name ||
                                                            "Not assigned"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* Members */}

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
                                                    Members
                                                </span>


                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            h-6
                                                            w-6
                                                            items-center
                                                            justify-center

                                                            rounded-full

                                                            bg-[#F2F0ED]

                                                            text-[#77716C]
                                                        "
                                                    >
                                                        <svg
                                                            className="h-3.5 w-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.8"
                                                                d="M16 19a4 4 0 0 0-8 0m4-8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm6 8a4 4 0 0 0-3-3.87M17 4.13a3.5 3.5 0 0 1 0 6.74"
                                                            />
                                                        </svg>
                                                    </div>


                                                    <strong
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-[#494541]
                                                        "
                                                    >
                                                        {project.members?.length ||
                                                            0}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* Created */}

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
                                                    Created
                                                </span>


                                                <strong
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        text-[#494541]
                                                    "
                                                >
                                                    {project.createdAt
                                                        ? new Date(
                                                              project.createdAt
                                                          ).toLocaleDateString(
                                                              "en-IN",
                                                              {
                                                                  day: "2-digit",
                                                                  month: "short",
                                                                  year: "numeric"
                                                              }
                                                          )
                                                        : "Unknown"}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            FOOTER
                                        ================================================== */}

                                        <div
                                            className="
                                                relative

                                                mt-5

                                                border-t
                                                border-[#EEEAE6]

                                                pt-4
                                            "
                                        >

                                            <Link
                                                to={`/projects/${project._id}`}

                                                className="
                                                    inline-flex
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2

                                                    rounded-xl

                                                    border
                                                    border-[#E3DED9]

                                                    bg-[#FCFBFA]

                                                    px-4
                                                    py-2.5

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

                                )
                            )}

                        </div>

                    )}

            </div>

        </AppLayout>
    );
};

export default Projects;