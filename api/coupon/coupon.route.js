const express = require("express");
const {
  getAllCoupons,
  getCouponByID,
  createCoupon,
  redeemCoupon,
  updateCoupon,
  deleteCoupon,
} = require("./coupon.controller");
const { validateTocken } = require("../../auth/tokenValidator");

const router = express.Router();

router.route("/").get(getAllCoupons);
router
  .route("/:id")
  .get(getCouponByID)
  .patch(updateCoupon)
  .delete(deleteCoupon);
router.post("/create_coupon", createCoupon);
router.post("/redeem_coupon", validateTocken, redeemCoupon);

router.all("*", (request, response) => {
  response.status(500).json({ status: "failed", message: "invalid request" });
});

module.exports = router;
