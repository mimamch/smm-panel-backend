const { default: mongoose } = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: String,
});

const Category = mongoose.model("Category", CategorySchema);

const ServicesSchema = new mongoose.Schema({
  serviceId: Number,
  name: String,
  type: String,
  category: String,
  categoryId: String,
  rate: Number,
  min: Number,
  max: Number,
  desc: String,
  dripfeed: Boolean,
  refill: Boolean,
});

const Services = mongoose.model("Services", ServicesSchema);

module.exports = { Category, Services };
