import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks");

            setTasks(response.data.tasks);
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

    const canCreateTask =
        user?.role === "ADMIN" ||
        user?.role === "MANAGER";

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <h1>Tasks</h1>

                    <p>
                        Track work across your projects.
                    </p>
                </div>

                {canCreateTask && (
                    <Link
                        to="/tasks/new"
                        className="primary-button"
                    >
                        + New Task
                    </Link>
                )}
            </div>

            {loading && (
                <div className="state-message">
                    Loading tasks...
                </div>
            )}

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                tasks.length === 0 && (
                    <div className="empty-state">
                        <h3>No tasks yet</h3>

                        <p>
                            Tasks assigned to you or created
                            for your projects will appear here.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                tasks.length > 0 && (
                    <div className="task-grid">
                        {tasks.map((task) => (
                            <div
                                className="task-card"
                                key={task._id}
                            >
                                <div className="task-card-header">
                                    <h3>{task.title}</h3>

                                    <span
                                        className={`priority-badge ${task.priority.toLowerCase()}`}
                                    >
                                        {task.priority}
                                    </span>
                                </div>

                                <p className="task-description">
                                    {task.description ||
                                        "No description provided."}
                                </p>

                                <div className="task-info">
                                    <span>Project</span>

                                    <strong>
                                        {task.project?.name ||
                                            "Unknown"}
                                    </strong>
                                </div>

                                <div className="task-info">
                                    <span>Assigned to</span>

                                    <strong>
                                        {task.assignedTo?.name ||
                                            "Unassigned"}
                                    </strong>
                                </div>

                                <div className="task-footer">
                                    <span
                                        className={`task-status ${task.status.toLowerCase()}`}
                                    >
                                        {task.status.replace(
                                            "_",
                                            " "
                                        )}
                                    </span>

                                    <Link
                                        to={`/tasks/${task._id}`}
                                        className="secondary-button"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </AppLayout>
    );
};

export default Tasks;