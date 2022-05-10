const express = require("express");
const { newTicket, historyTicket } = require("../controllers/tiket");

const router = express.Router();

router.post("/new", newTicket);
router.get("/history", historyTicket);

module.exports = router;
