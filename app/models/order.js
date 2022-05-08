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
    target: String,
    orderStatus: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
    balanceBefore: Number,
    balanceAfter: Number,
    apiVersion: { type: Number, default: 1 },
    serverPrice: Number,
  },
  { timestamps: true }
);

const HistoryOrder = mongoose.model("HistoryOrder", HistoryOrderSchema);

module.exports = HistoryOrder;
