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

    useEffect(() => {
        const loadData = async () => {
            try {
                const projectsResponse = await api.get("/projects");
                const availableProjects =
                    projectsResponse.data.projects;

                setProjects(availableProjects);

                if (isEditing) {
                    const taskResponse =
                        await api.get(`/tasks/${id}`);

                    const task = taskResponse.data.task;

                    setFormData({
                        title: task.title,
                        description: task.description || "",
                        project: task.project?._id || "",
                        assignedTo: task.assignedTo?._id || "",
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate
                            ? task.dueDate.substring(0, 10)
                            : ""
                    });

                    const selectedProject =
                        availableProjects.find(
                            (project) =>
                                project._id === task.project?._id
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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleProjectChange = (event) => {
        const projectId = event.target.value;

        const selectedProject = projects.find(
            (project) => project._id === projectId
        );

        const members = selectedProject?.members || [];

        setProjectMembers(members);

        setFormData((current) => {
            const memberStillBelongs = members.some(
                (member) => member._id === current.assignedTo
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
                await api.patch(`/tasks/${id}`, formData);
            } else {
                await api.post("/tasks", formData);
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
                <div className="mx-4 py-8 sm:mx-6 lg:mx-8 xl:mx-10">
                    <div className="animate-pulse space-y-5">
                        <div className="h-4 w-28 rounded bg-[#E5E0DC]" />
                        <div className="h-10 w-64 rounded bg-[#E5E0DC]" />
                        <div className="h-[560px] rounded-2xl bg-white" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="mx-4 space-y-6 pb-10 pt-5 sm:mx-6 lg:mx-8 xl:mx-10">

                {/* Header */}
                <div className="flex flex-col gap-2 border-b border-[#E5E0DC] pb-5">
                    <button
                        type="button"
                        onClick={() => navigate("/tasks")}
                        className="w-fit text-sm font-semibold text-[#817B76] transition hover:text-[#E86632]"
                    >
                        ← Back to Tasks
                    </button>

                    <h1 className="text-2xl font-bold tracking-tight text-[#292725] sm:text-3xl">
                        {isEditing ? "Edit Task" : "Create Task"}
                    </h1>

                    <p className="text-sm text-[#817B76]">
                        {isEditing
                            ? "Update the task information below."
                            : "Create and assign work to a project member."}
                    </p>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[#E3DED9] bg-white shadow-[0_7px_25px_rgba(0,0,0,0.035)]">

                    <div className="border-b border-[#EEEAE6] bg-[#FCFBFA] px-5 py-4 sm:px-7">
                        <h2 className="font-bold text-[#292725]">
                            Task Information
                        </h2>

                        <p className="mt-1 text-xs text-[#8D8781]">
                            Add the details and assignment for this task.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-5 sm:p-7"
                    >
                        <div className="space-y-5">

                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-semibold text-[#403C38]"
                                >
                                    Task Title
                                </label>

                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter task title"
                                    required
                                    className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm text-[#35312E] outline-none transition focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-semibold text-[#403C38]"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the task"
                                    rows="4"
                                    className="w-full resize-y rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm leading-6 text-[#35312E] outline-none transition focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                />
                            </div>

                            {/* Project / Member */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="project"
                                        className="mb-2 block text-sm font-semibold text-[#403C38]"
                                    >
                                        Project
                                    </label>

                                    <select
                                        id="project"
                                        name="project"
                                        value={formData.project}
                                        onChange={handleProjectChange}
                                        required
                                        className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm font-medium text-[#55504B] outline-none transition focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                    >
                                        <option value="">
                                            Select project
                                        </option>

                                        {projects.map((project) => (
                                            <option
                                                key={project._id}
                                                value={project._id}
                                            >
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="assignedTo"
                                        className="mb-2 block text-sm font-semibold text-[#403C38]"
                                    >
                                        Assign To
                                    </label>

                                    <select
                                        id="assignedTo"
                                        name="assignedTo"
                                        value={formData.assignedTo}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.project}
                                        className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm font-medium text-[#55504B] outline-none transition focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08] disabled:cursor-not-allowed disabled:bg-[#F1EFED] disabled:text-[#AAA49F]"
                                    >
                                        <option value="">
                                            {!formData.project
                                                ? "Select project first"
                                                : projectMembers.length === 0
                                                ? "No members in this project"
                                                : "Select member"}
                                        </option>

                                        {projectMembers.map((member) => (
                                            <option
                                                key={member._id}
                                                value={member._id}
                                            >
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>

                                    {formData.project &&
                                        projectMembers.length === 0 && (
                                            <p className="mt-2 text-xs text-[#A09A95]">
                                                This project has no members assigned yet.
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* Status / Priority / Due date */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="mb-2 block text-sm font-semibold text-[#403C38]"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
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
                                </div>

                                <div>
                                    <label
                                        htmlFor="priority"
                                        className="mb-2 block text-sm font-semibold text-[#403C38]"
                                    >
                                        Priority
                                    </label>

                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm font-medium text-[#55504B] outline-none transition focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
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

                                <div>
                                    <label
                                        htmlFor="dueDate"
                                        className="mb-2 block text-sm font-semibold text-[#403C38]"
                                    >
                                        Due Date
                                    </label>

                                    <input
                                        id="dueDate"
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm font-medium text-[#55504B] outline-none transition focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[#EEEAE6] pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => navigate("/tasks")}
                                    className="rounded-xl border border-[#DDD8D3] bg-white px-5 py-3 text-sm font-semibold text-[#625D58] transition hover:bg-[#F8F6F4] active:scale-[0.98]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        !formData.assignedTo
                                    }
                                    className="rounded-xl bg-[#FF7A45] px-6 py-3 text-sm font-semibold text-white shadow-[0_5px_16px_rgba(255,122,69,0.16)] transition hover:-translate-y-0.5 hover:bg-[#FF8B5C] hover:shadow-[0_8px_20px_rgba(255,122,69,0.22)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Saving..."
                                        : isEditing
                                        ? "Update Task"
                                        : "Create Task"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default TaskForm;