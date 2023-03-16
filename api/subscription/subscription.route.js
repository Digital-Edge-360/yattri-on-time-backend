const router=require("express").Router();
const {validateTocken}=require('../../auth/tokenValidator');
const {Find_, FindAll_, Add_, Update_, Remove_ }=require('./subscription.controller');
const adminOnly = require("../../middleware/adminOnly.middleware")
router.post("/",validateTocken,adminOnly,Add_);
router.get("/:id",validateTocken,adminOnly,Find_);
router.get("/",validateTocken,adminOnly,FindAll_);
router.patch("/:id",validateTocken,adminOnly,Update_);
router.delete("/:id",validateTocken,adminOnly,Remove_);

 /*To handle all invalid request */  
 router.all("*",(request,response)=>{
        response.status(500).json({ status:"failed", message:"invalid request" }); 
       });  

module.exports=router;