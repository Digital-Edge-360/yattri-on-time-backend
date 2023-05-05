const router = require("express").Router();
const { validateTocken } = require("../../auth/tokenValidator");
const adminOnly = require("../../middleware/adminOnly.middleware");
const { Add_, Findall_, Update_, Delete_ } = require("./review.controller");

router.post("/", validateTocken, Add_);
router.get("/", validateTocken, Findall_);
router.patch("/:id", validateTocken, adminOnly, Update_);
router.delete("/:id", validateTocken, adminOnly, Delete_);
/*To handle all invalid request */
router.all("*", (request, response) => {
    response.status(500).json({ status: "failed", message: "invalid request" });
});
module.exports = router;
