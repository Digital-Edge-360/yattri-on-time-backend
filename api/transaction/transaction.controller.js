const { Transaction } = require('../../models/Transaction');
const { User } = require('../../models/User');
const Add_ = (request, response) => {
    let {payment_id,amount,user_id,status,remarks}=request.body;
    if(!payment_id || !amount || !user_id || status==undefined || amount <0)
    response.status(400).json({message:"payment_id,amount,user_id,status is requied"});
    else{
        User.findById(user_id).then((user)=>{
            if(user==null)
            response.status(400).json({message:"invalid user id"});
            else{
                let transaction=new Transaction();
                transaction.payment_id=payment_id;
                transaction.amount=amount;
                transaction.user_id=user_id;
                transaction.status=status;
                transaction.remarks=remarks?remarks:null;
                if(transaction.status=='success')
                user.balance=parseFloat(user.balance)+parseFloat(amount);
                try{
                    transaction.save();
                    user.save();
                    response.status(201).json({ message: "data saved", data:transaction  });
                }
                catch(err){
                    response.status(500).json({message:"internal server error"});
                }

            }
        }).catch((err)=>{response.status(400).json({message:"invalid user id"});})
    }  
};


const Update_ = (request, response) => {
    response.status(403).json({message:"request not allowed"});
};



const Find_ = (request, response) => {
    Transaction.findById(request.params.id).then((data) => {
        if (data == null)
        response.status(400).json({message:"invalid id"});
        else
        response.status(200).json(data);
    }
    ).catch((err) => {  response.status(400).json({message:"invalid id"}); });
};



const FindAll_ = (request, response) => {
    Transaction.find().then((data) => {
        if (data.length == 0)
        response.status(404).json({message:"no data found"});
    else
        response.status(200).json(data);

    }).catch((err) => { response.status(500).json({message:"internal server error"}); })
};


const Remove_ = (request, response) => {
    Transaction.findByIdAndDelete(request.params.id).then((data) => {
        if (data == null)
        response.status(400).json({message:"invalid id"});
        else
        response.status(202).json({ message: "data removed"});
    }).catch((err) => { response.json(err) })
};


module.exports = { Find_, FindAll_, Add_, Update_, Remove_ };