import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            setError("");

            const [projectResponse, tasksResponse] =
                await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get("/tasks")
                ]);

            setProject(projectResponse.data.project);

            const allTasks = tasksResponse.data.tasks || [];

            const projectTasks = allTasks.filter(
                (task) =>
                    task.project?._id === id ||
                    task.project === id
            );

            setTasks(projectTasks);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load project"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const canManageProject =
        user?.role === "ADMIN" ||
        (
            user?.role === "MANAGER" &&
            project?.manager?._id === user?._id
        );

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);
            await api.delete(`/projects/${id}`);
            navigate("/projects");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to delete project"
            );
            setDeleting(false);
        }
    };

    const getStatusClasses = (status) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
            case "DONE":
                return "border-[#BFE3D2] bg-[#EDF9F3] text-[#27805B]";

            case "IN_PROGRESS":
            case "IN PROGRESS":
                return "border-[#C7DCEF] bg-[#EFF6FC] text-[#3975A8]";

            case "PENDING":
            case "TODO":
            case "PLANNING":
                return "border-[#F1D9A8] bg-[#FFF8E8] text-[#9A6A12]";

            default:
                return "border-[#DDD9D5] bg-[#F8F7F5] text-[#706B66]";
        }
    };

    const getStatusDot = (status) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
            case "DONE":
                return "bg-[#2E9B70]";

            case "IN_PROGRESS":
            case "IN PROGRESS":
                return "bg-[#4C91C9]";

            case "PENDING":
            case "TODO":
            case "PLANNING":
                return "bg-[#D89B24]";

            default:
                return "bg-[#99938D]";
        }
    };

    const formatStatus = (status) => {
        if (!status) return "Unknown";

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const completedTasks = tasks.filter(
        (task) =>
            task.status?.toUpperCase() === "COMPLETED" ||
            task.status?.toUpperCase() === "DONE"
    ).length;

    const activeTasks = tasks.filter(
        (task) =>
            task.status?.toUpperCase() === "IN_PROGRESS" ||
            task.status?.toUpperCase() === "IN PROGRESS"
    ).length;

    if (loading) {
        return (
            <AppLayout>
                <div className="mx-4 min-h-[calc(100vh-100px)] py-6 sm:mx-6 lg:mx-8 xl:mx-10">
                    <div className="animate-pulse space-y-6">
                        <div className="h-4 w-32 rounded bg-[#E5E0DC]" />
                        <div className="h-10 w-72 rounded bg-[#E5E0DC]" />
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div className="h-80 rounded-2xl bg-white" />
                            <div className="h-80 rounded-2xl bg-white" />
                        </div>
                        <div className="h-72 rounded-2xl bg-white" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error && !project) {
        return (
            <AppLayout>
                <div className="mx-4 py-8 sm:mx-6 lg:mx-8 xl:mx-10">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="mx-4 space-y-6 pb-10 pt-5 sm:mx-6 lg:mx-8 xl:mx-10">

                {/* HEADER */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E3DED9] bg-white px-5 py-6 shadow-[0_7px_25px_rgba(0,0,0,0.035)] sm:px-7">
                    <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#FF7A45]/[0.07] blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-1 w-28 rounded-r-full bg-[#FF7A45]" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <Link
                                to="/projects"
                                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7C756F] transition hover:text-[#E86632]"
                            >
                                <span>←</span>
                                Back to Projects
                            </Link>

                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-[#292725] sm:text-3xl">
                                    {project.name}
                                </h1>

                                <span
                                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClasses(
                                        project.status
                                    )}`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                            project.status
                                        )}`}
                                    />
                                    {formatStatus(project.status)}
                                </span>
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#817B76]">
                                View project information, team members, and tasks.
                            </p>
                        </div>

                        {canManageProject && (
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to={`/projects/${project._id}/edit`}
                                    className="rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-5 py-2.5 text-sm font-semibold text-[#55504B] transition-all hover:border-[#FFB08C] hover:bg-[#FFF5EF] hover:text-[#E86632]"
                                >
                                    Edit Project
                                </Link>

                                <button
                                    className="rounded-xl bg-[#E45748] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(228,87,72,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#D84A3B] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? "Deleting..." : "Delete Project"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* QUICK STATS */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div className="rounded-2xl border border-[#E3DED9] bg-white p-5 shadow-[0_6px_22px_rgba(0,0,0,0.035)]">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#9A948F]">
                            Members
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#292725]">
                            {project.members?.length || 0}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E3DED9] bg-white p-5 shadow-[0_6px_22px_rgba(0,0,0,0.035)]">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#9A948F]">
                            Total Tasks
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#292725]">
                            {tasks.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E3DED9] bg-white p-5 shadow-[0_6px_22px_rgba(0,0,0,0.035)]">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#9A948F]">
                            Active Tasks
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#3975A8]">
                            {activeTasks}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E3DED9] bg-white p-5 shadow-[0_6px_22px_rgba(0,0,0,0.035)]">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#9A948F]">
                            Completed Tasks
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#27805B]">
                            {completedTasks}
                        </p>
                    </div>
                </div>

                {/* PROJECT + TEAM */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* PROJECT OVERVIEW */}
                    <section className="overflow-hidden rounded-2xl border border-[#E3DED9] bg-white shadow-[0_7px_25px_rgba(0,0,0,0.035)]">
                        <div className="border-b border-[#EEEAE6] bg-[#FCFBFA] px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#E86632]">
                                    <svg
                                        className="h-5 w-5"
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

                                <div>
                                    <h2 className="font-bold text-[#292725]">
                                        Project Overview
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[#8D8781]">
                                        Basic project information
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 p-5 sm:p-6">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A09A95]">
                                    Description
                                </span>

                                <p className="mt-2 text-sm leading-6 text-[#625D58]">
                                    {project.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                    ["Manager", project.manager?.name || "Not assigned"],
                                    ["Created by", project.createdBy?.name || "Unknown"],
                                    [
                                        "Created",
                                        project.createdAt
                                            ? new Date(project.createdAt).toLocaleDateString(
                                                  "en-IN",
                                                  {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric"
                                                  }
                                              )
                                            : "Unknown"
                                    ],
                                    ["Tasks", tasks.length]
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-xl border border-[#EEEAE6] bg-[#FCFBFA] p-4"
                                    >
                                        <span className="text-xs text-[#9A948F]">
                                            {label}
                                        </span>

                                        <p className="mt-1 truncate text-sm font-semibold text-[#403C38]">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* TEAM MEMBERS */}
                    <section className="overflow-hidden rounded-2xl border border-[#E3DED9] bg-white shadow-[0_7px_25px_rgba(0,0,0,0.035)]">
                        <div className="flex items-center justify-between border-b border-[#EEEAE6] bg-[#FCFBFA] px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#E86632]">
                                    <svg
                                        className="h-5 w-5"
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

                                <div>
                                    <h2 className="font-bold text-[#292725]">
                                        Team Members
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[#8D8781]">
                                        People assigned to this project
                                    </p>
                                </div>
                            </div>

                            <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#FFF0E8] px-2 text-sm font-bold text-[#E86632]">
                                {project.members?.length || 0}
                            </span>
                        </div>

                        <div className="p-5 sm:p-6">
                            {project.members?.length > 0 ? (
                                <div className="space-y-3">
                                    {project.members.map((member) => (
                                        <div
                                            className="flex items-center gap-3 rounded-xl border border-[#EEEAE6] bg-[#FCFBFA] p-3.5 transition-all hover:border-[#FFD0BB] hover:bg-[#FFF9F5]"
                                            key={member._id}
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0E8] text-sm font-bold text-[#E86632]">
                                                {member.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0">
                                                <strong className="block truncate text-sm font-semibold text-[#383431]">
                                                    {member.name}
                                                </strong>

                                                <span className="block truncate text-xs text-[#8B8580]">
                                                    {member.email}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F1EE] text-[#9A948F]">
                                        <span className="text-lg">—</span>
                                    </div>

                                    <p className="mt-3 text-sm text-[#817B76]">
                                        No members have been assigned yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* PROJECT TASKS */}
                <section className="overflow-hidden rounded-2xl border border-[#E3DED9] bg-white shadow-[0_7px_25px_rgba(0,0,0,0.035)]">
                    <div className="flex flex-col gap-3 border-b border-[#EEEAE6] bg-[#FCFBFA] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#E86632]">
                                    <svg
                                        className="h-5 w-5"
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
                                </div>

                                <div>
                                    <h2 className="font-bold text-[#292725]">
                                        Project Tasks
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[#8D8781]">
                                        Tasks associated with this project
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/tasks"
                            className="text-sm font-semibold text-[#E86632] transition hover:text-[#C84F20]"
                        >
                            View all tasks →
                        </Link>
                    </div>

                    <div className="p-5 sm:p-6">
                        {tasks.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3ED] text-[#E86632]">
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

                                <h3 className="mt-4 font-semibold text-[#383431]">
                                    No tasks yet
                                </h3>

                                <p className="mt-1 text-sm text-[#817B76]">
                                    No tasks have been created for this project.
                                </p>

                                {(user?.role === "ADMIN" ||
                                    user?.role === "MANAGER") && (
                                    <Link
                                        to="/tasks"
                                        className="mt-4 inline-flex rounded-xl bg-[#FF7A45] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(255,122,69,0.15)] transition hover:bg-[#FF8B5C] hover:-translate-y-0.5 active:scale-95"
                                    >
                                        Create Task
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {tasks.map((task) => (
                                    <Link
                                        key={task._id}
                                        to={`/tasks/${task._id}`}
                                        className="group rounded-xl border border-[#E8E3DE] bg-[#FCFBFA] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFB08C] hover:bg-[#FFF9F5] hover:shadow-[0_7px_18px_rgba(0,0,0,0.045)]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-semibold text-[#35312E] transition-colors group-hover:text-[#E86632]">
                                                    {task.title}
                                                </h3>

                                                {task.description && (
                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#817B76]">
                                                        {task.description}
                                                    </p>
                                                )}

                                                {task.assignedTo?.name && (
                                                    <p className="mt-3 text-xs text-[#8D8781]">
                                                        Assigned to{" "}
                                                        <span className="font-semibold text-[#625D58]">
                                                            {task.assignedTo.name}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
                                                    task.status
                                                )}`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                                        task.status
                                                    )}`}
                                                />
                                                {formatStatus(task.status)}
                                            </span>
                                        </div>
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

export default ProjectDetails;