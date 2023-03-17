var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReminderSchema = new Schema({
    category: {
        type: String,
        enum: ["train", "bus", "flight", "others"],
        required: true,
    },
    date_time: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    call_time: {
        type: Date,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const Reminder = mongoose.model("Reminder", ReminderSchema);
module.exports = { Reminder };
