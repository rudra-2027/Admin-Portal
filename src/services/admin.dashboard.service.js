const User = require("../models/UserModel");
const Component = require("../models/Component");

exports.getDashboardStats = async () => {
  const [
    totalUsers,
    activeUsers,
    contributors,
    componentStats,
    featuredCount,
    recentComponents
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: "CONTRIBUTOR", isActive: true }),

    Component.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]),

    Component.countDocuments({
      isFeatured: true,
      status: "published"
    }),

    Component.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug createdAt views")
  ]);

  const componentsByStatus = {
    draft: 0,
    pending: 0,
    published: 0,
    rejected: 0
  };

  componentStats.forEach(stat => {
    componentsByStatus[stat._id] = stat.count;
  });

  return {
    totalUsers,
    activeUsers,
    contributors,
    totalComponents: componentsByStatus.draft + componentsByStatus.pending + componentsByStatus.published + componentsByStatus.rejected,
    draftComponents: componentsByStatus.draft,
    pendingComponents: componentsByStatus.pending,
    publishedComponents: componentsByStatus.published,
    rejectedComponents: componentsByStatus.rejected,
    featuredComponents: featuredCount,
    recentComponents
  };
};
