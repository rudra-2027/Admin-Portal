const Component = require("../models/Component");

exports.getComponents = async (query) => {
  const {
    page = 1,
    limit = 12,
    category,
    tag,
    tech,
    search,
    featured
  } = query;

  const filter = {
    status: "published"
  };

  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (tech) filter.techStack = tech;
  if (featured === "true") filter.isFeatured = true;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Component.find(filter)
      .select("-__v")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    Component.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

exports.getComponentBySlug = async (slug) => {
  const component = await Component.findOne({
    slug,
    status: "published"
  }).populate("createdBy", "username");

  if (!component) {
    throw new Error("Component not found");
  }

  // Increment views (non-blocking)
  Component.updateOne(
    { _id: component._id },
    { $inc: { views: 1 } }
  ).exec();

  return component;
};
