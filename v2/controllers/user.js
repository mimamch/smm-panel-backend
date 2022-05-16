const { Deposit } = require("../../app/models/deposit");
const HistoryOrder = require("../../app/models/order");
const User = require("../../app/models/user");

module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await User.find()
        .collation({ locale: "en", strength: 2 })
        .sort({ username: 1 });
      res.status(200).json({
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  getDeposit: async (req, res) => {
    try {
      const deposit = await Deposit.find()
        .sort({ createdAt: -1 })
        .populate("user");
      res.status(200).json({
        data: deposit,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  actionDeposit: async (req, res) => {
    try {
      const { id } = req.body;

      const deposit = await Deposit.findById(id).populate("user");
      let promo = deposit.bank.promo || 0;
      if (promo) {
        promo = (deposit.nominal * promo) / 100;
      }
      if (req.body.action == "accept") {
        deposit.balanceBefore = deposit.user.balance;
        deposit.status = "success";
        deposit.user.balance += deposit.nominal + promo;
        deposit.user.totalDeposit += deposit.nominal;
        deposit.balanceAfter = deposit.user.balance;
      }
      if (req.body.action == "decline") {
        deposit.status = "failed";
        deposit.balanceBefore = deposit.user.balance;
        deposit.balanceAfter = deposit.user.balance;
      }

      const result = await deposit.save();
      await deposit.user.save();

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  getAllHistory: async (req, res) => {
    try {
      const history = await HistoryOrder.find().sort({ createdAt: -1 });
      res.status(200).json({
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
