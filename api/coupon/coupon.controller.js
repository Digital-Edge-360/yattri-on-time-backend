const mongoose = require("mongoose");
const { Coupon } = require("../../models/Coupon");
const { User } = require("../../models/User");
const { Subcription } = require("../../models/Subcription");
const { generateCouponCode } = require("../../util/helpers");
const { sendMail } = require("../../services/mail.service");
const getAllCoupons = async (req, res) => {
  try {
    const coupon = await Coupon.find({});

    res.status(200).json({ coupon });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCouponByID = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id });

    if (!coupon) return res.status(404).message({ message: "No coupon found" });

    return res.status(200).json({ coupon });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id });
    if (!coupon) return res.status(404).message({ message: "No coupon found" });

    return res
      .status(200)
      .json({ message: "This action preffered not to perform here" });
  } catch (error) {}
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id });
    if (!coupon) return res.status(404).json({ message: "No coupon found" });

    await Coupon.findByIdAndDelete(coupon._id);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createCoupon = async (req, res) => {
  try {
    // Reading and checking if the userId and SubscriptionId
    const { userId, subscriptionId } = req.body;
    const user = await User.findOne({ _id: userId });
    const subscription = await Subcription.findOne({ _id: subscriptionId });
    if (!user) return res.status(404).json({ message: "No user found" });
    if (!subscription)
      return res.status(404).json({ message: "No subscrption found" });

    // Generating coupon using a helper function
    const couponCode = generateCouponCode()[0];

    // Creating coupon document in db
    const coupon = await Coupon.create({
      user: userId,
      subscription: subscriptionId,
      couponCode,
    });

    // prepareing the content
    const html = `<p>Hey ${user.name}, you coupon code for ${subscription.title} subscription is <b>${couponCode}</b></p>`;
    const subject = "Coupon code";
    //Sending mail with the content and returing response
    sendMail(html, user.email, subject);
    return res.status(200).json({
      message: `Check your email ${user.email} for the Coupon code`,
      coupon,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const redeemCoupon = async (req, res) => {
  try {
    // Reading user's coupon code
    const { couponCode } = req.body;

    // Finding and checking weather the coupon code is valid or not
    const coupon = await Coupon.findOne({
      couponCode,
    });
    if (!coupon)
      return res.status(400).json({
        message: `Coupon code ${couponCode} is invalid`,
      });

    // Checking if the the coupon belongs to the signed in user
    if (req.user.data._id !== coupon.user._id.toString())
      return res.status(400).json({
        message: `This code not belongs to you`,
      });

    // Adding the subscription to the user accordingly
    const user = await User.findById(coupon.user._id);
    const subscription = await Subcription.findById(coupon.subscription.id);
    if (user.validSubscription === "No Subscription") {
      user.validSubscription = subscription._id;
      user.reminder += subscription.no_of_reminder;
    } else {
      const currSubscription = await Subcription.findOne({
        _id: user.validSubscription,
      });

      if (!currSubscription) {
        return res
          .status(404)
          .json({ message: "not an valid current subscription" });
      }

      if (currSubscription.price > subscription.price) {
        user.reminder += subscription.no_of_reminder;
      } else {
        user.validSubscription = subscription._id;
        user.reminder += subscription.no_of_reminder;
      }
    }

    user.save();

    // Deleting the coupon after successful redeem
    await Coupon.findByIdAndDelete(coupon._id);
    res.status(200).json({ message: "Subscription redemmed reminder added" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCoupons,
  createCoupon,
  redeemCoupon,
  getCouponByID,
  updateCoupon,
  deleteCoupon,
};
