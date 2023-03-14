const express=require('express');
const router=express.Router();
const {adminLogin_,adminRegister_}=require('./admin.controller');

router.route('/login').post(adminLogin_)
router.route('/register').post(adminRegister_)

module.exports=router;