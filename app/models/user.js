const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username Harus Di Isi"],
    unique: true,
  },
  fullName: { type: String, required: [true, "Nama Harus Di Isi"] },
  balance: { type: Number, default: 0 },
  email: { type: String, required: [true, "Email Harus Di Isi"], unique: true },
  phoneNumber: { type: String, required: [true, "Nomor Telepon Harus Di Isi"] },
  password: { type: String, required: [true, "Password Harus Di Isi"] },
  totalDeposit: { type: Number, default: 0 },
  balanceUsed: { type: Number, default: 0 },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
