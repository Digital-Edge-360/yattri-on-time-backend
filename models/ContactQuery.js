const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactQuerySchema = new Schema({
    email_or_phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    status: {
        type: Boolean,
        default: false,
    },
});

const ContactQuery = mongoose.model("ContactQuery", ContactQuerySchema);
module.exports = { ContactQuery };
