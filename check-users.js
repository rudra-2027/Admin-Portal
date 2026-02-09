const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./src/models/UserModel");

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({}, "username email role isActive");
        console.log("\nDATA_START");
        console.log(JSON.stringify(users.map(u => ({
            username: u.username,
            email: u.email,
            role: u.role,
            isActive: u.isActive
        })), null, 2));
        console.log("DATA_END");

        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

checkUsers();
