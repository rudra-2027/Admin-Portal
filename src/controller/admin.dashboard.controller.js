const dashboardService = require("../services/admin.dashboard.service");

exports.stats = async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  res.json(stats);
};
