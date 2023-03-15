const express=require('express');
const router=express.Router();
const {validateTocken}=require('../../auth/tokenValidator');
const {FAQCreate_, FAQUpadte_, FAQRemove_,FAQRead_,FAQToggleInActive } = require("./faq.controller")

router.route('/').get(validateTocken,FAQRead_).post(validateTocken,FAQCreate_)
router.route('/:id').patch(validateTocken,FAQUpadte_).delete(validateTocken,FAQRemove_)
router.route('/toogle/:id').patch(validateTocken,FAQToggleInActive)

 /*To handle all invalid request */  
 router.all("*",(request,response)=>{
    response.status(500).json({ status:"failed", message:"invalid request" }); 
   }); 
module.exports=router;