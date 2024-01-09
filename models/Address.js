const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Address must have a name"],
  },
  house_no: {
    type: String,
    required: [true, "Address must have a house number"],
  },

  address_line1: {
    type: String,
    required: [true, "Address must have a address line 1"],
  },

  address_line2: {
    type: String,
    required: [true, "Address must have a address line 2"],
  },

  landmark: {
    type: String,
    required: [true, "Address must have a landmark"],
  },
  pincode: {
    type: Number,
    required: [true, "Address must have a pincode"],
  },

  saveAs: {
    type: String,
    required: [true, "Address must have a saveAs"],
  },
});

const Address = mongoose.model("Address", AddressSchema);

module.exports = { Address };
