const express = require("express");
const { Deposit } = require("../../app/models/deposit");
const { acceptDeposit } = require("../tools");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.status_message == "midtrans payment notification") {
      let transactionStatus = req.body.transaction_status;
      let fraudStatus = req.body.fraud_status;
      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
          console.log("Fraud Status is Challenge");
        } else if (fraudStatus == "accept") {
          await acceptDeposit(req.body.order_id);
          console.log("Accepted Status");
        }
      } else if (transactionStatus == "settlement") {
        await acceptDeposit(req.body.order_id);
        console.log("settlement");
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        const failed = await Deposit.findById(req.body.order_id);
        if (failed.status == "pending") {
          failed.status = "failed";
          await failed.save();
        }
      }
    }
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
