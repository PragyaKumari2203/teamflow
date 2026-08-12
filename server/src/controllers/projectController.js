const Project = require("../models/Project");
const User = require("../models/User");
const createAuditLog = require("../utils/createAuditLog");

const getProjects = async (req, res, next) => {
    try {
        let filter = {};

        if (req.user.role === "MEMBER") {
            filter = {
                members: req.user._id
            };
        }

        if (req.user.role === "MANAGER") {
            filter = {
                manager: req.user._id
            };
        }

        const projects = await Project.find(filter)
            .populate("manager", "name email role")
            .populate("members", "name email role")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json({
            projects
        });
    } catch (error) {
        next(error);
    }
};

const getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("manager", "name email role")
            .populate("members", "name email role")
            .populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            project
        });
    } catch (error) {
        next(error);
    }
};

const createProject = async (req, res, next) => {
    try {
        const {
            name,
            description,
            status,
            manager,
            members
        } = req.body;

        let projectManager = manager;

        if (req.user.role === "MANAGER") {
            projectManager = req.user._id;
        }

        const managerUser = await User.findById(projectManager);

        if (!managerUser) {
            return res.status(400).json({
                message: "Selected manager does not exist"
            });
        }

        if (
            managerUser.role !== "MANAGER" &&
            managerUser.role !== "ADMIN"
        ) {
            return res.status(400).json({
                message: "Selected user cannot manage a project"
            });
        }

        const project = await Project.create({
            name,
            description,
            status,
            manager: projectManager,
            members: members || [],
            createdBy: req.user._id
        });

        const populatedProject = await project.populate([
            {
                path: "manager",
                select: "name email role"
            },
            {
                path: "members",
                select: "name email role"
            },
            {
                path: "createdBy",
                select: "name email"
            }
        ]);

        await createAuditLog({
    user: req.user._id,
    action: "CREATE",
    entity: "PROJECT",
    entityId: project._id,
    description: `Created project "${project.name}"`
});

        res.status(201).json({
            message: "Project created successfully",
            project: populatedProject
        });
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            req.user.role === "MANAGER" &&
            project.manager.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only edit projects you manage"
            });
        }

        const {
            name,
            description,
            status,
            manager,
            members
        } = req.body;

        if (manager) {
            const managerUser = await User.findById(manager);

            if (!managerUser) {
                return res.status(400).json({
                    message: "Selected manager does not exist"
                });
            }

            if (
                managerUser.role !== "MANAGER" &&
                managerUser.role !== "ADMIN"
            ) {
                return res.status(400).json({
                    message: "Selected user cannot manage a project"
                });
            }

            project.manager = manager;
        }

        if (name !== undefined) {
            project.name = name;
        }

        if (description !== undefined) {
            project.description = description;
        }

        if (status !== undefined) {
            project.status = status;
        }

        if (members !== undefined) {
            project.members = members;
        }

        const updatedProject = await project.save();
        await createAuditLog({
    user: req.user._id,
    action: "UPDATE",
    entity: "PROJECT",
    entityId: project._id,
    description: `Updated project "${project.name}"`
});

        const populatedProject = await updatedProject.populate([
            {
                path: "manager",
                select: "name email role"
            },
            {
                path: "members",
                select: "name email role"
            },
            {
                path: "createdBy",
                select: "name email"
            }
        ]);

        res.json({
            message: "Project updated successfully",
            project: populatedProject
        });
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            req.user.role === "MANAGER" &&
            project.manager.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete projects you manage"
            });
        }

        await project.deleteOne();

await createAuditLog({
    user: req.user._id,
    action: "DELETE",
    entity: "PROJECT",
    entityId: project._id,
    description: `Deleted project "${project.name}"`
});

        res.json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};