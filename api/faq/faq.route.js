const express = require('express');
const router = express.Router();
const { validateTocken } = require('../../auth/tokenValidator');
const { FAQCreate_, FAQUpadte_, FAQRemove_, FAQRead_, FAQToggleInActive } = require("./faq.controller")
const adminOnly = require("../../middleware/adminOnly.middleware")
router.route('/').get(validateTocken, FAQRead_).post(validateTocken, adminOnly, FAQCreate_)
router.route('/:id').patch(validateTocken, adminOnly, FAQUpadte_).delete(validateTocken, adminOnly, FAQRemove_)
router.route('/toogle/:id').patch(validateTocken, adminOnly, FAQToggleInActive)

/*To handle all invalid request */
router.all("*", (request, response) => {
   response.status(500).json({ status: "failed", message: "invalid request" });
});
module.exports = router;