const express = require("express");

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    taskValidator,
    taskUpdateValidator
} = require("../validators/taskValidator");

const router = express.Router();

router.get(
    "/",
    protect,
    getTasks
);

router.get(
    "/:id",
    protect,
    getTaskById
);

router.post(
    "/",
    protect,
    allowRoles("ADMIN", "MANAGER"),
    taskValidator,
    validate,
    createTask
);

router.patch(
    "/:id",
    protect,
    taskUpdateValidator,
    validate,
    updateTask
);

router.delete(
    "/:id",
    protect,
    allowRoles("ADMIN", "MANAGER"),
    deleteTask
);

module.exports = router;