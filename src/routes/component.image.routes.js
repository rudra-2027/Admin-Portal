const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");
const controller = require("../controller/component.image.controller");

router.post(
  "/:id/images",
  protect(["CONTRIBUTOR", "ADMIN"]),
  upload.array("images", 5),
  controller.uploadPreview
);

module.exports = router;
