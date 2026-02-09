const express = require("express");
const router = express.Router();
const controller = require("../controller/admin.dashboard.controller");
const { protect } = require("../middleware/auth.middleware");

router.get(
  "/stats",
  protect(["ADMIN"]),
  controller.stats
);

module.exports = router;
