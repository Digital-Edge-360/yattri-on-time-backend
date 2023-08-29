const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdvertisementSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    image: {
        type: String,
        // required: true,
        default:"fsenfos"
    },
    url: {
        type: String,
        required: true,
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
