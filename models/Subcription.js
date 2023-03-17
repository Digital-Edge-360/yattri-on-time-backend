const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubcriptionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    validity: {
        //days
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    compare_price: {
        type: Number,
        required: true,
        min: 0,
    },
    no_of_reminder: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

let Subcription = mongoose.model("Subcription", SubcriptionSchema);
module.exports = { Subcription };
