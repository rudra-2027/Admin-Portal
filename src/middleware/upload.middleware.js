const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pui/components",
    allowed_formats: ["jpg", "png", "webp"],
    transformation: [
      { width: 1200, crop: "limit" }
    ]
  }
});

const upload = multer({ storage });

module.exports = upload;
