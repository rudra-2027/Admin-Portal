require("dotenv").config();
const mongoose = require("mongoose");
const Component = require("./src/models/Component");
const User = require("./src/models/UserModel");
const emailService = require("./src/services/email.component");

const checkPopulate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        // 1. Find the most recent component
        const component = await Component.findOne().sort({ createdAt: -1 });

        if (!component) {
            console.log("No components found in the database to test.");
            return;
        }

        console.log(`Found component: ${component.title} (ID: ${component._id})`);
        console.log(`Original createdBy:`, component.createdBy);

        // 2. Attempt to populate
        await component.populate("createdBy", "username email");
        console.log(`Populated createdBy:`, component.createdBy);

        if (!component.createdBy || !component.createdBy.email) {
            console.error("ERROR: Failed to populate creator email. Check if the user exists and has an email.");

            // Check if the user ID exists at all
            if (component.createdBy?._id || (typeof component.createdBy === 'object' && component.createdBy)) {
                // It's already an object (populated partially?) or we have the ID from before?
                // If populate failed, component.createdBy might still be the ID or null depending on mongoose version/config
                // But here we see what it is.
            } else {
                // It was just an ID before populate...
            }
        } else {
            console.log(`SUCCESS: Retrieved creator email: ${component.createdBy.email}`);

            // 3. Try to send an email with this REAL data
            console.log("Attempting to send test email using populated data...");
            await emailService.notifyComponentCreated(component);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkPopulate();
