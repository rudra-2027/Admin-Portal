const Component = require("../models/Component");

exports.uploadPreview = async (req, res) => {
  const component = await Component.findOne({
    _id: req.params.id,
    createdBy: req.user.id
  });

  if (!component) {
    return res.status(404).json({ error: "Component not found" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  const imageUrls = req.files.map(file => file.path);

  component.previewImages.push(...imageUrls);
  await component.save();

  res.json({
    message: "Images uploaded successfully",
    images: imageUrls
  });
};
