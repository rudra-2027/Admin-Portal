const componentService = require("../services/component.service");

exports.create = async (req, res) => {
  const component = await componentService.createComponent(
    req.body,
    req.user.id
  );
  res.status(201).json(component);
};

exports.update = async (req, res) => {
  const component = await componentService.updateComponent(
    req.params.id,
    req.body,
    req.user.id
  );
  res.json(component);
};

exports.remove = async (req, res) => {
  await componentService.deleteComponent(
    req.params.id,
    req.user.id
  );
  res.json({ message: "Component deleted" });
};

exports.submit = async (req, res) => {
  const component = await componentService.submitForApproval(
    req.params.id,
    req.user.id
  );
  res.json(component);
};

exports.myComponents = async (req, res) => {
  const components = await componentService.getMyComponents(
    req.user.id
  );
  res.json(components);
};
