import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        user,
        loading: authLoading
    } = useAuth();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const fetchTask = async () => {
        try {
            const response = await api.get(
                `/tasks/${id}`
            );

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
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
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

    const handleStatusChange = async (
        event
    ) => {
        try {
            const response = await api.patch(
                `/tasks/${id}`,
                {
                    status: event.target.value
                }
            );

            setTask(response.data.task);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update task"
            );
        }
    };

    if (loading || authLoading) {
    return (
        <AppLayout>
            <div className="state-message">
                Loading task...
            </div>
        </AppLayout>
    );
}

    if (!task) {
        return (
            <AppLayout>
                <div className="error-box">
                    {error || "Task not found"}
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <Link
                        to="/tasks"
                        className="back-link"
                    >
                        ← Back to Tasks
                    </Link>

                    <h1>{task.title}</h1>

                    <p>
                        View task details and progress.
                    </p>
                </div>

                {canManage && (
                    <div className="action-group">
                        <Link
                            to={`/tasks/${task._id}/edit`}
                            className="secondary-button"
                        >
                            Edit Task
                        </Link>

                        <button
                            className="danger-button"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete Task"}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            <div className="details-grid">
                <section className="details-card">
                    <div className="details-card-header">
                        <h2>Task Information</h2>

                        <span
                            className={`priority-badge ${task.priority.toLowerCase()}`}
                        >
                            {task.priority}
                        </span>
                    </div>

                    <div className="detail-section">
                        <span>Description</span>

                        <p>
                            {task.description ||
                                "No description provided."}
                        </p>
                    </div>

                    <div className="detail-row">
                        <span>Project</span>

                        <strong>
                            {task.project?.name ||
                                "Unknown"}
                        </strong>
                    </div>

                    <div className="detail-row">
                        <span>Assigned To</span>

                        <strong>
                            {task.assignedTo?.name ||
                                "Unknown"}
                        </strong>
                    </div>

                    <div className="detail-row">
                        <span>Created By</span>

                        <strong>
                            {task.createdBy?.name ||
                                "Unknown"}
                        </strong>
                    </div>

                    <div className="detail-row">
                        <span>Due Date</span>

                        <strong>
                            {task.dueDate
                                ? new Date(
                                      task.dueDate
                                  ).toLocaleDateString()
                                : "No due date"}
                        </strong>
                    </div>
                </section>

                <section className="details-card">
                    <div className="details-card-header">
                        <h2>Status</h2>
                    </div>

                    {isAssignedMember ? (
                        <div className="form-group">
                            <label>
                                Update your task status
                            </label>

                            <select
                                value={task.status}
                                onChange={
                                    handleStatusChange
                                }
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
                        </div>
                    ) : (
                        <span
                            className={`task-status ${task.status.toLowerCase()}`}
                        >
                            {task.status.replace(
                                "_",
                                " "
                            )}
                        </span>
                    )}
                </section>
            </div>
        </AppLayout>
    );
};

export default TaskDetails;