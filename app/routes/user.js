const express = require("express");
const {
  register,
  login,
  profile,
  history,
  changeProfile,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.get("/history", history);
router.post("/change-profile", changeProfile);

module.exports = router;
