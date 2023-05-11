const router = require("express").Router();
const { SendVoice } = require('./remind.controller.js');

router.post("/:id", SendVoice);

/*To handle all invalid request */
router.all("*", (request, response) => {
       response.status(500).json({ status: "failed", message: "invalid request" });
});

module.exports = router;