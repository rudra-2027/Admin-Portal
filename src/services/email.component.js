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
    if (!to) {
      console.warn("Skipping email: No recipient provided.");
      return null;
    }

    console.log(`Sending email to: ${to} | Subject: ${subject}`);

    const info = await transporter.sendMail({
      from: `"PUI Admin Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
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
  const creatorEmail = component.createdBy?.email;
  if (!creatorEmail) {
    console.warn(`Cannot notify status change: Creator email not found for component ${component.title || component._id}`);
    return null;
  }

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

  // Also notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminSubject = `Component ${status.charAt(0).toUpperCase() + status.slice(1)}: ${component.title}`;
    const adminHtml = `
      <h2>Component Status Update</h2>
      <p>User <strong>${component.createdBy?.username || "Unknown"}</strong>'s component <strong>${component.title}</strong> has been <strong>${status}</strong>.</p>
    `;
    sendEmail(adminEmail, adminSubject, adminHtml).catch(err => console.error("Failed to notify admin of status change:", err.message));
  }

  return sendEmail(creatorEmail, subject, html);
};

/**
 * Notify user when their account is created
 * @param {object} user - The user document
 * @param {string} password - The plain text password (only for creation)
 */
exports.notifyUserCreated = async (user, password) => {
  const subject = "Welcome to PUI Admin Portal";
  const html = `
    <h2>Welcome, ${user.username}!</h2>
    <p>Your account has been created successfully.</p>
    <ul>
      <li><strong>Username:</strong> ${user.username}</li>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Role:</strong> ${user.role}</li>
      <li><strong>Temporary Password:</strong> ${password}</li>
    </ul>
    <p>Please log in and change your password as soon as possible.</p>
    <p>Best regards,<br/>PUI Team</p>
  `;
  return sendEmail(user.email, subject, html);
};

/**
 * Notify user when their account is updated
 * @param {object} user - The user document
 */
exports.notifyUserUpdated = async (user) => {
  const subject = "Account Update Notification";
  const html = `
    <h2>Hello ${user.username},</h2>
    <p>Your account details have been updated by an administrator.</p>
    <ul>
      <li><strong>Status:</strong> ${user.isActive ? "Active" : "Inactive"}</li>
      <li><strong>Role:</strong> ${user.role}</li>
    </ul>
    <p>If you did not expect this change, please contact support.</p>
    <p>Best regards,<br/>PUI Team</p>
  `;
  return sendEmail(user.email, subject, html);
};

/**
 * Notify user when their account is deleted
 * @param {object} user - The user document
 */
exports.notifyUserDeleted = async (user) => {
  const subject = "Account Deletion Notification";
  const html = `
    <h2>Hello ${user.username},</h2>
    <p>Your account has been removed from the PUI Admin Portal.</p>
    <p>If you have any questions, please contact the administration team.</p>
    <p>Best regards,<br/>PUI Team</p>
  `;
  return sendEmail(user.email, subject, html);
};

/**
 * Notify creator when a new component is created
 * @param {object} component - The component document (populated with createdBy)
 */
exports.notifyComponentCreated = async (component) => {
  const creatorEmail = component.createdBy?.email;
  if (!creatorEmail) return;

  const subject = `Component Created: ${component.title}`;
  const html = `
    <h2>Component Created</h2>
    <p>Your component <strong>${component.title}</strong> has been created as a draft.</p>
    <p>You can now submit it for approval from your dashboard.</p>
    <p>Best regards,<br/>PUI Team</p>
  `;

  // Also notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminSubject = `New Component Created: ${component.title}`;
    const adminHtml = `
      <h2>New Component Created</h2>
      <p>User <strong>${component.createdBy?.username || "Unknown"}</strong> has created a new component: <strong>${component.title}</strong>.</p>
      <p>It is currently in <strong>${component.status}</strong> status.</p>
      <p>Review it in the dashboard.</p>
    `;
    sendEmail(adminEmail, adminSubject, adminHtml).catch(err => console.error("Failed to notify admin of creation:", err.message));
  }

  return sendEmail(creatorEmail, subject, html);
};

/**
 * Notify creator when their component is updated
 * @param {object} component - The component document (populated with createdBy)
 */
exports.notifyComponentUpdated = async (component) => {
  const creatorEmail = component.createdBy?.email;
  if (!creatorEmail) return;

  const subject = `Component Updated: ${component.title}`;
  const html = `
    <h2>Component Updated</h2>
    <p>Your component <strong>${component.title}</strong> has been updated successfully.</p>
    <p>Best regards,<br/>PUI Team</p>
  `;

  // Also notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminSubject = `Component Updated: ${component.title}`;
    const adminHtml = `
      <h2>Component Updated</h2>
      <p>User <strong>${component.createdBy?.username || "Unknown"}</strong> has updated their component: <strong>${component.title}</strong>.</p>
      <p>Review the changes in the dashboard.</p>
    `;
    sendEmail(adminEmail, adminSubject, adminHtml).catch(err => console.error("Failed to notify admin of update:", err.message));
  }

  return sendEmail(creatorEmail, subject, html);
};

/**
 * Notify creator when their component is deleted
 * @param {object} component - The component document (populated with createdBy)
 */
exports.notifyComponentDeleted = async (component) => {
  const creatorEmail = component.createdBy?.email;
  if (!creatorEmail) return;

  const subject = `Component Deleted: ${component.title}`;
  const html = `
    <h2>Component Deleted</h2>
    <p>Your component <strong>${component.title}</strong> has been removed from the platform.</p>
    <p>Best regards,<br/>PUI Team</p>
  `;

  // Also notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminSubject = `Component Deleted: ${component.title}`;
    const adminHtml = `
      <h2>Component Deleted</h2>
      <p>User <strong>${component.createdBy?.username || "Unknown"}</strong> has deleted their component: <strong>${component.title}</strong>.</p>
    `;
    sendEmail(adminEmail, adminSubject, adminHtml).catch(err => console.error("Failed to notify admin of deletion:", err.message));
  }

  return sendEmail(creatorEmail, subject, html);
};

/**
 * Notify creator when their component is featured/unfeatured
 * @param {object} component - The component document (populated with createdBy)
 * @param {boolean} isFeatured - Featured status
 */
exports.notifyComponentFeatured = async (component, isFeatured) => {
  const creatorEmail = component.createdBy?.email;
  if (!creatorEmail) return;

  const subject = `Component ${isFeatured ? "Featured" : "Unfeatured"}: ${component.title}`;
  const html = `
    <h2>Featured Status Update</h2>
    <p>Your component <strong>${component.title}</strong> is now <strong>${isFeatured ? "Featured" : "no longer Featured"}</strong> on the platform.</p>
    ${isFeatured ? "<p>Congratulations! Featured components get higher visibility.</p>" : ""}
    <p>Best regards,<br/>PUI Team</p>
  `;
  return sendEmail(creatorEmail, subject, html);
};
