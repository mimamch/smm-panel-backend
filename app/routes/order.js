const express = require("express");
const { newOrder, orderStatus, orderHistory } = require("../controllers/order");

const router = express.Router();

router.post("/new-order", newOrder);
router.post("/status/:id", orderStatus);
router.use("/history", orderHistory);

module.exports = router;
