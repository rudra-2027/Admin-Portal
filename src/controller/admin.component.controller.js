const adminService = require("../services/admin.component.service");

exports.pending = async (req, res) => {
  const components = await adminService.getPendingComponents();
  res.json(components);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;

  const component = await adminService.updateStatus(
    req.params.id,
    status
  );

  res.json(component);
};

exports.feature = async (req, res) => {
  const { isFeatured } = req.body;

  const component = await adminService.toggleFeature(
    req.params.id,
    isFeatured
  );

  res.json(component);
};

exports.remove = async (req, res) => {
  await adminService.adminDelete(req.params.id);
  res.json({ message: "Component deleted by admin" });
};
