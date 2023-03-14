require('dotenv').config();

/********************************************
 * Import All The Package From Node Modules
 ********************************************/
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

/*************************************
 * Exports All The Routers From Api
 *************************************/
const UserRouter = require('./api/user/user.route');
const AdvertisementRouter = require('./api/advertise/advertise.route');
const ContactRouter = require('./api/contact/contact.route');
const ReminderRouter = require('./api/reminder/reminder.route');
const SubscriptionRouter = require('./api/subscription/subscription.route');
const TransactionRouter = require('./api/transaction/transaction.route');
const SubscribeRouter = require('./api/subscribe/subscribe.route');

/**Create Object Of Express */
const app = express();

/********************************************************
 * Apply All The Basic Middileware To Handle The Request 
 * ******************************************************/


//To parse files
app.use(fileUpload());
//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));
//To parse json data
app.use(bodyParser.json());
//To Parse Cookies
app.use(cookieParser());
//To Serve All The Static Files From Data Folder
app.use('/files', express.static(path.join(__dirname, 'data')))

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




app.get('/', (req, res) => {
    res.send('Api Working!')
});


app.get('*', (req, res) => {
    res.send('Sorry, this is an invalid URL.');
});;


app.listen(process.env.SERVER_PORT, () => {
    console.log(`Api Running on port ${process.env.SERVER_PORT}`)
})

// setInterval(() => {
//     console.log('hey')
// }, 60000);