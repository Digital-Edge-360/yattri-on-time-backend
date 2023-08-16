const { Subcription } = require("../../models/Subcription");
const { User } = require("../../models/User");
const crypto = require('crypto');
// let nonce;
const qs = require("querystring");
const {
  EncryptCcavenueRequest,
  DecryptCcavenueResponse,
} = require("../../util/helpers");

const CcavRequestHandler = (request, response) => {
  const stringify_payload = qs.stringify({
    // integration_type:"iframe_normal",
    ...request.body,
  });

  const encryptionResponseData = EncryptCcavenueRequest(stringify_payload);
  
  // CCAvenue accept request only in form of HTML Forms so we are rendering this form
  response.render("./ccav_payment_request.html", {
    encryptedData: encryptionResponseData,
    access_code: process.env.ACCESS_CODE,
  
  });
};

const CcavResponseHandler = async (request, response) => {
  console.log(request)
  const { encResp } = request.body;
  /* decrypting response */
  let decryptedJsonResponseData;
  decryptedJsonResponseData = DecryptCcavenueResponse(encResp);
  let data = decryptedJsonResponseData;

  const {
    merchant_param1,
    merchant_param2,
    merchant_param6,
    merchant_param3,
    merchant_param4,
    order_status,
    failure_message,
    status_code,
    status_message,
    amount,
    tracking_id,
    payment_mode,
    card_name,
    customer_card_id,
  } = data || {};

  if (
    order_status == "Invalid" ||
    order_status == "Aborted" ||
    order_status == "Cancelled" ||
    order_status == "Unsuccessful" ||
    order_status == "Failure"
  ) {
    // Faliure logic goes here
    response.status(200).json({ message: "failure" });
  }

  // Success logic goes here
  response.status(200).json({ message: "successful" });
};

module.exports = { CcavRequestHandler, CcavResponseHandler  };
