const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const HistoryOrderSchema = new Schema(
  {
    orderId: String,
    user: { type: ObjectId, ref: "User" },
    serviceId: String,
    serviceName: String,
    amount: Number,
    quantity: Number,
    orderStatus: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    finalBalance: Number,
  },
  { timestamps: true }
);

const HistoryOrder = mongoose.model("HistoryOrder", HistoryOrderSchema);

module.exports = HistoryOrder;
