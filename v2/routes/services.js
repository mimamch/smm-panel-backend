const express = require("express");
const { getServices, getCategory } = require("../controllers/services");
const { updateServices } = require("../update");

const router = express.Router();

router.get("/", getServices);
router.get("/category", getCategory);
router.get("/update", updateServices);

module.exports = router;
