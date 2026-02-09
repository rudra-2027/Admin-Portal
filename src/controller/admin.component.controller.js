const adminService = require("../services/admin.component.service");

exports.pending = async (req, res) => {
  const components = await adminService.getPendingComponents();
  res.json(components);
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const component = await adminService.updateStatus(
      req.params.id,
      status
    );

    res.json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.feature = async (req, res) => {
  try {
    const { isFeatured } = req.body;

    const component = await adminService.toggleFeature(
      req.params.id,
      isFeatured
    );

    res.json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await adminService.adminDelete(req.params.id);
    res.json({ message: "Component deleted by admin" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
