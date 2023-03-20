const router = require("express").Router();
const { validateTocken } = require('../../auth/tokenValidator');

const {Add_,Findall_} = require('./review.controller')


router.post('/', validateTocken, Add_)
router.get('/', validateTocken, Findall_)
/*To handle all invalid request */
router.all("*", (request, response) => {
    response.status(500).json({ status: "failed", message: "invalid request" });
});
module.exports = router;