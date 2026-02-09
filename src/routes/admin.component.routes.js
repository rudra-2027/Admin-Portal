const express = require("express");
const router = express.Router();
const controller = require("../controller/admin.component.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect(["ADMIN"]));

router.get("/pending", controller.pending);

router.patch("/:id/status", controller.updateStatus);

router.patch("/:id/feature", controller.feature);

router.delete("/:id", controller.remove);

module.exports = router;
