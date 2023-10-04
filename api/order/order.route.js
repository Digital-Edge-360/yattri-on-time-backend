const { validateTocken } = require("../../auth/tokenValidator");
const adminOnly = require("../../middleware/adminOnly.middleware");
const {
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
  createOrder,
} = require("./order.controller");
const router = require("express").Router();

router.post("/", createOrder);
router.get("/all", validateTocken, adminOnly, getAllOrders);
router.get("/", validateTocken, getOrdersByUser);
router.patch("/:id", validateTocken, adminOnly, updateOrderStatus);
router.delete("/:id", validateTocken, adminOnly, deleteOrder);

router.all("*", (request, response) => {
  response.status(500).json({ message: "invalid request" });
});

module.exports = router;
