const express = require("express");

const router = express.Router();

router.use("/", async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({
      msg: "OK",
    });
  } catch (error) {
    res.status(200).json({
      msg: error.message,
    });
  }
});

module.exports = router;
