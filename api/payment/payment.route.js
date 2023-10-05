const router = require("express").Router();
const {
  CcavRequestHandler,
  CcavResponseHandler,
  CcavStoreResponseHandler,
  inAppPaymentHandler,
} = require("./payment.controller.js");

router.post("/ccavRequest", CcavRequestHandler);
router.post("/ccavResponse", CcavResponseHandler);
router.post("/ccavStoreResponse", CcavStoreResponseHandler);
router.post("/in_app_payment", inAppPaymentHandler);

/*To handle all invalid request */
router.all("*", (request, response) => {
  response.status(500).json({ status: "failed", message: "invalid request" });
});

module.exports = router;
