const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const ticketSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User" },
    subject: String,
    firstMessage: String,
  },
  { timestamps: true }
);

const ticketMessageScehma = new Schema(
  {
    ticketId: { type: ObjectId, ref: "Ticket" },
    user: { type: ObjectId, ref: "User" },
    message: String,
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
const TicketAnswer = mongoose.model("TicketAnswer", ticketMessageScehma);

module.exports = { Ticket, TicketAnswer };
