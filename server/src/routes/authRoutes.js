const express = require("express");

const {
    login,
    getCurrentUser,
    logout
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { loginValidator } = require("../validators/authValidator");

const router = express.Router();

router.post(
    "/login",
    loginValidator,
    validate,
    login
);

router.get(
    "/me",
    protect,
    getCurrentUser
);

router.post(
    "/logout",
    logout
);

module.exports = router;