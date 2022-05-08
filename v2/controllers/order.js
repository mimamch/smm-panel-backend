const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const { getServiceById } = require("../tools/");
const User = require("../../app/models/user");
const HistoryOrder = require("../../app/models/order");
module.exports = {
  newOrder: async (req, res) => {
    try {
      const { service, quantity, target } = req.body;
      const customComments =
        req.body.customComments || "This Is Custom Comments";
      const customLink = req.body.customLink || "This Is Custom Link";
      let header = req.headers.authorization;
      if (!header && !req.cookies.token)
        return res.status(401).json({ msg: "Access Denied" });
      const token = req.cookies.token || header.split(" ")[1];
      if (!token) return res.status(401).json({ msg: "Access Denied" });
      const decoded = jwt.decode(token);
      if (!decoded) return res.status(401).json({ msg: "Access Denied" });
      const serv = await getServiceById(service);
      const user = await User.findById(decoded._id).select("-password");
      if (!user) return res.status(401).json({ msg: "Access Denied" });
      if (!serv)
        return res.status(400).json({ msg: "Service tidak ditemukan" });
      if (quantity < serv.min || quantity > serv.max)
        return res.status(400).json({
          msg: `Kuantitas tidak boleh kurang dari ${serv.min} dan lebih dari ${serv.max}`,
        });
      if (!target)
        return res.status(400).json({
          msg: `Target tidak boleh kosong`,
        });

      const amount = Math.ceil((serv.rate / 1000) * quantity);

      if (user.balance < amount)
        return res
          .status(400)
          .json({ msg: "Maaf, Saldo anda tidak mencukupi" });

      const send = await axios.post(
        "https://irvankede-smm.co.id/api/order",
        {
          api_id: process.env.API_ID_2,
          api_key: process.env.API_KEY_2,
          service: service,
          target: target,
          quantity: quantity,
          custom_comments: customComments,
          custom_link: customLink,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (send.data.status) {
        const balanceBefore = user.balance;
        user.balance -= amount;
        user.balanceUsed += amount;
        await user.save();
        const makeHistory = new HistoryOrder({
          orderId: send.data.data.id,
          serverPrice: send.data?.data?.price,
          user: user._id,
          serviceId: service,
          serviceName: serv.name,
          amount: amount,
          quantity: quantity,
          target: target,
          balanceAfter: user.balance,
          balanceBefore: balanceBefore,
          apiVersion: 2,
        });
        const history = await makeHistory.save();
        return res.status(200).json({ history });
      }
      res.status(500).json({
        msg: send.data.error,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  status: async (req, res) => {
    try {
      const { id } = req.body;
      const status = await axios.post(
        "https://irvankede-smm.co.id/api/status",
        {
          api_id: process.env.API_ID_2,
          api_key: process.env.API_KEY_2,
          id: id,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (status.status) {
        return res.status(200).json({
          status: status.data.status,
          startCount: status.data.data.start_count,
          remains: status.data.data.remains,
        });
      }
      return res.status(500).json({
        msg: status,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  history: async (req, res) => {
    try {
      const history = await HistoryOrder.findOne({ orderId: req.body.id });
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
