const { default: mongoose } = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Category2 = mongoose.model("Category2", CategorySchema);

const ServicesSchema = new mongoose.Schema(
  {
    serviceId: Number,
    name: String,
    category: String,
    categoryId: String,
    rate: Number,
    min: Number,
    max: Number,
    desc: String,
    dripfeed: Boolean,
    refill: Boolean,
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Services2 = mongoose.model("Services2", ServicesSchema);

module.exports = { Category2, Services2 };
