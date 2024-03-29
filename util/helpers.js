const bcrypt = require("bcryptjs");
const moment = require("moment");
const Joi = require("joi");
const { parsePhoneNumber } = require("libphonenumber-js");
const crypto = require("crypto");
const { Buffer } = require("node:buffer");
const qs = require("querystring");

const phoneValidator = (phone) => {
  try {
    parsePhoneNumber(phone);
    return true;
  } catch (error) {
    return false;
  }
  // let Regx = new RegExp(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/);
  // return Regx.test(phone);
};

const emailValidetor = (email) => {
  let Regx = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return Regx.test(email);
};
const formatPhone = (phone) => {
  let ph = phone.toString().length;
  if (ph == 10) return `+91${phone}`;
  else if (ph == 12) {
    return `+${phone}`;
  } else if (ph == 11) {
    let temp = `+91${phone.toString().substring(1, 10)}`;
    return temp;
  } else {
    return phone;
  }
};

const comparePassword = async (password1, password2) => {
  try {
    const isMatch = await bcrypt.compare(password1, password2);
    return isMatch;
  } catch (error) {
    return false;
  }
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const dividerTime = (date_time, call_time, frequency) => {
  const date = new Date(date_time).getTime();
  const call = new Date(call_time).getTime();
  const diff = call - date;
  const diff_in_minutes = Math.floor(diff / 60000);
  const callInterval = diff_in_minutes / frequency;
  let callTimes = [];
  let reminderTime = new Date(date_time);
  for (let i = 0; i < frequency; i++) {
    reminderTime = new Date(
      reminderTime.setMinutes(reminderTime.getMinutes() + callInterval)
    );
    callTimes.push(new Date(reminderTime));
  }
  return callTimes;
};

const getISTTime = (time) => {
  let currentTime;
  if (time === undefined) currentTime = new Date(Date.now());
  else currentTime = new Date(time);
  currentTime.setHours(currentTime.getHours() + 5);
  currentTime.setMinutes(currentTime.getMinutes() + 30);

  return currentTime;
};

const getGmtTime = (time) => {
  const currentTime = new Date(time);
  console.log({ currentTime });
  currentTime.setHours(currentTime.getHours() - 5);
  currentTime.setMinutes(currentTime.getMinutes() - 30);
  return currentTime;
};

const reviewJoi = Joi.object({
  userId: Joi.string().required(),

  rating: Joi.number().min(1).max(5).required(),

  message: Joi.string(),

  isDeleted: Joi.boolean(),
});

const UpdatereviewJoi = Joi.object({
  userId: Joi.string().optional(),

  rating: Joi.number().min(1).max(5).optional(),

  message: Joi.string().optional(),

  isDeleted: Joi.boolean(),
});

const convertISOStringToLocal = (isoString) => {
  const date = new Date(isoString);
  const localDate = date.toLocaleDateString();
  const localTime = date.toLocaleTimeString();
  return { localDate, localTime };
};

// CCAvenue

// For Encrypting the request sending to the CCAvenue
const EncryptCcavenueRequest = (payload) => {
  // parameter payload should be in string/stringify

  // Function provided by CCAVENUE (Not working)
  // let workingKey = process.env.WORKING_KEY;
  // var m = crypto.createHash("md5");
  // m.update(workingKey);
  // var key = "44 5c b0 ca 98 53 60 1e 90 a7 0e e4 69 ec e0 38";
  // var iv = "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
  // var cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  // var encoded = cipher.update(payload, "utf8", "hex");
  // encoded += cipher.final("hex");
  // return encoded;

  // My algorithm
  let key = process.env.WORKING_KEY; // working_id should be the
  const method = "aes-256-gcm";
  const initVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(method, key, initVector);
  let encrypted = cipher.update(payload, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return initVector.toString("hex") + encrypted + tag;
};

// For decryption of response for API calls the request sending to the CCAvenue
const DecryptCcavenueResponse = (encResp) => {
  // parameter encResp should be in string sent from the the response handeler

  //Function provided by CCAVENUE (Not Working)
  // let workingKey = process.env.WORKING_KEY;
  // var m = crypto.createHash("md5");
  // m.update(workingKey);
  // var key = crypto.randomBytes(16);
  // var iv = "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
  // var decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  // var decoded = decipher.update(encResp, "hex", "utf8");
  // decoded += decipher.final("utf8");
  // return decoded;

  // My Algorithm
  let key = process.env.WORKING_KEY;
  const method = "aes-256-gcm";
  const encryptedTextBuffer = Buffer.from(encResp, "hex");
  const iv_len = 16;
  const tag_length = 16;
  const iv = encryptedTextBuffer.slice(0, iv_len);
  const tag = encryptedTextBuffer.slice(-tag_length);
  const ciphertext = encryptedTextBuffer.slice(iv_len, -tag_length);
  const decipher = crypto.createDecipheriv(method, key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(ciphertext, "binary", "utf8");
  decrypted += decipher.final("utf8");
  let data = qs.parse(decrypted);
  return data;
};

const formatDateTimeHindi = function(date_time) {

  let formatedDate = new Date(date_time);

  const Dateoptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
  };


  const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];


  formatedDate = formatedDate.toLocaleDateString("hi-IN", Dateoptions);

  console.log(formatDateTimeHindi);


  const hindiFormatedDate = formatedDate.replace(/[0-9]/g, (digit) => {
      return hindiDigits[parseInt(digit)];
  });


  return hindiFormatedDate;
}



function getAlgorithm(keyBase64) {
    var key = Buffer.from(keyBase64, 'base64');
    switch (key.length) {
        case 16:
            return 'aes-128-cbc';
        case 32:
            return 'aes-256-cbc';

    }
    throw new Error('Invalid key length: ' + key.length);
}

const encrypt = function(plainText, keyBase64, ivBase64) {

    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    return encrypted;
}

const decrypt = function(messagebase64, keyBase64, ivBase64) {

    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
    let decrypted = decipher.update(messagebase64, 'hex');
    decrypted += decipher.final();
    return decrypted;
}



module.exports = {
  phoneValidator,
  formatPhone,
  emailValidetor,
  comparePassword,
  hashPassword,
  dividerTime,
  getISTTime,
  getGmtTime,
  reviewJoi,
  UpdatereviewJoi,
  convertISOStringToLocal,
  EncryptCcavenueRequest,
  DecryptCcavenueResponse,
  formatDateTimeHindi,
  encrypt,
  decrypt
};
