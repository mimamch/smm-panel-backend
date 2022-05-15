const express = require("express");
const { getServices, getCategory } = require("../controllers/services");
const { updateServices, updateStatus } = require("../update");

const router = express.Router();

router.get("/", getServices);
router.get("/category", getCategory);
router.get("/update", updateServices);
router.get("/update-status", updateStatus);

module.exports = router;
