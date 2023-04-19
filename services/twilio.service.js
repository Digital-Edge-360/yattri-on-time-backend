const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const voiceResponse = require("twilio").twiml.VoiceResponse;
const path = require("path");
const fs = require("fs/promises");

const sendSMS = async (config) => {
    console.log("hi");
    try {
        const result = await client.messages.create({
            to: config.to,
            from: process.env.SENDER_PHONE_NUMBER,
            body: config.body,
        });
        return result;
    } catch (error) {
        throw new Error(error?.message);
    }
};

const sendVerificationSms = async (to = "+919609327424") => {
    const otp = Math.ceil(Math.random() * 9000 + 1000);
    const body = `Welcome to Yattri Onn Time, Your Verificarion Code: ${otp}`;
    const status = await sendSMS({
        to,
        body,
    });
    console.log(status);
    return {
        status,
        otp,
    };
};

const generateCallDetails = async (message) => {
    const response = new voiceResponse();
    response.say(message);
    const body = response.toString();
    const fName = `voice_${new Date().getTime().toString()}.xml`;
    const dir = path.join(process.cwd(), "data", "voices");
    const file = await fs.open(path.join(dir, fName), "w");
    file.writeFile(body, "utf8");
    return fName;
};

const remindUser = async (remind) => {
    try {
        const fName = await generateCallDetails(remind.message);
        const result = await client.calls.create({
            url: `${process.env.ORIGIN}/files/voices/${fName}`,
            to: remind.to,
            from: process.env.SENDER_PHONE_NUMBER,
        });
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports = {
    sendVerificationSms,
    remindUser,
};
