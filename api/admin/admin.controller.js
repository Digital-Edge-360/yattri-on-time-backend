const {Admin}=require('../../models/Admin');
const {hashPassword,comparePassword}=require('../../util/helpers.js');
const jwt=require('jsonwebtoken');

const adminLogin_=async (req,res)=>{
    try {        
        const {email,password}=req.body;
        if(!email ||!password){
            return res.status(400).json({message:'please provide email and password'});
        }
        const admin=await Admin.findOne({email});
        if(!admin){
            return res.status(404).json({message:'admin does not exist'});
        }
        const isMatch=await comparePassword(password,admin.password);
        if(!isMatch){
            return res.status(400).json({message:'invalid password'});
        }
        const adminPayload={
            userId:admin._id,
            email:admin.email,
            isAdmin:admin.isAdmin
        }
        const token = jwt.sign(adminPayload, process.env.JWT_SECRET,{ expiresIn: '30d' }); 
        res.status(200).json({ message:"admin logged in",token,info:adminPayload});        

    } catch (error) {
          return res.status(404).json({message:"user Not Found"});
    }
}

const adminRegister_=async (req,res)=>{
try {    
    const {email,password}=req.body;
    if(!email ||!password){
        return res.status(400).json({message:'please provide email and password'});
    }

    const isAdmin=await Admin.findOne({email});
    if(isAdmin){
        return res.status(409).json({message:'user already exists'});
    }
    const hashedPassword= await hashPassword(password);
    const admin=await Admin.create({email,password:hashedPassword});
    const adminPayload={
        userId:admin._id,
        email:admin.email,
        isAdmin:admin.isAdmin
      }
      const token = jwt.sign(adminPayload, process.env.JWT_SECRET,{ expiresIn: '30d' }); 
    return  res.status(200).json({ message:"admin registered successfully",token,info:adminPayload});

} catch (error) {
    return res.status(500).json({message:"something went wrong"});
}  
}


const showAdmin_ = (req,res) =>{
    res.status(200).json(req.user);
}

module.exports={
    adminLogin_,
    adminRegister_,
    showAdmin_
}