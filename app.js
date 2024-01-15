require("dotenv").config();

/********************************************
 * Import All The Package From Node Modules
 ********************************************/
const express = require("express");
const https = require(`https`);
const fs = require(`fs`);
const path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

app.use(cors());

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
// Setting content security policy to connect with ccAvenue
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      //Inline Script with this nonce will be executed only
      scriptSrc: ["'self'", "'nonce-d6b1f0544e8fe8c38d66017d6d0079d5'"],
      formAction: [
        "'self'",
        "https://test.ccavenue.com",
        "https://secure.ccavenue.com",
        "http://ec2-52-207-129-114.compute-1.amazonaws.com:3100/api/payment/ccavRequest",
        "https://ec2-52-207-129-114.compute-1.amazonaws.com:3100/api/payment/ccavRequest",
      ],
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

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
const ReviewRouter = require("./api/review/review.route");
const RemindRouter = require("./api/remind/remind.route");
const PaymentRouter = require("./api/payment/payment.route");
const ProductRouter = require("./api/product/product.route");
const AddressRouter = require("./api/address/address.route");
const OrderRouter = require("./api/order/order.route");
const CartRouter = require("./api/cart/cart.route");
process.env.TZ = process.env.TZ;

const connectDB = require("./db/connect.js");

/**Create Object Of Express */

/********************************************************
 * Apply All The Basic Middileware To Handle The Request
 * ******************************************************/
// cors
// morgan
app.use(morgan("dev"));
// host images
app.use(express.static(path.join(__dirname, "uploads")));
//To parse files
// app.use(fileUpload());
//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));
//To parse json data
app.use(bodyParser.json());
//To Parse Cookies
app.use(cookieParser());
//To Serve All The Static Files From Data Folder
app.use("/files", express.static(path.join(__dirname, "data")));

// Setting views
app.use(express.static("public"));
app.set("views", __dirname + "/public");
app.engine("html", require("ejs").renderFile);

/****************************
 * Define All The Api Routes
 ****************************/
app.use("/api/user", UserRouter);
app.use("/api/advertisement", AdvertisementRouter);
app.use("/api/contact", ContactRouter);
app.use("/api/reminder", ReminderRouter);
app.use("/api/subscription", SubscriptionRouter);

// separating Transaction logic from payment
//app.use("/api/payment", TransactionRouter);
app.use("/api/transaction", TransactionRouter);

app.use("/api/subscribe", SubscribeRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/faq", FaqRouter);
app.use("/api/review", ReviewRouter);
// app.use("/files/voices", RemindRouter);
app.use("/api/remind", RemindRouter);
app.use("/api/payment", PaymentRouter);
app.use("/api/product", ProductRouter);
app.use("/api/address", AddressRouter);
app.use("/api/order", OrderRouter);
app.use("/api/cart", CartRouter);
app.get("/", (req, res) => {
  res.send("Api is Working!");
});

// Rendering this temporarily to request ccAvenue server
app.get("/paymentForm", function (req, res) {
  res.render("dataFrom.html", {
    // Programatically setting the URL
    PaymentBaseURL: `${req.protocol}://${req.get("host")}/api/payment`,
  });
});

app.all("*", (req, res) => {
  res.status(404).send("Sorry, this is an invalid URL.");
});

// Schedules
const checkReminders = require("./schedules/checkReminders.js");
checkReminders(1); //checks in every 59 minutes.

// const deleteReminders = require("./schedules/deleteReminders.js");
// deleteReminders(1);

const PORT = process.env.PORT || 3100;

// const encrypted = EncryptCcavenueRequest("Hello World");

// console.log(encrypted);

// DecryptCcavenueResponse(encrypted);

// Server config
const config = {
  port: 443,
  port2: 3100,
  httpsOptions: {
    key: fs.readFileSync("client-key.pem"),
    cert: fs.readFileSync("client-cert.pem"),
  },
};

const httpsServer = https.createServer(config.httpsOptions, app);
const httpsServer2 = https.createServer(config.httpsOptions, app);

// Start HTTPS servers
httpsServer.listen(config.port, () => {
  console.log(`HTTPS server running on port ${config.port}`);
});

httpsServer2.listen(config.port2, () => {
  console.log(`HTTPS server running on port ${config.port2}`);
});
// app.listen(PORT, () => {
//   connectDB(process.env.MONGO_DB_URL);
//   console.log(`Api Running on port ${PORT}`);
// });
