const express = require("express");
const router = express.Router();
const controller = require("../controller/component.controller");
const { protect } = require("../middleware/auth.middleware");

// Contributor routes
router.post(
  "/",
  protect(["CONTRIBUTOR", "ADMIN"]),
  controller.create
);

router.put(
  "/:id",
  protect(["CONTRIBUTOR", "ADMIN"]),
  controller.update
);

router.delete(
  "/:id",
  protect(["CONTRIBUTOR", "ADMIN"]),
  controller.remove
);

router.post(
  "/:id/submit",
  protect(["CONTRIBUTOR", "ADMIN"]),
  controller.submit
);

router.get(
  "/my",
  protect(["CONTRIBUTOR", "ADMIN"]),
  controller.myComponents
);

module.exports = router;
