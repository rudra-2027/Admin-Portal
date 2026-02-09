const Component = require("../models/Component");

exports.uploadPreview = async (req, res) => {
  const component = await Component.findOne({
    _id: req.params.id,
    createdBy: req.user.id
  });

  if (!component) {
    return res.status(404).json({ error: "Component not found" });
  }

  const imageUrl = req.file.path;

  component.previewImages.push(imageUrl);
  await component.save();

  res.json({
    message: "Image uploaded",
    image: imageUrl
  });
};
