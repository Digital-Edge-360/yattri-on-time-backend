const express = require("express");
const adminOnly = require("../../middleware/adminOnly.middleware");
const router = express.Router();
const {
    adminLogin_,
    adminRegister_,
    showAdmin_,
} = require("./admin.controller");
const { validateTocken } = require("../../auth/tokenValidator");
router.route("/login").post(adminLogin_);
router.route("/register").post(adminRegister_);
router.route("/show-admin").get(validateTocken, adminOnly, showAdmin_);
module.exports = router;
