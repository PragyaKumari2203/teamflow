const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const createAuditLog = require("../utils/createAuditLog");

const getTasks = async (req, res, next) => {
    try {
        let filter = {};

        if (req.user.role === "MEMBER") {
            filter = {
                assignedTo: req.user._id
            };
        }

        if (req.user.role === "MANAGER") {
            const projects = await Project.find({
                manager: req.user._id
            }).select("_id");

            const projectIds = projects.map(
                (project) => project._id
            );

            filter = {
                project: {
                    $in: projectIds
                }
            };
        }

        const tasks = await Task.find(filter)
            .populate(
                "project",
                "name status"
            )
            .populate(
                "assignedTo",
                "name email role"
            )
            .populate(
                "createdBy",
                "name email role"
            )
            .sort({
                createdAt: -1
            });

        res.json({
            tasks
        });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(
            req.params.id
        )
            .populate(
                "project",
                "name status manager members"
            )
            .populate(
                "assignedTo",
                "name email role"
            )
            .populate(
                "createdBy",
                "name email role"
            );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (req.user.role === "MEMBER") {
            if (
                task.assignedTo._id.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only view tasks assigned to you"
                });
            }
        }

        if (req.user.role === "MANAGER") {
            if (
                task.project.manager.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only access tasks from your projects"
                });
            }
        }

        res.json({
            task
        });
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            status,
            priority,
            dueDate
        } = req.body;

        const projectRecord =
            await Project.findById(project);

        if (!projectRecord) {
            return res.status(400).json({
                message: "Project not found"
            });
        }

        if (
            req.user.role === "MANAGER" &&
            projectRecord.manager.toString() !==
                req.user._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only create tasks in your projects"
            });
        }

        const assignee =
            await User.findById(assignedTo);

        if (!assignee) {
            return res.status(400).json({
                message: "Assigned user not found"
            });
        }

        if (assignee.role !== "MEMBER") {
            return res.status(400).json({
                message:
                    "Tasks can only be assigned to members"
            });
        }

        const isProjectMember =
            projectRecord.members.some(
                (memberId) =>
                    memberId.toString() ===
                    assignee._id.toString()
            );

        if (!isProjectMember) {
            return res.status(400).json({
                message:
                    "The assigned user must belong to the project"
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy: req.user._id,
            status,
            priority,
            dueDate
        });

        const populatedTask =
            await task.populate([
                {
                    path: "project",
                    select: "name status"
                },
                {
                    path: "assignedTo",
                    select: "name email role"
                },
                {
                    path: "createdBy",
                    select: "name email role"
                }
            ]);

        await createAuditLog({
            user: req.user._id,
            action: "CREATE",
            entity: "TASK",
            entityId: task._id,
            description:
                `Created task "${task.title}"`
        });

        res.status(201).json({
            message:
                "Task created successfully",
            task: populatedTask
        });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task =
            await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const {
            title,
            description,
            project,
            assignedTo,
            status,
            priority,
            dueDate
        } = req.body;

        /*
         * MEMBERS
         *
         * Members can only change the status
         * of tasks assigned to themselves.
         */
        if (req.user.role === "MEMBER") {
            if (
                task.assignedTo.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only update your own tasks"
                });
            }

            const allowedFields = [
                "status"
            ];

            const suppliedFields =
                Object.keys(req.body);

            const invalidFields =
                suppliedFields.filter(
                    (field) =>
                        !allowedFields.includes(
                            field
                        )
                );

            if (invalidFields.length > 0) {
                return res.status(403).json({
                    message:
                        "Members can only change task status"
                });
            }

            if (status !== undefined) {
                task.status = status;
            }
        }

        /*
         * MANAGERS
         *
         * Managers can fully edit tasks
         * inside projects they manage.
         */
        if (req.user.role === "MANAGER") {
            const projectRecord =
                await Project.findById(
                    task.project
                );

            if (
                !projectRecord ||
                projectRecord.manager.toString() !==
                    req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only update tasks in your projects"
                });
            }

            if (title !== undefined) {
                task.title = title;
            }

            if (description !== undefined) {
                task.description =
                    description;
            }

            if (status !== undefined) {
                task.status = status;
            }

            if (priority !== undefined) {
                task.priority = priority;
            }

            if (dueDate !== undefined) {
                task.dueDate = dueDate;
            }

            if (assignedTo !== undefined) {
                const assignee =
                    await User.findById(
                        assignedTo
                    );

                if (!assignee) {
                    return res.status(400).json({
                        message:
                            "Assigned user not found"
                    });
                }

                if (
                    assignee.role !== "MEMBER"
                ) {
                    return res.status(400).json({
                        message:
                            "Tasks can only be assigned to members"
                    });
                }

                const isMember =
                    projectRecord.members.some(
                        (memberId) =>
                            memberId.toString() ===
                            assignee._id.toString()
                    );

                if (!isMember) {
                    return res.status(400).json({
                        message:
                            "Assigned user must belong to the project"
                    });
                }

                task.assignedTo =
                    assignedTo;
            }
        }

        /*
         * ADMIN
         *
         * Admin has full task access.
         */
        if (req.user.role === "ADMIN") {
            if (title !== undefined) {
                task.title = title;
            }

            if (description !== undefined) {
                task.description =
                    description;
            }

            if (status !== undefined) {
                task.status = status;
            }

            if (priority !== undefined) {
                task.priority = priority;
            }

            if (dueDate !== undefined) {
                task.dueDate = dueDate;
            }

            if (project !== undefined) {
                const projectRecord =
                    await Project.findById(
                        project
                    );

                if (!projectRecord) {
                    return res.status(400).json({
                        message:
                            "Project not found"
                    });
                }

                task.project = project;
            }

            if (assignedTo !== undefined) {
                const assignee =
                    await User.findById(
                        assignedTo
                    );

                if (!assignee) {
                    return res.status(400).json({
                        message:
                            "Assigned user not found"
                    });

                }

                if (
                    assignee.role !== "MEMBER"
                ) {
                    return res.status(400).json({
                        message:
                            "Tasks can only be assigned to members"
                    });
                }

                task.assignedTo =
                    assignedTo;
            }
        }

        const updatedTask =
            await task.save();

        await createAuditLog({
            user: req.user._id,
            action: "UPDATE",
            entity: "TASK",
            entityId: task._id,
            description:
                `Updated task "${task.title}"`
        });

        const populatedTask =
            await updatedTask.populate([
                {
                    path: "project",
                    select: "name status"
                },
                {
                    path: "assignedTo",
                    select: "name email role"
                },
                {
                    path: "createdBy",
                    select: "name email role"
                }
            ]);

        res.json({
            message:
                "Task updated successfully",
            task: populatedTask
        });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const task =
            await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (req.user.role === "MEMBER") {
            return res.status(403).json({
                message:
                    "Members cannot delete tasks"
            });
        }

        if (req.user.role === "MANAGER") {
            const project =
                await Project.findById(
                    task.project
                );

            if (
                !project ||
                project.manager.toString() !==
                    req.user._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You can only delete tasks in your projects"
                });
            }
        }

        await task.deleteOne();

        await createAuditLog({
            user: req.user._id,
            action: "DELETE",
            entity: "TASK",
            entityId: task._id,
            description:
                `Deleted task "${task.title}"`
        });

        res.json({
            message:
                "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};