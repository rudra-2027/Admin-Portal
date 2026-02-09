const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send an email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML
 */
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"PUI Admin Portal" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        // We don't throw here to avoid breaking the main flow if email fails
        return null;
    }
};

/**
 * Notify admin when a new component is submitted
 * @param {object} component - The component document
 */
exports.notifyAdminNewSubmission = async (component) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const subject = `New Component Submission: ${component.title}`;
    const html = `
    <h2>New Component Submission</h2>
    <p>A new component has been submitted for approval.</p>
    <ul>
      <li><strong>Title:</strong> ${component.title}</li>
      <li><strong>Category:</strong> ${component.category}</li>
      <li><strong>Author:</strong> ${component.createdBy.username || "Unknown"}</li>
    </ul>
    <p>Please review it in the admin dashboard.</p>
  `;
    return sendEmail(adminEmail, subject, html);
};

/**
 * Notify creator when their component status changes
 * @param {object} component - The component document
 * @param {string} status - New status (published/rejected)
 */
exports.notifyStatusChange = async (component, status) => {
    const creatorEmail = component.createdBy.email;
    if (!creatorEmail) return;

    const subject = `Component ${status.charAt(0).toUpperCase() + status.slice(1)}: ${component.title}`;
    const html = `
    <h2>Component Status Update</h2>
    <p>Hello,</p>
    <p>Your component <strong>${component.title}</strong> has been <strong>${status}</strong>.</p>
    ${status === "published"
            ? "<p>Congratulations! Your component is now live on the platform.</p>"
            : "<p>If you have any questions regarding the rejection, please contact the admin team.</p>"}
    <p>Best regards,<br/>PUI Team</p>
  `;
    return sendEmail(creatorEmail, subject, html);
};
