const mongoose = require("mongoose");

const { Schema } = mongoose;

const VerificationSchema = new Schema({
  code: String,
  user: { type: mongoose.ObjectId, ref: "User" },
  expired: Number,
  status: { type: Boolean, default: false },
});

const Verification = mongoose.model("Verification", VerificationSchema);

module.exports = Verification;
