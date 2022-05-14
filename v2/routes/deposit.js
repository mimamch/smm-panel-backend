const express = require("express");
const {
  newDeposit,
  historyDeposit,
  getBank,
  getDepositInfo,
} = require("../controllers/deposit");

const router = express.Router();

router.get("/get-bank", getBank);
router.post("/new", newDeposit);
router.get("/history", historyDeposit);
router.get("/info-deposit", getDepositInfo);

module.exports = router;
