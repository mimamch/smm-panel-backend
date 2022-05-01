const express = require("express");
const { getServices, getCategory } = require("../controllers/services");

const router = express.Router();

router.get("/", getServices);
router.get("/category", getCategory);

module.exports = router;
