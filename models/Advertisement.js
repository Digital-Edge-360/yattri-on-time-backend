const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdvertisementSchema = new Schema({
    title: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },

    description:{
        type: String,
        
    },

    description2:{
        type: String,
       
    },

    cta_text:{
        type:String
    },

    status: Boolean,
});

const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);
module.exports = { Advertisement };
