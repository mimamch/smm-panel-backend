const express = require("express");
const { isLoggin } = require("../../tools");

const router = express.Router();

router.use("/user", require("./user"));
router.use("/services", require("./services"));
router.use("/order", isLoggin, require("./order"));

module.exports = router;
