const express = require("express");
const { register, login, profile, history } = require("../controllers/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.get("/history", history);

module.exports = router;
