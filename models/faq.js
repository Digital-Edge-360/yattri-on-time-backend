const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FAQSchema = new Schema({
    subject: { type: String, required: true },
    body: { type: String, required: true },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const FAQ = mongoose.model("FAQ", FAQSchema);
module.exports = { FAQ };
