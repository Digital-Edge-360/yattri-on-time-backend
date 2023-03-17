const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscribeSchema = new Schema({
    subcription_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        default: new Date(),
    },
    expire_date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    no_of_reminder: {
        type: Number,
        default: 99999999,
    },
    transaction_id: {
        type: String,
        default: true,
    },
});

const Subscribe = mongoose.model("Subscribe", SubscribeSchema);
module.exports = { Subscribe };
