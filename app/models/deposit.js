const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const BankSchema = new Schema(
  {
    bankName: String,
    accountNumber: String,
    accountName: String,
    isAuto: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const DepositSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User" },
    nominal: Number,
    bank: { type: ObjectId, ref: "Bank" },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    balanceBefore: Number,
    balanceAfter: Number,
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", DepositSchema);
const Bank = mongoose.model("Bank", BankSchema);

module.exports = { Deposit, Bank };
