const { Subcription } = require("../../models/Subcription");
const { User } = require("../../models/User");
const { Transaction } = require("../../models/Transaction");
const crypto = require("crypto");
// let nonce;
const qs = require("querystring");
const {
  EncryptCcavenueRequest,
  DecryptCcavenueResponse,
} = require("../../util/helpers");

const CcavRequestHandler = (request, response) => {
  const stringify_payload = qs.stringify({
    ...request.body,
  });

  const encryptionResponseData = EncryptCcavenueRequest(stringify_payload);

  response.status(200).json({
    encryptedData: encryptionResponseData,
  });

  // CCAvenue accept request only in form of HTML Forms so we are rendering this form
  // response.render("./ccav_payment_request.html", {
  //   encryptedData: encryptionResponseData,
  //   access_code: process.env.ACCESS_CODE,

  // });
};

const CcavResponseHandler = async (request, response) => {
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
  response.status(200).json({ message: "successful", data });
};

const paymentResponseHandler = async (request, response) => {
  // expected request { status , transactionId , userId , subscriptionId  }

  // 1) find the transaction
  const transaction = await Transaction.findOne({
    _id: request.body.transactionId,
  });

  const user = await User.findOne({
    _id: request.body.userId,
  });

  const subscription = await Subcription.findOne({
    _id: request.body.subscriptionId,
  });

  if (!transaction)
    return response.status(404).json({ message: "Invalid transaction ID" });

  if (!user) return response.status(404).json({ message: "Invalid user ID" });

  if (!subscription)
    return response.status(404).json({ message: "Invalid Subscription ID" });

  // 2) check if the payment status is success full or failure
  //a) if successful make the transaction status 'sucess' and add valid subscription to the user and add to suscribe model
  if (request.body.status === "Success") {
    user.validSubscription = subscription._id;
    user.reminder += subscription.no_of_reminder;
    transaction.status = "success";
    user.save();
    transaction.save();

    return response
      .status(200)
      .json({ message: "Subscription successfully added", user, transaction });
  }
  //b) if the response is of failure then make transaction 'failed' and return failure message
  else {
    transaction.status = "failed";
    transaction.save();
    return response
      .status(200)
      .json({ message: "Subscription not added!", user, transaction });
  }
};

module.exports = {
  CcavRequestHandler,
  CcavResponseHandler,
  paymentResponseHandler,
};
