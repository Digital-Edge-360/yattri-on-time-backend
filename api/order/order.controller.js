const { Order } = require("../../models/Order");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders || orders.length == 0) {
      return res.status(404).json({ message: "No orders to show" });
    }

    return res.status(200).json({ data: orders });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.data._id });

    if (!orders || orders.length == 0) {
      return res.status(404).json({ message: "No orders to show" });
    }
    return res.status(200).json({ data: orders });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) return res.status(404).json({ message: "No order found" });
    order.status = req.body.status;
    await order.save();
    return res.status(201).json({ data: order });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) return res.status(404).json({ message: "No order found" });
    await Order.findOneAndDelete({ _id: order._id });
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    return res.status(201).json({ data: order });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
  createOrder,
};
