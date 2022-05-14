const jwt = require("jsonwebtoken");
const { Deposit, Bank } = require("../../app/models/deposit");
const User = require("../../app/models/user");

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
      if (isDuplicate.length != 0)
        return res.status(400).json({
          msg: "Harap selesaikan/hapus permintaan deposit sebelumnya untuk membuat deposit baru",
          deposit: isDuplicate[0],
        });
      const deposit = new Deposit({
        user: decoded._id,
        bank,
        nominal,
      });
      const depo = await deposit.save();
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
};
