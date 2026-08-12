const express = require("express");

const {
    getUsers,
    createUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    createUserValidator
} = require("../validators/userValidator");

const router = express.Router();

router.get(
    "/",
    protect,
    allowRoles("ADMIN", "MANAGER"),
    getUsers
);

router.post(
    "/",
    protect,
    allowRoles("ADMIN"),
    createUserValidator,
    validate,
    createUser
);

module.exports = router;