const router = require("express").Router();
const { validateTocken } = require('../../auth/tokenValidator');
const { Find_, FindAll_, Add_, Update_, Remove_ } = require('./subscribe.controller');
router.get("/:id", validateTocken, Find_);
router.get("/", validateTocken, FindAll_);
router.post("/", validateTocken, Add_);
router.put("/:id", validateTocken, Update_);
router.delete("/:id", validateTocken, Remove_);

/*To handle all invalid request */
router.all("*", (request, response) => {
       response.status(500).json({ status: "failed", message: "invalid request" });
});

module.exports = router;