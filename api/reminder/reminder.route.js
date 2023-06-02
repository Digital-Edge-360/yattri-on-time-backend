const router = require("express").Router();
const { validateTocken } = require('../../auth/tokenValidator');

const { Find_, FindAll_, Add_, Update_, Remove_, FindUser_, Add_Single_Reminder } = require('./reminder.controller');
router.get("/:id", validateTocken, Find_);
router.get("/",  FindAll_);
router.get("/user/:id", validateTocken, FindUser_);
router.post("/", validateTocken, Add_);
router.patch("/:id", validateTocken, Update_);
router.delete("/:id", validateTocken, Remove_);
router.post("/single-reminder", validateTocken, Add_Single_Reminder);

/*To handle all invalid request */
router.all("*", (request, response) => {
       response.status(500).json({ status: "failed", message: "invalid request" });
});

module.exports = router;