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

const sendVerificationSms = async (to) => {
    const otp = Math.ceil(Math.random() * 9000 + 1000);
    const body = `Welcome to Yatri Onn Time, Your Verificarion Code: ${otp}`;
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
    response.say({
        language:'en-IN',
        voice:'Polly.Raveena'
    },message);
    const body = response.toString();
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

const remindUser = async (remind) => {
    const fName = await generateCallDetails(remind.message);
    // const fName = await generateCallDetails(`Hello aninda `);
    // const fUrl = `${process.env.ORIGIN}/files/voices/${fName}`;
    const fUrl = `${process.env.ORIGIN2}/files/voices/${fName}`;
    console.log({fUrl, remind});
    try {
        const result = await client.calls.create({
            url: fUrl,
            to: remind.to,
            from: process.env.SENDER_PHONE_NUMBER,
        });
        return {
            result,
            fUrl,
        };
    } catch (error) {
        console.log(error);
        return { error, fUrl };
    }
};

module.exports = {
    sendVerificationSms,
    remindUser,
};
