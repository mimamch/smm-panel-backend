const express = require("express");
const { newOrder, status, history } = require("../controllers/order");

const router = express.Router();

router.post("/new-order", newOrder);
router.post("/status", status);
router.post("/history", history);

module.exports = router;
