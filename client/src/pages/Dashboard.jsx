import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const StatIcon = ({ type }) => {
    if (type === "projects") {
        return (
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
        );
    }

    if (type === "tasks") {
        return (
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
                    d="m9 11 3 3L21 5"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M20 12v5.5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4H14"
                />
            </svg>
        );
    }

    if (type === "completed") {
        return (
            <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    strokeWidth="1.8"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="m8.5 12 2.3 2.3 4.7-5"
                />
            </svg>
        );
    }

    return (
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
                d="M12 3 19 6v5c0 4.4-2.9 8.1-7 9-4.1-.9-7-4.6-7-9V6l7-3Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="m9.5 12 1.7 1.7 3.5-3.5"
            />
        </svg>
    );
};

const Dashboard = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    projectsResponse,
                    tasksResponse
                ] = await Promise.all([
                    api.get("/projects"),
                    api.get("/tasks")
                ]);

                setProjects(
                    projectsResponse.data.projects || []
                );

                setTasks(
                    tasksResponse.data.tasks || []
                );
            } catch (error) {
                console.error(
                    "Unable to load dashboard data",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const completedTasks = tasks.filter(
        (task) =>
            task.status?.toLowerCase() === "completed" ||
            task.status?.toLowerCase() === "done"
    ).length;

    const recentProjects = projects.slice(0, 4);
    const recentTasks = tasks.slice(0, 4);

    const getStatusClasses = (status) => {
        const normalizedStatus = status?.toLowerCase();

        if (
            normalizedStatus === "completed" ||
            normalizedStatus === "done"
        ) {
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        }

        if (
            normalizedStatus === "in progress" ||
            normalizedStatus === "in-progress"
        ) {
            return "bg-[#FFF3ED] text-[#E86632] border-[#FFD8C5]";
        }

        return "bg-[#F5F5F5] text-[#666666] border-[#E5E5E5]";
    };

    const getRoleDescription = () => {
        switch (user?.role) {
            case "ADMIN":
                return "You have full access to users, projects, tasks, and audit logs.";

            case "MANAGER":
                return "You can create and manage projects and tasks for your team.";

            case "MEMBER":
                return "View your projects and keep track of your assigned tasks.";

            default:
                return "Manage your work and keep track of your projects and tasks.";
        }
    };

    return (
        <AppLayout>

            {/* Dashboard */}
            <div className="bg-[#F4F3F1] p-1 sm:p-2">

                {/* Header */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#E86632]">
                            Overview
                        </p>

                        <h1 className="text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
                            Welcome back, {user?.name}
                        </h1>

                        <p className="mt-2 text-sm text-[#777777] sm:text-base">
                            Here's what's happening with your TeamFlow workspace.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to="/projects"
                            className="
                                inline-flex items-center justify-center gap-2
                                rounded-xl
                                bg-[#FF7A45]
                                px-5 py-3
                                text-sm font-semibold text-white
                                shadow-[0_4px_15px_rgba(255,122,69,0.18)]
                                transition-all duration-200
                                hover:bg-[#FF8B5C]
                                hover:-translate-y-0.5
                                hover:shadow-[0_7px_20px_rgba(255,122,69,0.25)]
                                active:scale-95
                            "
                        >
                            <span className="text-lg leading-none">+</span>
                            New Project
                        </Link>
                    </div>
                </div>


                {/* Statistics */}
                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {/* Projects */}
                    <div
                        className="
                            rounded-2xl
                            border border-[#E2DEDA]
                            bg-white
                            p-5
                            shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                            transition-all duration-200
                            hover:-translate-y-1
                            hover:border-[#FFD5C2]
                            hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)]
                        "
                    >
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-[#888888]">
                                    Projects
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#171717]">
                                    {loading ? "..." : projects.length}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#FFF1E9] p-3 text-[#FF7A45]">
                                <StatIcon type="projects" />
                            </div>

                        </div>

                        <Link
                            to="/projects"
                            className="mt-4 inline-block text-xs font-semibold text-[#E86632] transition hover:text-[#FF7A45]"
                        >
                            View projects →
                        </Link>
                    </div>


                    {/* Tasks */}
                    <div
                        className="
                            rounded-2xl
                            border border-[#E2DEDA]
                            bg-white
                            p-5
                            shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                            transition-all duration-200
                            hover:-translate-y-1
                            hover:border-[#D5D5D5]
                            hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)]
                        "
                    >
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-[#888888]">
                                    Total Tasks
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#171717]">
                                    {loading ? "..." : tasks.length}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#F1F1F1] p-3 text-[#555555]">
                                <StatIcon type="tasks" />
                            </div>

                        </div>

                        <Link
                            to="/tasks"
                            className="mt-4 inline-block text-xs font-semibold text-[#555555] transition hover:text-[#E86632]"
                        >
                            View tasks →
                        </Link>
                    </div>


                    {/* Completed */}
                    <div
                        className="
                            rounded-2xl
                            border border-[#E2DEDA]
                            bg-white
                            p-5
                            shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                            transition-all duration-200
                            hover:-translate-y-1
                            hover:border-emerald-200
                            hover:shadow-[0_8px_25px_rgba(0,0,0,0.07)]
                        "
                    >
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-[#888888]">
                                    Completed Tasks
                                </p>

                                <p className="mt-2 text-3xl font-bold text-[#171717]">
                                    {loading ? "..." : completedTasks}
                                </p>
                            </div>

                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                <StatIcon type="completed" />
                            </div>

                        </div>

                        <p className="mt-4 text-xs text-[#888888]">
                            Tasks marked as completed
                        </p>
                    </div>


                    {/* Role */}
                    <div
                        className="
                            rounded-2xl
                            border border-[#292929]
                            bg-[#111111]
                            p-5
                            text-white
                            shadow-[0_5px_20px_rgba(0,0,0,0.10)]
                            transition-all duration-200
                            hover:-translate-y-1
                            hover:border-[#3A3A3A]
                        "
                    >
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-[#777777]">
                                    Your Role
                                </p>

                                <p className="mt-2 text-2xl font-bold text-[#EEEEEE]">
                                    {user?.role}
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#FF7A45]/10 p-3 text-[#FF7A45]">
                                <StatIcon type="role" />
                            </div>

                        </div>

                        <p className="mt-4 text-xs text-[#777777]">
                            Access level in TeamFlow
                        </p>
                    </div>

                </div>


                {/* Main content */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* Project Overview */}
                    <div className="xl:col-span-2 rounded-2xl border border-[#E2DEDA] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

                        <div className="flex items-center justify-between border-b border-[#ECE9E5] px-5 py-5 sm:px-6">

                            <div>
                                <h2 className="text-base font-semibold text-[#171717]">
                                    Project Overview
                                </h2>

                                <p className="mt-1 text-xs text-[#888888]">
                                    Your latest projects
                                </p>
                            </div>

                            <Link
                                to="/projects"
                                className="text-xs font-semibold text-[#E86632] hover:text-[#FF7A45]"
                            >
                                View all →
                            </Link>

                        </div>


                        <div className="p-5 sm:p-6">

                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="h-14 animate-pulse rounded-xl bg-[#F1F0EE]"
                                        />
                                    ))}
                                </div>
                            ) : recentProjects.length === 0 ? (

                                <div className="py-10 text-center">

                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1E9] text-[#FF7A45]">
                                        <StatIcon type="projects" />
                                    </div>

                                    <h3 className="font-semibold text-[#222222]">
                                        No projects yet
                                    </h3>

                                    <p className="mt-1 text-sm text-[#888888]">
                                        Create your first project to get started.
                                    </p>

                                    <Link
                                        to="/projects"
                                        className="mt-4 inline-flex rounded-xl bg-[#FF7A45] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FF8B5C]"
                                    >
                                        Create Project
                                    </Link>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {recentProjects.map((project) => (
                                        <Link
                                            key={project._id}
                                            to={`/projects/${project._id}`}
                                            className="
                                                block rounded-xl
                                                border border-[#ECE9E5]
                                                p-4
                                                transition-all duration-200
                                                hover:border-[#FFD5C2]
                                                hover:bg-[#FFFBF8]
                                                hover:translate-x-0.5
                                            "
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="min-w-0">

                                                    <h3 className="truncate text-sm font-semibold text-[#333333]">
                                                        {project.name}
                                                    </h3>

                                                    {project.description && (
                                                        <p className="mt-1 truncate text-xs text-[#888888]">
                                                            {project.description}
                                                        </p>
                                                    )}

                                                </div>

                                                {project.status && (
                                                    <span
                                                        className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                                            project.status
                                                        )}`}
                                                    >
                                                        {project.status}
                                                    </span>
                                                )}

                                            </div>
                                        </Link>
                                    ))}

                                </div>
                            )}

                        </div>
                    </div>


                    {/* Role / Quick Actions */}
                    <div className="space-y-6">

                        {/* Role Card */}
                        <div className="rounded-2xl bg-[#111111] p-6 text-white shadow-[0_6px_22px_rgba(0,0,0,0.12)]">

                            <div className="mb-5 flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-[#777777]">
                                        Workspace access
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold text-[#EEEEEE]">
                                        {user?.role} Workspace
                                    </h2>
                                </div>

                                <div className="rounded-xl bg-[#FF7A45]/10 p-3 text-[#FF7A45]">
                                    <StatIcon type="role" />
                                </div>

                            </div>

                            <p className="text-sm leading-6 text-[#999999]">
                                {getRoleDescription()}
                            </p>

                            {user?.role === "ADMIN" && (
                                <Link
                                    to="/audit-logs"
                                    className="mt-5 inline-block text-sm font-semibold text-[#FF7A45] hover:text-[#FF8B5C]"
                                >
                                    View audit logs →
                                </Link>
                            )}

                        </div>


                        {/* Quick Actions */}
                        <div className="rounded-2xl border border-[#E2DEDA] bg-white p-5 shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

                            <h2 className="text-base font-semibold text-[#171717]">
                                Quick Actions
                            </h2>

                            <p className="mt-1 text-xs text-[#888888]">
                                Jump straight into your workflow.
                            </p>

                            <div className="mt-4 space-y-3">

                                <Link
                                    to="/projects"
                                    className="
                                        flex items-center gap-3
                                        rounded-xl
                                        border border-[#E7E3DF]
                                        p-3
                                        transition-all duration-200
                                        hover:border-[#FFD5C2]
                                        hover:bg-[#FFFBF8]
                                    "
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF1E9] text-lg font-semibold text-[#FF7A45]">
                                        +
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#333333]">
                                            New Project
                                        </p>

                                        <p className="text-xs text-[#888888]">
                                            Start a new project
                                        </p>
                                    </div>
                                </Link>


                                <Link
                                    to="/tasks"
                                    className="
                                        flex items-center gap-3
                                        rounded-xl
                                        border border-[#E7E3DF]
                                        p-3
                                        transition-all duration-200
                                        hover:border-[#D5D5D5]
                                        hover:bg-[#FAFAFA]
                                    "
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1F1F1] text-lg font-semibold text-[#555555]">
                                        +
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#333333]">
                                            New Task
                                        </p>

                                        <p className="text-xs text-[#888888]">
                                            Add work to track
                                        </p>
                                    </div>
                                </Link>

                            </div>
                        </div>

                    </div>
                </div>


                {/* Recent Tasks */}
                <div className="mt-6 rounded-2xl border border-[#E2DEDA] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.04)]">

                    <div className="flex items-center justify-between border-b border-[#ECE9E5] px-5 py-5 sm:px-6">

                        <div>
                            <h2 className="text-base font-semibold text-[#171717]">
                                Recent Tasks
                            </h2>

                            <p className="mt-1 text-xs text-[#888888]">
                                Latest work across your workspace
                            </p>
                        </div>

                        <Link
                            to="/tasks"
                            className="text-xs font-semibold text-[#E86632] hover:text-[#FF7A45]"
                        >
                            View all →
                        </Link>

                    </div>


                    <div className="p-5 sm:p-6">

                        {loading ? (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="h-16 animate-pulse rounded-xl bg-[#F1F0EE]"
                                    />
                                ))}
                            </div>
                        ) : recentTasks.length === 0 ? (

                            <div className="py-8 text-center">

                                <p className="text-sm font-medium text-[#555555]">
                                    No tasks available.
                                </p>

                                <Link
                                    to="/tasks"
                                    className="mt-2 inline-block text-sm font-semibold text-[#E86632]"
                                >
                                    Go to Tasks →
                                </Link>

                            </div>

                        ) : (

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                                {recentTasks.map((task) => (
                                    <Link
                                        key={task._id}
                                        to={`/tasks/${task._id}`}
                                        className="
                                            rounded-xl
                                            border border-[#ECE9E5]
                                            p-4
                                            transition-all duration-200
                                            hover:border-[#FFD5C2]
                                            hover:bg-[#FFFBF8]
                                        "
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="min-w-0">

                                                <h3 className="truncate text-sm font-semibold text-[#333333]">
                                                    {task.title}
                                                </h3>

                                                {task.description && (
                                                    <p className="mt-1 truncate text-xs text-[#888888]">
                                                        {task.description}
                                                    </p>
                                                )}

                                            </div>

                                            {task.status && (
                                                <span
                                                    className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold ${getStatusClasses(
                                                        task.status
                                                    )}`}
                                                >
                                                    {task.status}
                                                </span>
                                            )}

                                        </div>

                                    </Link>
                                ))}

                            </div>
                        )}

                    </div>
                </div>

            </div>
        </AppLayout>
    );
};

export default Dashboard;