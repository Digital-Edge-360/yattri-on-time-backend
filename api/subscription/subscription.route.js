const router = require("express").Router();
const { validateTocken } = require("../../auth/tokenValidator");
const {
  Find_,
  FindAll_,
  Add_,
  Update_,
  Remove_,
} = require("./subscription.controller");
const adminOnly = require("../../middleware/adminOnly.middleware");

router.route("/").get(FindAll_).post(validateTocken, adminOnly, Add_);
router
  .route("/:id")
  .get(Find_)
  .patch(Update_)
  .delete(validateTocken, adminOnly, Remove_);

module.exports = router;
