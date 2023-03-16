require("dotenv").config();

/********************************************
 * Import All The Package From Node Modules
 ********************************************/
const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");

/*************************************
 * Exports All The Routers From Api
 *************************************/
const UserRouter = require("./api/user/user.route");
const AdvertisementRouter = require("./api/advertise/advertise.route");
const ContactRouter = require("./api/contact/contact.route");
const ReminderRouter = require("./api/reminder/reminder.route");
const SubscriptionRouter = require("./api/subscription/subscription.route");
const TransactionRouter = require("./api/transaction/transaction.route");
const SubscribeRouter = require("./api/subscribe/subscribe.route");
const AdminRouter = require("./api/admin/admin.route");
const FaqRouter = require("./api/faq/faq.route");

/**Create Object Of Express */
const app = express();

/********************************************************
 * Apply All The Basic Middileware To Handle The Request
 * ******************************************************/

// cors
app.use(cors());
// morgan
app.use(morgan("dev"));
//To parse files
app.use(fileUpload());
//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));
//To parse json data
app.use(bodyParser.json());
//To Parse Cookies
app.use(cookieParser());
//To Serve All The Static Files From Data Folder
app.use("/files", express.static(path.join(__dirname, "data")));

/****************************
 * Define All The Api Routes
 ****************************/
app.use("/api/user", UserRouter);
app.use("/api/advertisement", AdvertisementRouter);
app.use("/api/contact", ContactRouter);
app.use("/api/reminder", ReminderRouter);
app.use("/api/subscription", SubscriptionRouter);
app.use("/api/payment", TransactionRouter);
app.use("/api/subscribe", SubscribeRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/faq", FaqRouter);
app.get("/", (req, res) => {
    res.send("Api Working!");
});

app.all("*", (req, res) => {
    res.send("Sorry, this is an invalid URL.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Api Running on port ${PORT}`);
});

// setInterval(() => {
//     console.log('hey')
// }, 60000);
