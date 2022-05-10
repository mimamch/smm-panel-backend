const express = require("express");
const { buatTiket } = require("../controllers/tiket");

const router = express.Router();

router.post("/new", buatTiket);

module.exports = router;
