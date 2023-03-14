const {Admin}=require('../../models/Admin');
const {hashPassword,comparePassword}=require('../../util/helpers.js');
const jwt=require('jsonwebtoken');

const adminLogin_=async (req,res)=>{
    try {        
        const {email,password}=req.body;
        if(!email ||!password){
            return res.status(400).json({message:'Please provide email and password'});
        }
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(404).json({message:'Admin does not exist'});
        }
        const isMatch=await comparePassword(password,admin.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid password'});
        }
        const adminPayload={
            email:admin.email,
            isAdmin:admin.isAdmin
        }
        const token = jwt.sign(adminPayload, process.env.JWT_SECRET,{ expiresIn: '30d' }); 
        res.status(200).json({ message:"admin logged in",token,info:adminPayload});        

    } catch (error) {
          return res.status(404).json({message:"User Not Found"});
    }
}

const adminRegister_=async (req,res)=>{
try {    
    const {email,password}=req.body;
    if(!email ||!password){
        return res.status(400).json({message:'Please provide email and password'});
    }

    const isAdmin=await Admin.findOne({email});
    if(isAdmin){
        return res.status(409).json({message:'User Already Exists'});
    }
    const hashedPassword= await hashPassword(password);
    const admin=await Admin.create({email,password:hashedPassword});
    const adminPayload={
        email:admin.email,
        isAdmin:admin.isAdmin
      }
      const token = jwt.sign(adminPayload, process.env.JWT_SECRET,{ expiresIn: '30d' }); 
    return  res.status(200).json({ message:"admin registered successfully",token,info:adminPayload});

} catch (error) {
    return res.status(500).json({message:"Something went wrong"});
}  
}


module.exports={
    adminLogin_,
    adminRegister_
}