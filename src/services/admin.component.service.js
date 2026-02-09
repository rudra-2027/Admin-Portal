const Component = require("../models/Component");
const emailService = require("./email.component.js");

exports.getPendingComponents = async () => {
  return Component.find({ status: "pending" })
    .populate("createdBy", "username email")
    .sort({ createdAt: -1 });
};

exports.updateStatus = async (componentId, status) => {
  if (!["published", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const component = await Component.findById(componentId);
  if (!component) {
    throw new Error("Component not found");
  }

  component.status = status;
  await component.save();

  // Populate creator info for the email
  await component.populate("createdBy", "username email");

  // Notify creator
  await emailService.notifyStatusChange(component, status);

  return component;
};

exports.toggleFeature = async (componentId, isFeatured) => {
  const component = await Component.findById(componentId);
  if (!component) {
    throw new Error("Component not found");
  }

  component.isFeatured = isFeatured;
  await component.save();

  // Populate creator info for the email
  await component.populate("createdBy", "username email");

  // Notify creator
  emailService.notifyComponentFeatured(component, isFeatured);

  return component;
};

exports.adminDelete = async (componentId) => {
  const component = await Component.findByIdAndDelete(componentId);

  if (!component) {
    throw new Error("Component not found");
  }

  // Populate creator info for the email
  await component.populate("createdBy", "username email");

  // Notify creator
  emailService.notifyComponentDeleted(component);

  return component;
};
