const express = require("express");
const { isLoggin } = require("../tools");

const router = express.Router();

router.use("/services", require("./routes/services"));
router.use("/order", isLoggin, require("./routes/order"));
router.use("/ticket", isLoggin, require("./routes/ticket"));
router.use("/deposit", isLoggin, require("./routes/deposit"));
router.use("/user", require("./routes/user"));
router.use("/notifications", require("./routes/notifications"));
router.use("/api-check", require("./tools/apiCheck"));

module.exports = router;
