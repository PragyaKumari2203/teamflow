const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();
        await User.deleteMany({});

        const users = [
            {
                name: "Aarav Mehta",
                email: "admin@teamflow.demo",
                password: await bcrypt.hash("Admin@123", 10),
                role: "ADMIN"
            },
            {
                name: "Riya Sharma",
                email: "manager@teamflow.demo",
                password: await bcrypt.hash("Manager@123", 10),
                role: "MANAGER"
            },
            {
                name: "Anu Gupta",
                email: "member@teamflow.demo",
                password: await bcrypt.hash("Member@123", 10),
                role: "MEMBER"
            }
        ];

        await User.insertMany(users);

        console.log("Demo users created successfully");

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

seedUsers();