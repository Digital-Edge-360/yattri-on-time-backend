const router = require("express").Router();
const { validateTocken } = require("../../auth/tokenValidator");
const {
    Find_,
    FindAll_,
    Add_,
    Update_,
    Remove_,
} = require("./advertise.controller");
const adminOnly = require("../../middleware/adminOnly.middleware");
router.get("/:id", Find_);
router.get("/", FindAll_);
router.post("/", validateTocken, adminOnly, Add_);
router.patch("/:id", validateTocken, adminOnly, Update_);
router.delete("/:id", validateTocken, adminOnly, Remove_);

/*To handle all invalid request */

router.all("*", (request, response) => {
    response.status(500).json({ message: "invalid request" });
});

module.exports = router;
