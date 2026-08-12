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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const fetchProject = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/projects/${id}`);

            setProject(response.data.project);
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
        fetchProject();
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

        if (!confirmed) {
            return;
        }

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

    if (loading) {
        return (
            <AppLayout>
                <div className="state-message">
                    Loading project...
                </div>
            </AppLayout>
        );
    }

    if (error && !project) {
        return (
            <AppLayout>
                <div className="error-box">
                    {error}
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <Link
                        to="/projects"
                        className="back-link"
                    >
                        ← Back to Projects
                    </Link>

                    <h1>{project.name}</h1>

                    <p>
                        View project information and team members.
                    </p>
                </div>

                {canManageProject && (
                    <div className="action-group">
                        <Link
                            to={`/projects/${project._id}/edit`}
                            className="secondary-button"
                        >
                            Edit Project
                        </Link>

                        <button
                            className="danger-button"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete Project"}
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
                        <h2>Project Overview</h2>

                        <span
                            className={`status-badge ${project.status.toLowerCase()}`}
                        >
                            {project.status}
                        </span>
                    </div>

                    <div className="detail-section">
                        <span>Description</span>

                        <p>
                            {project.description}
                        </p>
                    </div>

                    <div className="detail-row">
                        <span>Manager</span>

                        <strong>
                            {project.manager?.name ||
                                "Not assigned"}
                        </strong>
                    </div>

                    <div className="detail-row">
                        <span>Created by</span>

                        <strong>
                            {project.createdBy?.name ||
                                "Unknown"}
                        </strong>
                    </div>

                    <div className="detail-row">
                        <span>Created</span>

                        <strong>
                            {new Date(
                                project.createdAt
                            ).toLocaleDateString()}
                        </strong>
                    </div>
                </section>

                <section className="details-card">
                    <div className="details-card-header">
                        <h2>Team Members</h2>

                        <span className="member-count">
                            {project.members?.length || 0}
                        </span>
                    </div>

                    {project.members?.length > 0 ? (
                        <div className="member-list">
                            {project.members.map((member) => (
                                <div
                                    className="member-item"
                                    key={member._id}
                                >
                                    <div className="member-avatar">
                                        {member.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {member.name}
                                        </strong>

                                        <span>
                                            {member.email}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="small-empty-state">
                            No members have been assigned yet.
                        </div>
                    )}
                </section>
            </div>

            <section className="details-card tasks-preview">
                <div className="details-card-header">
                    <div>
                        <h2>Project Tasks</h2>

                        <p>
                            Tasks for this project will appear here.
                        </p>
                    </div>
                </div>

                <div className="small-empty-state">
                    No tasks have been created yet.
                </div>
            </section>
        </AppLayout>
    );
};

export default ProjectDetails;