const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema, ObjectId } = mongoose;

const ticketSchema = new Schema(
  {
    _id: Number,
    user: { type: ObjectId, ref: "User" },
    subject: String,
    firstMessage: String,
  },
  { timestamps: true, _id: false }
);

ticketSchema.plugin(AutoIncrement, { inc_field: "_id" });

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
