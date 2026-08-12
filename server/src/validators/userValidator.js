const { body } = require("express-validator");

const createUserValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8 })
        .withMessage(
            "Password must be at least 8 characters"
        ),

    body("role")
        .isIn(["ADMIN", "MANAGER", "MEMBER"])
        .withMessage("Invalid role")
];

module.exports = {
    createUserValidator
};