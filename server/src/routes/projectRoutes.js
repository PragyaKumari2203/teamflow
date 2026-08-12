const express = require("express");

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    projectValidator,
    projectUpdateValidator
} = require("../validators/projectValidator");

const router = express.Router();

router.get(
    "/",
    protect,
    getProjects
);

router.get(
    "/:id",
    protect,
    getProjectById
);

router.post(
    "/",
    protect,
    allowRoles("ADMIN", "MANAGER"),
    projectValidator,
    validate,
    createProject
);

router.patch(
    "/:id",
    protect,
    allowRoles("ADMIN", "MANAGER"),
    projectUpdateValidator,
    validate,
    updateProject
);

router.delete(
    "/:id",
    protect,
    allowRoles("ADMIN", "MANAGER"),
    deleteProject
);

module.exports = router;