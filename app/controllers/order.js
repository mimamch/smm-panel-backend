const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const {
  getAllServices,
  getServicesbyId,
  makeFinalPrice,
} = require("../../tools");
const HistoryOrder = require("../models/order");
const User = require("../models/user");

module.exports = {
  newOrder: async (req, res) => {
    try {
      const { service, quantity, target } = req.body;
      const header = req.headers.authorization;
      const token = header.split(" ")[1] || req.cookies.token;
      const decoded = jwt.decode(token);
      const serv = await getServicesbyId(service);
      const user = await User.findById(decoded._id).select("-password");
      if (!user || !token)
        return res.status(401).json({ msg: "Access Denied" });
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
      // const price = parseInt(serv.rate);
      // const amount = makeFinalPrice(price) * quantity;
      const amount = Math.ceil((serv.rate / 1000) * quantity);

      if (user.balance < amount)
        return res
          .status(400)
          .json({ msg: "Maaf, Saldo anda tidak mencukupi" });

      const send = await axios.post(process.env.API_ENDPOINT, {
        key: process.env.API_KEY,
        service: service,
        action: "add",
        link: target,
        quantity: quantity,
      });

      if (send.data.success) {
        const balanceBefore = user.balance;
        user.balance -= amount;
        user.balanceUsed += amount;
        await user.save();
        const makeHistory = new HistoryOrder({
          orderId: send.data.orderId,
          user: user._id,
          serviceId: service,
          serviceName: serv.name,
          amount: amount,
          quantity: quantity,
          balanceAfter: user.balance,
          balanceBefore: balanceBefore,
        });
        const history = await makeHistory.save();
        return res.status(200).json({ history });
      }
      console.log(send.data);
      res.status(500).json({
        msg: send.data.error,
      });
    } catch (error) {
      console.log(error);
    }
  },
  orderStatus: async (req, res) => {
    try {
      const response = await axios.post(process.env.API_ENDPOINT, {
        key: process.env.API_KEY,
        action: "status",

        order: req.params.id,
      });

      res.status(200).json({
        data: response.data,
        msg: "OK",
      });
    } catch (error) {
      console.log(error);
    }
  },
  orderHistory: async (req, res) => {
    try {
      const header = req.headers.authorization;
      if (!header)
        return res
          .status(401)
          .json({ msg: "Access Denied, You Must Login First." });
      const token = header.split(" ")[1];
      const { _id } = jwt.decode(token);
      const history = await HistoryOrder.find({ user: _id });
      res.status(200).json({ length: history.length, history });
    } catch (error) {
      console.log(error);
    }
  },
};
