const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  subscription: {
    type: mongoose.Schema.ObjectId,
    ref: "Subcription",
  },
  couponCode: {
    type: String,
    required: [true, "Coupon must have a code"],
  },
});

CouponSchema.pre(/^find/, function (next) {
  this.populate("user");
  this.populate("subscription");
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);
module.exports = { Coupon };
