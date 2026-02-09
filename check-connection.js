require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("------------------------------------------");
console.log("Checking Email Configuration & Connection");
console.log("------------------------------------------");
console.log(`HOST: ${process.env.EMAIL_HOST}`);
console.log(`PORT: ${process.env.EMAIL_PORT}`);
console.log(`USER: ${process.env.EMAIL_USER}`);
console.log(`ADMIN_EMAIL: ${process.env.ADMIN_EMAIL}`); // Check what verifies here
console.log("------------------------------------------");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        ciphers: "SSLv3",
    },
    family: 4, // Force IPv4
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

async function verifyConnection() {
    try {
        console.log("Attempting to connect to SMTP server...");
        await transporter.verify();
        console.log("✅ Connection Successful! SMTP server is reachable.");
    } catch (error) {
        console.error("❌ Connection Failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        if (error.code === 'ETIMEDOUT') {
            console.log("\nTIP: This is a network timeout. It might be blocked by a firewall or ISP.");
        }
    }
}

verifyConnection();
