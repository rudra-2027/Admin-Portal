require("dotenv").config();
const emailService = require("./src/services/email.component");

const mockUser = {
    username: "testuser",
    email: "rudragupta082004@gmail.com",
    role: "CONTRIBUTOR",
    isActive: true
};

const mockComponent = {
    title: "Test Component",
    category: "UI",
    createdBy: {
        username: "testcreator",
        email: "rudragupta200408@gmail.com"
    }
};

async function testNotifications() {
    console.log("Starting email notification tests...");

    console.log("\n1. Testing notifyUserCreated...");
    await emailService.notifyUserCreated(mockUser, "TempPass123!");

    console.log("\n2. Testing notifyUserUpdated...");
    await emailService.notifyUserUpdated(mockUser);

    console.log("\n3. Testing notifyUserDeleted...");
    await emailService.notifyUserDeleted(mockUser);

    console.log("\n4. Testing notifyComponentCreated...");
    await emailService.notifyComponentCreated(mockComponent);

    console.log("\n5. Testing notifyComponentUpdated...");
    await emailService.notifyComponentUpdated(mockComponent);

    console.log("\n6. Testing notifyComponentDeleted...");
    await emailService.notifyComponentDeleted(mockComponent);

    console.log("\n7. Testing notifyComponentFeatured...");
    await emailService.notifyComponentFeatured(mockComponent, true);

    console.log("\nTests completed. Check console output for success/failure.");
}

testNotifications().catch(err => console.error("Test failed:", err));
