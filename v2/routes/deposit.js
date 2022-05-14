const express = require("express");
const {
  newDeposit,
  historyDeposit,
  getBank,
} = require("../controllers/deposit");

const router = express.Router();

router.get("/get-bank", getBank);
router.post("/new", newDeposit);
router.get("/history", historyDeposit);

module.exports = router;
