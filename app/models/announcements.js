const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const announceSchema = new Schema(
  {
    title: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const Announcements = mongoose.model("Announcements", announceSchema);
module.exports = { Announcements };
