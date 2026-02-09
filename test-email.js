require("dotenv").config();
const emailService = require("./src/services/email.component.js");

const testEmail = async () => {
    console.log("Starting email service test...");
    console.log("Config:", {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? "****" : "MISSING",
        admin: process.env.ADMIN_EMAIL
    });

    const dummyComponent = {
        title: "Test Component",
        category: "Icons",
        createdBy: {
            username: "testuser",
            email: process.env.EMAIL_USER // Send to self for testing
        }
    };

    console.log("\n1. Testing admin notification...");
    await emailService.notifyAdminNewSubmission(dummyComponent);

    console.log("\n2. Testing creator status update (published)...");
    await emailService.notifyStatusChange(dummyComponent, "published");

    console.log("\n3. Testing creator status update (rejected)...");
    await emailService.notifyStatusChange(dummyComponent, "rejected");

    console.log("\nTest implementation completed. Check the console for any errors.");
};

testEmail();
