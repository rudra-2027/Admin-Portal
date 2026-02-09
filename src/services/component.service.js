const Component = require("../models/Component");
const emailService = require("./email.component.js");

exports.createComponent = async (data, userId) => {
  const component = await Component.create({
    ...data,
    createdBy: userId
  });

  // Populate creator info for the email
  await component.populate("createdBy", "username email");

  // Notify creator
  await emailService.notifyComponentCreated(component);

  return component;
};

exports.updateComponent = async (componentId, data = {}, userId) => {
  if (!data || typeof data !== "object") {
    throw new Error("Update data is required");
  }

  const component = await Component.findOne({
    _id: componentId,
    createdBy: userId
  });

  if (!component) {
    throw new Error("Component not found or access denied");
  }


  delete data.status;
  delete data.isFeatured;
  delete data.createdBy;

  Object.assign(component, data);
  await component.save();

  // Populate creator info for the email
  await component.populate("createdBy", "username email");

  // Notify creator
  await emailService.notifyComponentUpdated(component);

  return component;
};

exports.deleteComponent = async (componentId, userId) => {
  const component = await Component.findOneAndDelete({
    _id: componentId,
    createdBy: userId
  });

  if (!component) {
    throw new Error("Component not found or access denied");
  }

  // Populate creator info for the email (from the deleted component)
  await component.populate("createdBy", "username email");

  // Notify creator
  await emailService.notifyComponentDeleted(component);

  return component;
};

exports.submitForApproval = async (componentId, userId) => {
  const component = await Component.findOne({
    _id: componentId,
    createdBy: userId
  });

  if (!component) {
    throw new Error("Component not found");
  }

  if (component.status !== "draft") {
    throw new Error("Only drafts can be submitted");
  }

  component.status = "pending";
  await component.save();

  // Populate creator info for the email
  await component.populate("createdBy", "username email");

  // Notify admin
  await emailService.notifyAdminNewSubmission(component);

  return component;
};

exports.getMyComponents = async (userId) => {
  return Component.find({ createdBy: userId }).sort({ updatedAt: -1 });
};
