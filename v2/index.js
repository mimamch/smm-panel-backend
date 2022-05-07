const express = require("express");
const { isLoggin } = require("../tools");

const router = express.Router();

router.use("/services", require("./routes/services"));
router.use("/order", isLoggin, require("./routes/order"));

module.exports = router;
