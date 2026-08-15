import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, loading: authLoading } = useAuth();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const fetchTask = async () => {
        try {
            const response = await api.get(`/tasks/${id}`);
            setTask(response.data.task);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load task"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    const isAssignedMember =
        user?.role === "MEMBER" &&
        task?.assignedTo?._id?.toString() ===
            user?._id?.toString();

    const canManage =
        user?.role === "ADMIN" ||
        (
            user?.role === "MANAGER" &&
            task?.project?.manager?.toString() ===
                user?._id?.toString()
        );

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            setDeleting(true);
            await api.delete(`/tasks/${id}`);
            navigate("/tasks");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to delete task"
            );
            setDeleting(false);
        }
    };

    const handleStatusChange = async (event) => {
        try {
            const response = await api.patch(
                `/tasks/${id}`,
                { status: event.target.value }
            );

            setTask(response.data.task);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update task"
            );
        }
    };

    const getPriorityClasses = (priority) => {
        switch (priority?.toUpperCase()) {
            case "HIGH":
                return "border-[#F3C5BE] bg-[#FFF1EF] text-[#C84F43]";
            case "MEDIUM":
                return "border-[#F1D9A8] bg-[#FFF8E8] text-[#9A6A12]";
            case "LOW":
                return "border-[#BFE3D2] bg-[#EDF9F3] text-[#27805B]";
            default:
                return "border-[#DDD9D5] bg-[#F8F7F5] text-[#706B66]";
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
            case "TODO":
            case "PENDING":
                return "border-[#F1D9A8] bg-[#FFF8E8] text-[#9A6A12]";
            default:
                return "border-[#DDD9D5] bg-[#F8F7F5] text-[#706B66]";
        }
    };

    const formatStatus = (status) =>
        status
            ? status
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (letter) => letter.toUpperCase())
            : "Unknown";

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
              })
            : "No due date";

    if (loading || authLoading) {
        return (
            <AppLayout>
                <div className="mx-4 py-8 sm:mx-6 lg:mx-8 xl:mx-10">
                    <div className="animate-pulse space-y-5">
                        <div className="h-4 w-28 rounded bg-[#E5E0DC]" />
                        <div className="h-10 w-72 rounded bg-[#E5E0DC]" />
                        <div className="h-80 rounded-2xl bg-white" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!task) {
        return (
            <AppLayout>
                <div className="mx-4 py-8 sm:mx-6 lg:mx-8 xl:mx-10">
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error || "Task not found"}
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="mx-4 space-y-5 pb-8 pt-5 sm:mx-6 lg:mx-8 xl:mx-10">

                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-[#E5E0DC] pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <Link
                            to="/tasks"
                            className="text-sm font-semibold text-[#817B76] transition hover:text-[#E86632]"
                        >
                            ← Back to Tasks
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <h1 className="break-words text-2xl font-bold text-[#292725] sm:text-3xl">
                                {task.title}
                            </h1>

                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                    task.status
                                )}`}
                            >
                                {formatStatus(task.status)}
                            </span>
                        </div>
                    </div>

                    {canManage && (
                        <div className="flex shrink-0 gap-2">
                            <Link
                                to={`/tasks/${task._id}/edit`}
                                className="rounded-lg border border-[#DDD8D3] bg-white px-4 py-2.5 text-sm font-semibold text-[#55504B] transition hover:border-[#FFB08C] hover:bg-[#FFF5EF] hover:text-[#E86632]"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-lg bg-[#E45748] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D84A3B] active:scale-95 disabled:opacity-60"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Main */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {/* Task details */}
                    <section className="rounded-2xl border border-[#E3DED9] bg-white shadow-[0_5px_18px_rgba(0,0,0,0.03)] lg:col-span-2">
                        <div className="border-b border-[#EEEAE6] px-5 py-4">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="font-bold text-[#292725]">
                                    Task Details
                                </h2>

                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                        task.priority
                                    )}`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-5">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9A948F]">
                                    Description
                                </p>

                                <p className="text-sm leading-6 text-[#625D58]">
                                    {task.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-[#EEEAE6] pt-5 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-[#9A948F]">
                                        Project
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[#403C38]">
                                        {task.project?.name || "Unknown"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-[#9A948F]">
                                        Assigned To
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[#403C38]">
                                        {task.assignedTo?.name || "Unknown"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-[#9A948F]">
                                        Created By
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[#403C38]">
                                        {task.createdBy?.name || "Unknown"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-[#9A948F]">
                                        Due Date
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[#403C38]">
                                        {formatDate(task.dueDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Status */}
                    <section className="rounded-2xl border border-[#E3DED9] bg-white shadow-[0_5px_18px_rgba(0,0,0,0.03)]">
                        <div className="border-b border-[#EEEAE6] px-5 py-4">
                            <h2 className="font-bold text-[#292725]">
                                Status
                            </h2>
                        </div>

                        <div className="p-5">
                            {isAssignedMember ? (
                                <>
                                    <label
                                        htmlFor="task-status"
                                        className="mb-2 block text-sm font-semibold text-[#403C38]"
                                    >
                                        Update status
                                    </label>

                                    <select
                                        id="task-status"
                                        value={task.status}
                                        onChange={handleStatusChange}
                                        className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm font-medium text-[#55504B] outline-none transition focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                    >
                                        <option value="TODO">
                                            To Do
                                        </option>
                                        <option value="IN_PROGRESS">
                                            In Progress
                                        </option>
                                        <option value="COMPLETED">
                                            Completed
                                        </option>
                                    </select>
                                </>
                            ) : (
                                <div
                                    className={`rounded-xl border px-4 py-4 text-center text-sm font-semibold ${getStatusClasses(
                                        task.status
                                    )}`}
                                >
                                    {formatStatus(task.status)}
                                </div>
                            )}

                            <div className="mt-5 border-t border-[#EEEAE6] pt-5">
                                <p className="text-xs text-[#9A948F]">
                                    Priority
                                </p>

                                <span
                                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                                        task.priority
                                    )}`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
};

export default TaskDetails;