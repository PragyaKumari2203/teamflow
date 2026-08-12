const bcrypt = require("bcryptjs");

const User = require("../models/User");

const createAuditLog = require("../utils/createAuditLog");

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ name: 1 });

        res.json({
            users
        });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(409).json({
                message: "A user with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        await createAuditLog({
            user: req.user._id,
            action: "CREATE",
            entity: "USER",
            entityId: user._id,
            description: `Created ${role} user "${name}"`
        });

        const safeUser = await User.findById(user._id)
            .select("-password");

        res.status(201).json({
            message: "User created successfully",
            user: safeUser
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    createUser
};