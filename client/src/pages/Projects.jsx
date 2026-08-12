import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/projects");

            setProjects(response.data.projects);
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

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p>
                        Manage and track your team's projects.
                    </p>
                </div>

                {(user?.role === "ADMIN" ||
                    user?.role === "MANAGER") && (
                    <Link
                        to="/projects/new"
                        className="primary-button"
                    >
                        + New Project
                    </Link>
                )}
            </div>

            {loading && (
                <div className="state-message">
                    Loading projects...
                </div>
            )}

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {!loading && !error && projects.length === 0 && (
                <div className="empty-state">
                    <h3>No projects yet</h3>

                    <p>
                        Create your first project to get started.
                    </p>
                </div>
            )}

            {!loading && !error && projects.length > 0 && (
                <div className="project-grid">
                    {projects.map((project) => (
                        <div
                            className="project-card"
                            key={project._id}
                        >
                            <div className="project-card-top">
                                <h3>{project.name}</h3>

                                <span
                                    className={`status-badge ${project.status.toLowerCase()}`}
                                >
                                    {project.status}
                                </span>
                            </div>

                            <p className="project-description">
                                {project.description}
                            </p>

                            <div className="project-meta">
                                <span>Manager</span>

                                <strong>
                                    {project.manager?.name ||
                                        "Not assigned"}
                                </strong>
                            </div>

                            <div className="project-meta">
                                <span>Members</span>

                                <strong>
                                    {project.members?.length || 0}
                                </strong>
                            </div>

                            <Link
                                to={`/projects/${project._id}`}
                                className="secondary-button"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
};

export default Projects;