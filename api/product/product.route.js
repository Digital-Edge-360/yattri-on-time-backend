const multer = require("multer");
const { validateTocken } = require("../../auth/tokenValidator");
const adminOnly = require("../../middleware/adminOnly.middleware");
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("./product.controller");
const upload = multer({ dest: "uploads/" });
const router = require("express").Router();

router.get("/", getAllProducts);
router.post("/", validateTocken, adminOnly, upload.single("image"), addProduct);
router.get("/:id", getProduct);
router.patch(
  "/:id",
  validateTocken,
  adminOnly,
  upload.single("image"),
  updateProduct
);
router.delete("/:id", validateTocken, adminOnly, deleteProduct);
router.all("*", (request, response) => {
  response.status(500).json({ message: "invalid request" });
});

module.exports = router;
