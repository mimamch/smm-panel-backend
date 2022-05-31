const jwt = require("jsonwebtoken");
const { Deposit, Bank } = require("../../app/models/deposit");
const User = require("../../app/models/user");
const sendEmail = require("../../mailer");
const { snap } = require("../../midtrans/snap");

module.exports = {
  newDeposit: async (req, res) => {
    try {
      const { bank, nominal } = req.body;
      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res.status(401).json({
          msg: "Access Denied, Please Login First",
        });
      const decoded = jwt.decode(token);
      const isDuplicate = await Deposit.find({
        user: decoded._id,
        status: "pending",
      });
      const bankInfo = await Bank.findById(bank);
      if (isDuplicate.length != 0 && !bankInfo.isAuto)
        return res.status(400).json({
          msg: "Harap selesaikan/hapus permintaan deposit sebelumnya untuk membuat deposit baru",
          deposit: isDuplicate[0],
        });

      const deposit = new Deposit({
        user: decoded._id,
        bank: bankInfo,
        nominal,
      });
      if (bankInfo.isAuto) {
        let parameter = {
          transaction_details: {
            order_id: deposit._id,
            gross_amount: nominal,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            email: decoded?.email,
          },
        };
        snap.createTransaction(parameter).then(async (transaction) => {
          // transaction token
          deposit.redirectUrl = transaction.redirect_url;
          deposit.token = transaction.token;
          const depo = await deposit.save();
          return res.status(200).json({
            msg: depo,
          });
        });
        return;
      }
      const depo = await deposit.save();

      sendEmail(process.env.EMAIL_MAILER, {
        subject: "Ada Permintaan Deposit!",
        html: `
        ${JSON.stringify(depo)}
        `,
      });
      res.status(200).json({
        msg: depo,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  historyDeposit: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res.status(401).json({
          msg: "Access Denied, Please Login First",
        });
      const decoded = jwt.decode(token);
      const history = await Deposit.find({ user: decoded._id });

      res.status(200).json({
        msg: history,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  getBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      res.status(200).json({
        length: bank.length,
        data: bank,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  getDepositInfo: async (req, res) => {
    try {
      const info = await Deposit.findById(req.query.id);
      res.status(200).json({
        data: info,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  cancelDeposit: async (req, res) => {
    try {
      await Deposit.findByIdAndUpdate(req.body.id, {
        status: "failed",
      });
      res.status(200).json({
        msg: "Status Updated to Failed",
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
