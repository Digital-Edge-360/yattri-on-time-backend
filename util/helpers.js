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
  let key = process.env.WORKING_KEY; // your working_key provided by bank

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
};
