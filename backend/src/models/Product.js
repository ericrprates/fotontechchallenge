const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required."],
    index: true,
    text: true
  },
  description: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

exports.model = mongoose.model("Product", ProductSchema);
exports.schema = ProductSchema;
