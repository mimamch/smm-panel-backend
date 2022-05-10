const express = require("express");
const { newDeposit, historyDeposit } = require("../controllers/deposit");

const router = express.Router();

router.post("/new", newDeposit);
router.get("/history", historyDeposit);

module.exports = router;
