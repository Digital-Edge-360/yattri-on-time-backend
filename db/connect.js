const mongoose = require("mongoose");

async function connectDB(uri) {
    try {
        await mongoose.connect(uri);
        console.log("Connected to DB");
    } catch (error) {
        console.log("Can't connect to DB");
    }
}

module.exports = connectDB;
