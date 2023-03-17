const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = { Admin };
