const {verify}=require('jsonwebtoken');
module.exports={
    validateTocken:(req,res,next)=>{
        let token=req.get('authorization');
        if(token){
            token=token.slice(7);
            verify(token,process.env.JWT_SECRET,(err,obj)=>{
                if(err){
                    if(err.message=='jwt expired')
                    res.status(400).json({ message: "token expired"});
                    else 
                    res.status(400).json({ message: "invalid token"});
                }
                else{
                    req.user=obj;
                    next();
                }
            }) 
        }
        else{
            res.status(400).json({ message: "access denied" });
        }
    }
}