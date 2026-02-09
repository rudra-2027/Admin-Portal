const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { protect } = require("../middleware/auth.middleware");

// All user routes require ADMIN role
router.use(protect(["ADMIN"]));

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
