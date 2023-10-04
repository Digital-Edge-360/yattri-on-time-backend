const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: Number,
    required: [true, "Order must have a price"],
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "out_for_delivery", "delivered"],
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
