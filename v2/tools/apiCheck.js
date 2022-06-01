const { default: axios } = require("axios");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("POST TO " + `${process.env.API_ENDPOINT2}/services`);
    const services = await axios.post(`https://drd3m.com/api/v2`, {
      action: "services",
      key: "b1bbaff42968ff33fef2864845e17126",
    });
    res.status(200).json({
      msg: services.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error.message,
    });
  }
});

module.exports = router;
