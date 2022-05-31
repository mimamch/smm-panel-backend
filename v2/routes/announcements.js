const express = require("express");
const {
  getAnnounce,
  addAnnounce,
  deleteAnnounce,
} = require("../controllers/announcements");

const router = express.Router();

router.get("/", getAnnounce);
router.post("/", addAnnounce);
router.delete("/", deleteAnnounce);

module.exports = router;
