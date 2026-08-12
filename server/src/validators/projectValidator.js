const { body } = require("express-validator");

const projectValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required")
        .isLength({ max: 100 })
        .withMessage("Project name cannot exceed 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required")
        .isLength({ max: 1000 })
        .withMessage(
            "Project description cannot exceed 1000 characters"
        ),

    body("status")
        .optional()
        .isIn(["PLANNING", "ACTIVE", "COMPLETED"])
        .withMessage("Invalid project status"),

    body("manager")
        .isMongoId()
        .withMessage("A valid manager is required"),

    body("members")
        .optional()
        .isArray()
        .withMessage("Members must be an array")
];

const projectUpdateValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Project name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Project name cannot exceed 100 characters"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Project description cannot be empty")
        .isLength({ max: 1000 })
        .withMessage(
            "Project description cannot exceed 1000 characters"
        ),

    body("status")
        .optional()
        .isIn(["PLANNING", "ACTIVE", "COMPLETED"])
        .withMessage("Invalid project status"),

    body("manager")
        .optional()
        .isMongoId()
        .withMessage("A valid manager is required"),

    body("members")
        .optional()
        .isArray()
        .withMessage("Members must be an array")
];

module.exports = {
    projectValidator,
    projectUpdateValidator
};