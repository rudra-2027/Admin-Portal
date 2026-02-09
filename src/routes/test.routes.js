const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

router.get(
  "/admin-only",
  protect(["ADMIN"]),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user
    });
  }
);

router.get(
  "/contributor",
  protect(["ADMIN", "CONTRIBUTOR"]),
  (req, res) => {
    res.json({
      message: "Welcome Contributor",
      user: req.user
    });
  }
);

module.exports = router;
