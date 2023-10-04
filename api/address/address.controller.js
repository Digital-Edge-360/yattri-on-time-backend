const { Address } = require("../../models/Address");
const { User } = require("../../models/User");

const addAddress = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.data._id });

    if (!user) return res.status(404).json({ message: "No user found" });

    const address = await Address.create({ ...req.body, user: user._id });
    return res.status(201).json({ data: address });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const editAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id });

    if (!address) return res.status(404).json({ message: "No address found" });

    if (address.user != req.user.data._id)
      return res.status(400).json({ message: "You cannot edit this address" });

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    return res.status(201).json({ data: updatedAddress });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getAddress = async (req, res) => {
  try {
    const address = await Address.find({ user: req.user.data._id });

    if (!address || address.length == 0)
      return res.status(404).json({
        message: "No address found please add an address to continue",
      });

    return res.status(200).json({ data: address });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id });

    if (!address) return res.status(404).json({ message: "No address found" });

    if (address.user != req.user.data._id)
      return res.status(400).json({ message: "You cannot edit this address" });

    await Address.findOneAndDelete({ _id: req.params.id });

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addAddress,
  editAddress,
  getAddress,
  deleteAddress,
};
