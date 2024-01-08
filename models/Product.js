const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  ratings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],

  name: {
    type: String,
    required: [true, "A product must have a name"],
  },

  avgRating: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
    required: [true, "A product must have a description"],
  },

  specification1: {
    type: String,
    required: [true, "A product must have a specification1"],
  },

  specification2: {
    type: String,
    required: [true, "A product must have a specification2"],
  },

  specification3: {
    type: String,
    required: [true, "A product must have a specification3"],
  },

  price: {
    type: String,
    required: [true, "A product must have a price"],
  },

  image: {
    type: String,
    required: [true, "A product must have an image"],
  },

  inStock: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
  },
});

// Initialize ratings as empty array
ProductSchema.path("ratings").set(function (ratings) {
  return ratings || [];
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };
