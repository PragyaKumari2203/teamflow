import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();

    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "PLANNING",
        manager: "",
        members: []
    });

    const [managers, setManagers] = useState([]);
    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditing);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const usersResponse = await api.get("/users");

                const allUsers = usersResponse.data.users;

                setManagers(
                    allUsers.filter(
                        (item) =>
                            item.role === "ADMIN" ||
                            item.role === "MANAGER"
                    )
                );

                setMembers(
                    allUsers.filter(
                        (item) => item.role === "MEMBER"
                    )
                );

                if (isEditing) {
                    const projectResponse = await api.get(
                        `/projects/${id}`
                    );

                    const project =
                        projectResponse.data.project;

                    setFormData({
                        name: project.name,
                        description: project.description,
                        status: project.status,
                        manager: project.manager?._id || "",
                        members:
                            project.members?.map(
                                (member) => member._id
                            ) || []
                    });
                } else if (user?.role === "MANAGER") {
                    setFormData((current) => ({
                        ...current,
                        manager: user._id
                    }));
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load project information"
                );
            } finally {
                setPageLoading(false);
            }
        };

        loadData();
    }, [id, isEditing, user]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleMemberChange = (event) => {
        const selectedValues = Array.from(
            event.target.selectedOptions,
            (option) => option.value
        );

        setFormData((current) => ({
            ...current,
            members: selectedValues
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            if (isEditing) {
                await api.patch(
                    `/projects/${id}`,
                    formData
                );
            } else {
                await api.post(
                    "/projects",
                    formData
                );
            }

            navigate("/projects");
        } catch (error) {
            const validationErrors =
                error.response?.data?.errors;

            if (validationErrors?.length) {
                setError(
                    validationErrors
                        .map((item) => item.msg)
                        .join(", ")
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Unable to save project"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <AppLayout>
                <div className="state-message">
                    Loading project...
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="page-header">
                <div>
                    <h1>
                        {isEditing
                            ? "Edit Project"
                            : "Create Project"}
                    </h1>

                    <p>
                        {isEditing
                            ? "Update project information."
                            : "Set up a new project for your team."}
                    </p>
                </div>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Project Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter project name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the project"
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Manager</label>

                            {user?.role === "MANAGER" ? (
                                <input
                                    type="text"
                                    value={user.name}
                                    disabled
                                />
                            ) : (
                                <select
                                    name="manager"
                                    value={formData.manager}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select manager
                                    </option>

                                    {managers.map(
                                        (manager) => (
                                            <option
                                                key={manager._id}
                                                value={
                                                    manager._id
                                                }
                                            >
                                                {manager.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="PLANNING">
                                    Planning
                                </option>

                                <option value="ACTIVE">
                                    Active
                                </option>

                                <option value="COMPLETED">
                                    Completed
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Team Members</label>

                        <select
                            multiple
                            value={formData.members}
                            onChange={handleMemberChange}
                            className="member-select"
                        >
                            {members.map((member) => (
                                <option
                                    key={member._id}
                                    value={member._id}
                                >
                                    {member.name}
                                </option>
                            ))}
                        </select>

                        <small>
                            Hold Ctrl/Cmd to select multiple
                            members.
                        </small>
                    </div>

                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate("/projects")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                ? "Update Project"
                                : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default ProjectForm;