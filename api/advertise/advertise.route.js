const router = require("express").Router();
const { validateTocken } = require('../../auth/tokenValidator');
const { Find_, FindAll_, Add_, Update_, Remove_ } = require('./advertise.controller');
const adminOnly = require("../../middleware/adminOnly.middleware")
router.get("/:id", validateTocken, adminOnly, Find_);
router.get("/", adminOnly, FindAll_);
router.post("/", adminOnly, validateTocken, Add_);
router.patch("/:id", adminOnly, validateTocken, Update_);
router.delete("/:id", adminOnly, validateTocken, Remove_);

/*To handle all invalid request */

router.all("*", (request, response) => { response.status(500).json({ message: "invalid request" }); });

module.exports = router;