const express = require("express");
const { getUser, getDeposit, actionDeposit } = require("../controllers/user");

const router = express.Router();

router.get("/get-user", getUser);
router.get("/get-deposit", getDeposit);
router.post("/action-deposit", actionDeposit);

module.exports = router;
