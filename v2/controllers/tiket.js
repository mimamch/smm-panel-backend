const jwt = require("jsonwebtoken");
const { Ticket } = require("../../app/models/ticket");

module.exports = {
  newTicket: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res.status(401).json({
          msg: "Access Denied, Please Login First",
        });
      const decoded = jwt.decode(token);
      const ticket = new Ticket({
        user: decoded._id,
        subject: req.body.subject,
        firstMessage: req.body.message,
      });
      const send = await ticket.save();
      res.json({ send });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  historyTicket: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token)
        return res.status(401).json({
          msg: "Access Denied, Please Login First",
        });
      const decoded = jwt.decode(token);
      const history = await Ticket.find({
        user: decoded._id,
      });

      res.json({ history });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
