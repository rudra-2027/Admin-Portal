const express = require("express");
const router = express.Router();
const controller = require("../controller/public.component.controller");

router.get("/", controller.list);
router.get("/:slug", controller.details);

module.exports = router;
