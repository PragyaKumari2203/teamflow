import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsersData = async () => {
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

                setUsers(usersResponse.data.users || []);
                setProjects(projectsResponse.data.projects || []);
                setTasks(tasksResponse.data.tasks || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load users"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsersData();
    }, []);


    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const searchValue = search
                .trim()
                .toLowerCase();

            const matchesSearch =
                !searchValue ||
                user.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                user.email
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesRole =
                roleFilter === "ALL" ||
                user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);


    const getProjectCount = (user) => {
        return projects.filter((project) => {
            const managerId =
                project.manager?._id || project.manager;

            const memberIds =
                project.members?.map(
                    (member) => member._id || member
                ) || [];

            return (
                managerId === user._id ||
                memberIds.includes(user._id)
            );
        }).length;
    };


    const getTaskCount = (user) => {
        return tasks.filter((task) => {
            const assignedUserId =
                task.assignedTo?._id ||
                task.assignedTo;

            return assignedUserId === user._id;
        }).length;
    };


    /* =========================================================
       ROLE CONFIGURATION
    ========================================================= */

    const getRoleConfig = (role) => {

        if (role === "ADMIN") {
            return {
                card:
                    "border-[#292929] bg-[#0A0A0A] hover:border-[#FF7A45]/60",

                avatar:
                    "bg-[#FF7A45] text-white shadow-[0_0_20px_rgba(255,122,69,0.18)]",

                role:
                    "bg-[#FF7A45] text-white border-[#FF7A45]",

                accent:
                    "bg-[#FF7A45]",

                stat:
                    "bg-[#111111] border-[#292929]",

                statLabel:
                    "text-[#777777]",

                statNumber:
                    "text-[#EEEEEE]",

                name:
                    "text-[#EEEEEE] group-hover:text-[#FF8B5C]",

                email:
                    "text-[#888888]",

                footerBorder:
                    "border-[#292929]",

                footerText:
                    "text-[#777777]",

                profile:
                    "text-[#FF7A45]",

                description:
                    "Full system access"
            };
        }


        if (role === "MANAGER") {
            return {
                card:
                    "border-[#E8D8CC] bg-[#FFFCFA] hover:border-[#FFB38F] hover:bg-[#FFF9F5]",

                avatar:
                    "bg-[#FFF0E8] text-[#E86632] border border-[#FFD8C5]",

                role:
                    "bg-[#FFF3ED] text-[#D85F2E] border-[#FFD8C5]",

                accent:
                    "bg-[#E86632]",

                stat:
                    "bg-[#FFF7F2] border-[#F2DED2]",

                statLabel:
                    "text-[#9A857A]",

                statNumber:
                    "text-[#333333]",

                name:
                    "text-[#292929] group-hover:text-[#E86632]",

                email:
                    "text-[#8A817D]",

                footerBorder:
                    "border-[#EFE2DA]",

                footerText:
                    "text-[#8A817D]",

                profile:
                    "text-[#E86632]",

                description:
                    "Team & project management"
            };
        }


        return {
            card:
                "border-[#DCE8E3] bg-[#FCFFFE] hover:border-[#A9D4C5] hover:bg-[#F7FCFA]",

            avatar:
                "bg-[#EAF7F1] text-[#24845E] border border-[#C8E8DA]",

            role:
                "bg-[#ECF8F3] text-[#24845E] border-[#C8E8DA]",

            accent:
                "bg-[#2E9B70]",

            stat:
                "bg-[#F3FAF7] border-[#DCEDE6]",

            statLabel:
                "text-[#71877D]",

            statNumber:
                "text-[#293A34]",

            name:
                "text-[#293A34] group-hover:text-[#24845E]",

            email:
                "text-[#71877D]",

            footerBorder:
                "border-[#E2EEE9]",

            footerText:
                "text-[#71877D]",

            profile:
                "text-[#24845E]",

            description:
                "Assigned workspace member"
        };
    };


    return (
        <AppLayout>

            <div className="mx-4 space-y-5 pb-8 sm:mx-6 lg:mx-8 xl:mx-10">

                {/* =================================================
                    SEARCH / FILTER / ADD USER
                ================================================== */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-[#E2DEDA]
                        bg-white
                        p-4

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

                        {/* Search */}

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
                                placeholder="Search users by name or email..."
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

                                    focus:border-[#FFB08B]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[#FF7A45]/[0.08]
                                "
                            />

                        </div>


                        {/* Role Filter */}

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
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

                                focus:border-[#FFB08B]
                                focus:bg-white
                                focus:ring-4
                                focus:ring-[#FF7A45]/[0.08]

                                lg:w-44
                            "
                        >

                            <option value="ALL">
                                All Roles
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>

                            <option value="MANAGER">
                                Manager
                            </option>

                            <option value="MEMBER">
                                Member
                            </option>

                        </select>


                        {/* Add User */}

                        <Link
                            to="/users/new"
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

                                shadow-[0_5px_16px_rgba(255,122,69,0.18)]

                                transition-all
                                duration-200

                                hover:bg-[#FF8B5C]
                                hover:-translate-y-0.5
                                hover:shadow-[0_8px_20px_rgba(255,122,69,0.25)]

                                active:scale-95

                                whitespace-nowrap
                            "
                        >

                            <span className="text-lg leading-none">
                                +
                            </span>

                            Add User

                        </Link>

                    </div>


                    {/* Filter information */}

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            justify-between

                            text-xs
                            text-[#8B8580]
                        "
                    >

                        <span>
                            Showing{" "}
                            <strong className="text-[#55504B]">
                                {filteredUsers.length}
                            </strong>{" "}
                            of{" "}
                            <strong className="text-[#55504B]">
                                {users.length}
                            </strong>{" "}
                            users
                        </span>


                        {(search || roleFilter !== "ALL") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setRoleFilter("ALL");
                                }}
                                className="
                                    font-semibold
                                    text-[#E86632]

                                    hover:text-[#C84F20]

                                    transition-colors
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
                            gap-4

                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="
                                    h-56
                                    animate-pulse
                                    rounded-2xl
                                    bg-white
                                    border
                                    border-[#E5E1DD]
                                "
                            />
                        ))}

                    </div>
                )}


                {/* =================================================
                    USERS
                ================================================== */}

                {!loading && !error && (
                    <>

                        {filteredUsers.length === 0 ? (

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
                                            d="M16 19a4 4 0 0 0-8 0m4-8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm6 8a4 4 0 0 0-3-3.87M17 4.13a3.5 3.5 0 0 1 0 6.74"
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
                                    No users found
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-[#888888]
                                    "
                                >
                                    Try changing your search or role filter.
                                </p>

                            </div>

                        ) : (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4

                                    md:grid-cols-2
                                    xl:grid-cols-3
                                "
                            >

                                {filteredUsers.map((user) => {

                                    const projectCount =
                                        getProjectCount(user);

                                    const taskCount =
                                        getTaskCount(user);

                                    const role =
                                        getRoleConfig(user.role);


                                    return (

                                        <Link
                                            key={user._id}
                                            to={`/users/${user._id}`}

                                            className={`
                                                group
                                                relative
                                                overflow-hidden

                                                rounded-2xl
                                                border

                                                p-5

                                                shadow-[0_6px_22px_rgba(0,0,0,0.035)]

                                                transition-all
                                                duration-200

                                                hover:-translate-y-1
                                                hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]

                                                ${role.card}
                                            `}
                                        >

                                            {/* Role accent */}

                                            <div
                                                className={`
                                                    absolute
                                                    left-0
                                                    top-0
                                                    h-full
                                                    w-1

                                                    ${role.accent}
                                                `}
                                            />


                                            {/* ADMIN glow */}

                                            {user.role === "ADMIN" && (
                                                <div
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        -right-16
                                                        -top-16
                                                        h-36
                                                        w-36
                                                        rounded-full
                                                        bg-[#FF7A45]/10
                                                        blur-2xl
                                                    "
                                                />
                                            )}


                                            {/* MANAGER glow */}

                                            {user.role === "MANAGER" && (
                                                <div
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        -right-16
                                                        -top-16
                                                        h-36
                                                        w-36
                                                        rounded-full
                                                        bg-[#E86632]/[0.07]
                                                        blur-2xl
                                                    "
                                                />
                                            )}


                                            {/* MEMBER glow */}

                                            {user.role === "MEMBER" && (
                                                <div
                                                    className="
                                                        pointer-events-none
                                                        absolute
                                                        -right-16
                                                        -top-16
                                                        h-36
                                                        w-36
                                                        rounded-full
                                                        bg-[#2E9B70]/[0.07]
                                                        blur-2xl
                                                    "
                                                />
                                            )}


                                            {/* User header */}

                                            <div
                                                className="
                                                    relative
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        min-w-0
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    {/* Avatar */}

                                                    <div
                                                        className={`
                                                            flex
                                                            h-12
                                                            w-12
                                                            shrink-0
                                                            items-center
                                                            justify-center

                                                            rounded-xl

                                                            text-lg
                                                            font-bold

                                                            transition-transform
                                                            duration-200

                                                            group-hover:scale-105

                                                            ${role.avatar}
                                                        `}
                                                    >
                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>


                                                    {/* User info */}

                                                    <div className="min-w-0">

                                                        <h3
                                                            className={`
                                                                truncate
                                                                font-semibold

                                                                transition-colors
                                                                duration-200

                                                                ${role.name}
                                                            `}
                                                        >
                                                            {user.name}
                                                        </h3>


                                                        <p
                                                            className={`
                                                                truncate
                                                                text-sm

                                                                ${role.email}
                                                            `}
                                                        >
                                                            {user.email}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Role */}

                                                <span
                                                    className={`
                                                        shrink-0
                                                        rounded-full
                                                        border

                                                        px-2.5
                                                        py-1

                                                        text-[10px]
                                                        font-bold

                                                        uppercase
                                                        tracking-wider

                                                        ${role.role}
                                                    `}
                                                >
                                                    {user.role}
                                                </span>

                                            </div>


                                            {/* Role description */}

                                            <div className="relative mt-5">

                                                <p
                                                    className={`
                                                        text-xs
                                                        font-medium

                                                        ${role.footerText}
                                                    `}
                                                >
                                                    {role.description}
                                                </p>

                                            </div>


                                            {/* Statistics */}

                                            <div
                                                className="
                                                    relative
                                                    mt-5

                                                    grid
                                                    grid-cols-2
                                                    gap-3
                                                "
                                            >

                                                {/* Projects */}

                                                <div
                                                    className={`
                                                        rounded-xl
                                                        border
                                                        p-3

                                                        ${role.stat}
                                                    `}
                                                >

                                                    <p
                                                        className={`
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wider

                                                            ${role.statLabel}
                                                        `}
                                                    >
                                                        Projects
                                                    </p>


                                                    <p
                                                        className={`
                                                            mt-1
                                                            text-xl
                                                            font-bold

                                                            ${role.statNumber}
                                                        `}
                                                    >
                                                        {projectCount}
                                                    </p>

                                                </div>


                                                {/* Tasks */}

                                                <div
                                                    className={`
                                                        rounded-xl
                                                        border
                                                        p-3

                                                        ${role.stat}
                                                    `}
                                                >

                                                    <p
                                                        className={`
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-wider

                                                            ${role.statLabel}
                                                        `}
                                                    >
                                                        Tasks
                                                    </p>


                                                    <p
                                                        className={`
                                                            mt-1
                                                            text-xl
                                                            font-bold

                                                            ${role.statNumber}
                                                        `}
                                                    >
                                                        {taskCount}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Footer */}

                                            <div
                                                className={`
                                                    relative
                                                    mt-5

                                                    flex
                                                    items-center
                                                    justify-between

                                                    border-t

                                                    pt-4

                                                    ${role.footerBorder}
                                                `}
                                            >

                                                <span
                                                    className={`
                                                        text-xs
                                                        ${role.footerText}
                                                    `}
                                                >
                                                    View user activity
                                                </span>


                                                <span
                                                    className={`
                                                        text-sm
                                                        font-semibold

                                                        transition-all
                                                        duration-200

                                                        group-hover:translate-x-1

                                                        ${role.profile}
                                                    `}
                                                >
                                                    View Profile
                                                    <span className="ml-1">
                                                        →
                                                    </span>
                                                </span>

                                            </div>

                                        </Link>

                                    );
                                })}

                            </div>

                        )}

                    </>

                )}

            </div>

        </AppLayout>
    );
};

export default Users;