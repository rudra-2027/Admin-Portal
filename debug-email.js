try {
    console.log("Attempting to require email.component.js...");
    const emailService = require("./src/services/email.component");
    console.log("Successfully required email.component.js");
} catch (error) {
    console.error("FAILED to require email.component.js");
    console.error(error);
}
