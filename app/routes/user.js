const express = require("express");
const {
  register,
  login,
  profile,
  history,
  changeProfile,
  sendForgotEmail,
  checkVerificatonCode,
  createNewPassword,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.get("/history", history);
router.post("/change-profile", changeProfile);
router.post("/send-forgot-email", sendForgotEmail);
router.post("/check-verification-code", checkVerificatonCode);
router.post("/create-new-password", createNewPassword);

module.exports = router;
