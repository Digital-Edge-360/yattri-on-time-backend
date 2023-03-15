const router=require("express").Router();
const {validateTocken}=require('../../auth/tokenValidator');
const {Find_, FindAll_, Add_, Update_, Remove_ ,Login_,Register_,SendOtp_}=require('./user.controller');
router.get("/:id",validateTocken,Find_);
router.get("/",validateTocken,FindAll_);
router.post("/",Add_);
router.patch("/:id",Update_);
router.delete("/:id",validateTocken,Remove_);
router.post("/login",Login_);
router.post("/register",Register_);
router.post("/otp",SendOtp_);
 /*To handle all invalid request */  
 router.all("*",(request,response)=>{
        response.status(500).json({ status:"failed", message:"invalid request" }); 
       });  

module.exports=router;