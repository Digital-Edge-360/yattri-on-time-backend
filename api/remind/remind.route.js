const router = require("express").Router();
const { SendVoice,sendReminder } = require('./remind.controller.js');


router.post("/files/voices:id", SendVoice);

// This ID should be remainder ID 
router.post("/" ,sendReminder);


/*To handle all invalid request */
router.all("*", (request, response) => {
       response.status(500).json({ status: "failed", message: "invalid request" });
});

module.exports = router;