const { Ticket } = require("../../app/models/ticket");

module.exports = {
  buatTiket: async (req, res) => {
    try {
      const ticket = new Ticket({
        user: "626d1039e3cfe8798481997d",
        subject: "Halo",
        firstMessage: "aaaaaaaaaaaaaaaaaa",
      });
      const send = await ticket.save();
      console.log(send);
      res.json({ send });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: error.message,
      });
    }
  },
};
