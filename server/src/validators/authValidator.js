const { body } = require("express-validator");

const loginValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
];

module.exports = {
    loginValidator
};