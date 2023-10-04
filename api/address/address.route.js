const { validateTocken } = require("../../auth/tokenValidator");
const {
  getAddress,
  addAddress,
  editAddress,
  deleteAddress,
} = require("./address.controller");

const router = require("express").Router();

router.get("/", validateTocken, getAddress);
router.post("/", validateTocken, addAddress);
router.patch("/:id", validateTocken, editAddress);
router.delete("/:id", validateTocken, deleteAddress);

router.all("*", (request, response) => {
  response.status(500).json({ message: "invalid request" });
});

module.exports = router;
