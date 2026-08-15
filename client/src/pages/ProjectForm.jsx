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
                <div className="mx-4 min-h-[calc(100vh-100px)] py-8 sm:mx-6 lg:mx-8 xl:mx-10">
                    <div className="animate-pulse space-y-5">
                        <div className="h-4 w-32 rounded bg-[#E5E0DC]" />
                        <div className="h-10 w-64 rounded bg-[#E5E0DC]" />
                        <div className="h-[600px] rounded-2xl bg-white" />
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

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => navigate("/projects")}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7C756F] transition hover:text-[#E86632]"
                        >
                            <span>←</span>
                            Back to Projects
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E8] text-[#E86632] sm:flex">
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
                            </div>

                            <div>
                                <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#E86632]">
                                    Project Workspace
                                </p>

                                <h1 className="text-2xl font-bold tracking-tight text-[#292725] sm:text-3xl">
                                    {isEditing
                                        ? "Edit Project"
                                        : "Create Project"}
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-[#817B76]">
                                    {isEditing
                                        ? "Update the project details, team and current status."
                                        : "Set up a new project and organize your team in one place."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORM */}
                <div className="mx-auto w-full max-w-4xl">
                    <div className="overflow-hidden rounded-2xl border border-[#E3DED9] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.045)]">

                        {/* FORM HEADER */}
                        <div className="border-b border-[#EEEAE6] bg-[#FCFBFA] px-5 py-5 sm:px-7">
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
                                            d="M12 6v12m6-6H6"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="font-bold text-[#292725]">
                                        {isEditing
                                            ? "Project Information"
                                            : "New Project"}
                                    </h2>

                                    <p className="mt-0.5 text-xs text-[#8D8781]">
                                        Fill in the details below to continue.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-5 sm:p-7"
                        >
                            <div className="space-y-6">

                                {/* PROJECT NAME */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-[#403C38]"
                                    >
                                        Project Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter project name"
                                        required
                                        className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm text-[#35312E] outline-none transition-all duration-200 placeholder:text-[#AAA49F] hover:border-[#CFC8C2] focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                    />
                                </div>

                                {/* DESCRIPTION */}
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
                                        placeholder="Describe the purpose, goals or scope of this project..."
                                        rows="5"
                                        required
                                        className="w-full resize-y rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm leading-6 text-[#35312E] outline-none transition-all duration-200 placeholder:text-[#AAA49F] hover:border-[#CFC8C2] focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                    />
                                </div>

                                {/* MANAGER + STATUS */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="manager"
                                            className="mb-2 block text-sm font-semibold text-[#403C38]"
                                        >
                                            Manager
                                        </label>

                                        {user?.role === "MANAGER" ? (
                                            <div className="relative">
                                                <input
                                                    id="manager"
                                                    type="text"
                                                    value={user.name}
                                                    disabled
                                                    className="w-full cursor-not-allowed rounded-xl border border-[#DDD8D3] bg-[#F4F1EE] px-4 py-3 text-sm font-medium text-[#77716C]"
                                                />

                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#EEEAE6] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8D8781]">
                                                    You
                                                </span>
                                            </div>
                                        ) : (
                                            <select
                                                id="manager"
                                                name="manager"
                                                value={formData.manager}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm font-medium text-[#55504B] outline-none transition-all duration-200 hover:border-[#CFC8C2] focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                            >
                                                <option value="">
                                                    Select manager
                                                </option>

                                                {managers.map(
                                                    (manager) => (
                                                        <option
                                                            key={manager._id}
                                                            value={manager._id}
                                                        >
                                                            {manager.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        )}
                                    </div>

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
                                            className="w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-4 py-3 text-sm font-medium text-[#55504B] outline-none transition-all duration-200 hover:border-[#CFC8C2] focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
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

                                {/* TEAM MEMBERS */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="members"
                                            className="text-sm font-semibold text-[#403C38]"
                                        >
                                            Team Members
                                        </label>

                                        <span className="rounded-full bg-[#FFF0E8] px-2.5 py-1 text-[10px] font-bold text-[#E86632]">
                                            {formData.members.length} selected
                                        </span>
                                    </div>

                                    <select
                                        id="members"
                                        multiple
                                        value={formData.members}
                                        onChange={handleMemberChange}
                                        className="member-select h-44 w-full rounded-xl border border-[#DDD8D3] bg-[#FCFBFA] px-3 py-2 text-sm text-[#55504B] outline-none transition-all duration-200 hover:border-[#CFC8C2] focus:border-[#FFAD86] focus:bg-white focus:ring-4 focus:ring-[#FF7A45]/[0.08]"
                                    >
                                        {members.map((member) => (
                                            <option
                                                key={member._id}
                                                value={member._id}
                                                className="rounded-lg px-2 py-2"
                                            >
                                                {member.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="mt-2 flex items-center gap-2 text-xs text-[#938D87]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A45]" />
                                        Hold Ctrl/Cmd to select multiple members.
                                    </div>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        <span className="mt-0.5 font-bold">!</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* ACTIONS */}
                                <div className="flex flex-col-reverse gap-3 border-t border-[#EEEAE6] pt-6 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/projects")
                                        }
                                        className="rounded-xl border border-[#DDD8D3] bg-white px-5 py-3 text-sm font-semibold text-[#625D58] transition-all duration-200 hover:border-[#CFC8C2] hover:bg-[#F8F6F4] active:scale-[0.98]"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-xl bg-[#FF7A45] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(255,122,69,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FF8B5C] hover:shadow-[0_9px_22px_rgba(255,122,69,0.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? "Saving..."
                                            : isEditing
                                            ? "Update Project"
                                            : "Create Project"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ProjectForm;