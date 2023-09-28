const { Subcription } = require("../../models/Subcription");
const { User } = require("../../models/User");
const { Transaction } = require("../../models/Transaction");
const crypto = require("crypto");
// let nonce;
const qs = require("querystring");
const { encrypt, decrypt } = require("../../util/helpers");

const CcavRequestHandler = (request, response) => {
  var body = "",
    workingKey = process.env.WORKING_KEY, //Put in the 32-Bit key shared by CCAvenues.
    accessCode = process.env.ACCESS_CODE, //Put in the Access Code shared by CCAvenues.
    encRequest = "";
  body = request.body.payment_string;
  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");
  encRequest = encrypt(body, keyBase64, ivBase64);

  response.status(200).json({
    encRec: encRequest,
  });
};

const CcavResponseHandler = async (request, response) => {
  var ccavEncResponse = "",
    ccavResponse = "",
    workingKey = process.env.WORKING_KEY, //Put in the 32-Bit key shared by CCAvenues.
    ccavPOST = "";

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  ccavResponse = decrypt(request.body.encResp, keyBase64, ivBase64);

  const orderId = ccavResponse.split("&")[0].split("=")[1];
  const status = ccavResponse.split("&")[3].split("=")[1];
  const userId = ccavResponse.split("&")[26].split("=")[1];
  const subscriptionId = ccavResponse.split("&")[27].split("=")[1];

  console.log(status, "this is my status");
  console.log(userId, "this is my user id");
  console.log(subscriptionId, "this is my subs id");
  console.log(orderId, "this is my order id");

  const user = await User.findOne({
    _id: userId,
  });

  const subscription = await Subcription.findOne({
    _id: subscriptionId,
  });

  if (!user) return response.status(404).json({ message: "Invalid user ID" });

  if (!subscription)
    return response.status(404).json({ message: "Invalid Subscription ID" });

  const transaction = await Transaction.create({
    payment_id: orderId,
    amount: subscription.price,
    user_id: userId,
    status: "pending",
    remarks: `Subscription charge ofssssds ${subscription.price} for ${subscription.title} Plan`,
    date: Date.now(),
  });

  if (status === "Success") {
    if (user.validSubscription === "No Subscription") {
      user.validSubscription = subscription._id;
      user.reminder += subscription.no_of_reminder;
    } else {
      const currSubscription = await Subcription.findOne({
        _id: user.validSubscription,
      });

      if (!currSubscription) {
        return response
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

    transaction.status = "success";
    transaction.save();
    user.save();

    //response.status(200).json({message:"Subscription charged"});

    response.render("payment_sucessful.html");
  } else {
    //response.status(400).json({message:"Payment could not proceed"});
    transaction.status = "failed";
    transaction.save();
    response.render("payment_failed.html");
  }
};

const inAppPaymentHandler = async (request, response) => {
  try {
    const user = await User.findOne({
      _id: request.body.userId,
    });

    const subscription = await Subcription.findOne({
      _id: request.body.subscriptionId,
    });

    if (!user) return response.status(404).json({ message: "Invalid user ID" });

    if (!subscription)
      return response.status(404).json({ message: "Invalid Subscription ID" });

    if (user.validSubscription === "No Subscription") {
      user.validSubscription = subscription._id;
      user.reminder += subscription.no_of_reminder;
    } else {
      const currSubscription = await Subcription.findOne({
        _id: user.validSubscription,
      });

      if (!currSubscription) {
        return response
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

    const transaction = await Transaction.create({
      payment_id: Date.now(),
      amount: subscription.price,
      user_id: request.body.userId,
      status: "success",
      date: Date.now(),
      remarks: `Subscription charge of ${subscription.price} for ${subscription.title} Plan`,
    });

    return response.status(200).json({
      message: "Subscription Added!",
      transaction,
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error!" });
  }
};

// const paymentResponseHandler = async (request, response) => {
//   // expected request { status , transactionId , userId , subscriptionId  }

//   // 1) find the transaction
//   const transaction = await Transaction.findOne({
//     _id: request.body.transactionId,
//   });

//   const user = await User.findOne({
//     _id: request.body.userId,
//   });

//   const subscription = await Subcription.findOne({
//     _id: request.body.subscriptionId,
//   });

//   if (!transaction)
//     return response.status(404).json({ message: "Invalid transaction ID" });

//   if (!user) return response.status(404).json({ message: "Invalid user ID" });

//   if (!subscription)
//     return response.status(404).json({ message: "Invalid Subscription ID" });

//   // 2) check if the payment status is success full or failure
//   //a) if successful make the transaction status 'sucess' and add valid subscription to the user and add to suscribe model
//   if (request.body.status === "Success") {
//     user.validSubscription = subscription._id;
//     user.reminder += subscription.no_of_reminder;
//     transaction.status = "success";
//     user.save();
//     transaction.save();

//     return response
//       .status(200)
//       .json({ message: "Subscription successfully added", user, transaction });
//   }
//   //b) if the response is of failure then make transaction 'failed' and return failure message
//   else {
//     transaction.status = "failed";
//     transaction.save();
//     return response
//       .status(200)
//       .json({ message: "Subscription not added!", user, transaction });
//   }
// };

module.exports = {
  // paymentResponseHandler,
  CcavRequestHandler,
  CcavResponseHandler,
  inAppPaymentHandler,
};
