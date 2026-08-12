import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../services/api";

const TaskForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [projects, setProjects] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    /*
     * Load projects and, when editing,
     * load the existing task.
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                const projectsResponse =
                    await api.get("/projects");

                const availableProjects =
                    projectsResponse.data.projects;

                setProjects(availableProjects);

                if (isEditing) {
                    const taskResponse =
                        await api.get(`/tasks/${id}`);

                    const task =
                        taskResponse.data.task;

                    setFormData({
                        title: task.title,
                        description:
                            task.description || "",
                        project:
                            task.project?._id || "",
                        assignedTo:
                            task.assignedTo?._id || "",
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate
                            ? task.dueDate.substring(0, 10)
                            : ""
                    });

                    /*
                     * Find the project of the existing task
                     * and show only its members.
                     */
                    const selectedProject =
                        availableProjects.find(
                            (project) =>
                                project._id ===
                                task.project?._id
                        );

                    setProjectMembers(
                        selectedProject?.members || []
                    );
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load task information"
                );
            } finally {
                setPageLoading(false);
            }
        };

        loadData();
    }, [id, isEditing]);

    /*
     * Handles normal input changes.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    /*
     * When the project changes, update the
     * available members accordingly.
     */
    const handleProjectChange = (event) => {
        const projectId = event.target.value;

        const selectedProject =
            projects.find(
                (project) =>
                    project._id === projectId
            );

        const members =
            selectedProject?.members || [];

        setProjectMembers(members);

        /*
         * If the previously selected member
         * does not belong to the new project,
         * remove that selection.
         */
        setFormData((current) => {
            const memberStillBelongs =
                members.some(
                    (member) =>
                        member._id ===
                        current.assignedTo
                );

            return {
                ...current,
                project: projectId,
                assignedTo: memberStillBelongs
                    ? current.assignedTo
                    : ""
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            if (isEditing) {
                await api.patch(
                    `/tasks/${id}`,
                    formData
                );
            } else {
                await api.post(
                    "/tasks",
                    formData
                );
            }

            navigate("/tasks");
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
                    "Unable to save task"
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
                    Loading task...
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
                            ? "Edit Task"
                            : "Create Task"}
                    </h1>

                    <p>
                        {isEditing
                            ? "Update task information."
                            : "Create and assign work to a project member."}
                    </p>
                </div>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the task"
                            rows="5"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Project</label>

                            <select
                                name="project"
                                value={formData.project}
                                onChange={
                                    handleProjectChange
                                }
                                required
                            >
                                <option value="">
                                    Select project
                                </option>

                                {projects.map(
                                    (project) => (
                                        <option
                                            key={project._id}
                                            value={project._id}
                                        >
                                            {project.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Assign To</label>

                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                required
                                disabled={
                                    !formData.project
                                }
                            >
                                <option value="">
                                    {!formData.project
                                        ? "Select project first"
                                        : projectMembers.length === 0
                                        ? "No members in this project"
                                        : "Select member"}
                                </option>

                                {projectMembers.map(
                                    (member) => (
                                        <option
                                            key={member._id}
                                            value={member._id}
                                        >
                                            {member.name}
                                        </option>
                                    )
                                )}
                            </select>

                            {formData.project &&
                                projectMembers.length ===
                                    0 && (
                                    <small>
                                        This project has no
                                        members assigned yet.
                                    </small>
                                )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
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

                        <div className="form-group">
                            <label>Priority</label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="LOW">
                                    Low
                                </option>

                                <option value="MEDIUM">
                                    Medium
                                </option>

                                <option value="HIGH">
                                    High
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Due Date</label>

                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
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
                                navigate("/tasks")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                loading ||
                                !formData.assignedTo
                            }
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                ? "Update Task"
                                : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default TaskForm;