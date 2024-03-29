require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken, { lazyLoading: true });
const voiceResponse = require("twilio").twiml.VoiceResponse;
const path = require("path");
const fs = require("fs/promises");
const { request } = require("http");
const { response } = require("express");

// client.verify.v2.services
//     .create({
//         friendlyName: "Verify otp",
//         codeLength: 4,
//         lookupEnabled: true,
//         psd2Enabled: true,
//     })
//     .then((service) => console.log("=====", service.sid));

// client.verify.v2
//     .services("VA3edd25bf00c129b2ec495e2bf6368181")
//     .fetch()
//     .then((service) => console.log(service.sid));

const sendSMS = async (config) => {
  console.log("inside sendsms");
  // client.verify.v2
  //     .services("varify otp")

  //     .verifications.create({
  //         to: config.to,
  //         from: process.env.SENDER_PHONE_NUMBER,
  //         body: config.body,
  //         channel: "sms",
  //     })
  //     .then((verification) => console.log(verification.status));
  try {
    const otpResponse = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: config.to,
        channel: "sms",
      });

    return otpResponse;
  } catch (e) {
    console.log(e);
    return null;
  }
  // try {

  //     const result = await client.messages.create({
  //         to: config.to,
  //         from: process.env.SENDER_PHONE_NUMBER,
  //         body: config.body,
  //     });

  //     console.log("parnahsa", result);
  //     return result;
  // } catch (error) {
  //     throw new Error(error?.message);
  // }
};

const checkVerification = async (config) => {
  try {
    if (config.code == process.env.DEFAULT_OTP) return true;
    const verifyResponse = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: config.to,
        code: config.code,
      });

    // console.log(verifyResponse);
    return verifyResponse.status === "approved" ? true : false;
  } catch (e) {
    console.log(e.message);
  }
};

const sendVerificationSms = async (to) => {
  //Otp is now being generated autonatically by twilio service
  // const otp = Math.ceil(Math.random() * 9000 + 1000);
  // console.log(otp);

  const body = `Welcome to Yatri Onn Time, Your Verificarion Code:`;
  const status = await sendSMS({
    to,
    body,
  });
  console.log(status);
  return {
    status,
  };
};

const generateCallDetails = async (message) => {
  const response = new voiceResponse();
  response.say(
    {
      language: "en-IN",
      voice: "Polly.Raveena",
    },
    message
  );
  const body = response.toString();
  console.log(body);
  const fName = `voice_${new Date().getTime().toString()}.xml`;
  const dir = path.join(process.cwd(), "data", "voices");
  let file;
  try {
    file = await fs.open(path.join(dir, fName), "w");
  } catch {
    const newDir = await fs.mkdir(path.join(dir));
    file = await fs.open(path.join(newDir, fName), "w");
  }
  file.writeFile(body, "utf8");
  file.close();
  return fName;
};

// For calling
const remindUser = async (remind) => {
  //   const fName = await generateCallDetails(remind.message);
  //   const fName = await generateCallDetails(`Hello aninda `);
  //   const fUrl = `${process.env.ORIGIN}/files/voices/${fName}`;
  //   const fUrl = `https://082d-2405-201-8009-2049-9d3f-bf54-4851-3e36.ngrok-free.app/voice_1684822861838.xml`;
  //   const fUrl = `http://demo.twilio.com/docs/voice.xml`;

  //   console.log({ fUrl, remind });
  try {
    const result = await client.calls.create({
      //   url: fUrl,
      twiml: `<?xml version="1.0" encoding="UTF-8"?><Response><Say language="hi-IN" voice="Polly.Aditi">${remind.message}</Say></Response>`,
      to: remind.to,
      from: process.env.SENDER_PHONE_NUMBER,
    });
    return {
      result,
      //fUrl,
      message: remind.message,
    };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = {
  sendVerificationSms,
  remindUser,
  checkVerification,
};
