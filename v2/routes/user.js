const express = require("express");
const {
  getUser,
  getDeposit,
  actionDeposit,
  getAllHistory,
} = require("../controllers/user");

const router = express.Router();

router.get("/get-user", getUser);
router.get("/get-deposit", getDeposit);
router.post("/action-deposit", actionDeposit);
router.get("/get-all-history", getAllHistory);

module.exports = router;
