const { default: axios } = require("axios");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const services = await axios.post(
      `${process.env.API_ENDPOINT2}/services`,
      {
        api_id: process.env.API_ID_2,
        api_key: process.env.API_KEY_2,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(services.data);
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
