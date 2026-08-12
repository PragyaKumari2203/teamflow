const { body } = require("express-validator");

const taskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required")
        .isLength({ max: 150 })
        .withMessage(
            "Task title cannot exceed 150 characters"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage(
            "Task description cannot exceed 1000 characters"
        ),

    body("project")
        .isMongoId()
        .withMessage(
            "A valid project is required"
        ),

    body("assignedTo")
        .isMongoId()
        .withMessage(
            "A valid assignee is required"
        ),

    body("status")
        .optional()
        .isIn([
            "TODO",
            "IN_PROGRESS",
            "COMPLETED"
        ])
        .withMessage(
            "Invalid task status"
        ),

    body("priority")
        .optional()
        .isIn([
            "LOW",
            "MEDIUM",
            "HIGH"
        ])
        .withMessage(
            "Invalid task priority"
        ),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage(
            "Due date must be a valid date"
        )
];

const taskUpdateValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
            "Task title cannot be empty"
        )
        .isLength({ max: 150 })
        .withMessage(
            "Task title cannot exceed 150 characters"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage(
            "Task description cannot exceed 1000 characters"
        ),

    body("project")
        .optional()
        .isMongoId()
        .withMessage(
            "A valid project is required"
        ),

    body("assignedTo")
        .optional()
        .isMongoId()
        .withMessage(
            "A valid assignee is required"
        ),

    body("status")
        .optional()
        .isIn([
            "TODO",
            "IN_PROGRESS",
            "COMPLETED"
        ])
        .withMessage(
            "Invalid task status"
        ),

    body("priority")
        .optional()
        .isIn([
            "LOW",
            "MEDIUM",
            "HIGH"
        ])
        .withMessage(
            "Invalid task priority"
        ),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage(
            "Due date must be a valid date"
        )
];

module.exports = {
    taskValidator,
    taskUpdateValidator
};