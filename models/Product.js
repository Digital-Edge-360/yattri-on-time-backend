const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
  },
  description: {
    type: String,
    required: [true, "A product must have a description"],
  },
  price: {
    type: String,
    required: [true, "A product must have a price"],
  },
  image: {
    type: String,
    required: [true, "A product must have a image"],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = { Product };
