const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: "avatar.png",
    },
    status: {
        type: Boolean,
        default: false,
    },
    validSubscription: {
        type: String,
        default: "No Subscription",
    },
    registerd_at: {
        type: Date,
        default: new Date(),
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,
    },
    reminder: {
        type: Number,
        default: 0,
        min: 0,
    },
});

const User = mongoose.model("User", UserSchema);
module.exports = { User, UserSchema };
