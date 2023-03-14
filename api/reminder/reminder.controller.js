const { Reminder } = require('../../models/Reminder');
const{User}=require('././../../models/User');
const Add_ = (request, response) => {
    let cat=['train','bus','flight','others'];
    let {category,date_time,title,call_time,number,source,destination,message,user_id}=request.body;
    if(!category || !date_time || !title ||!call_time ||!number || !source || !destination || !user_id )
    response.status(400).json({message:"category,date_time,title,call_time,number,source,destination,user_id requied"});
    else if(!cat.includes(category))
    response.status(400).json({message:"invalid category"});
    else{
        User.findById(user_id).then((data)=>{
        if(data==null)
        response.status(400).json({message:"invalid id"});
        //validate valid subscription

        //end logic
        else if(data.reminder==0){
            console.log(data)
            response.status(400).json({message:"no valid subscription found this user"});
        }
       
        else{
            let reminder = new Reminder();
            reminder.category=category;
            reminder.date_time=new Date(date_time);
            reminder.title=title;
            reminder.call_time=new Date(call_time);
            reminder.number=number;
            reminder.source=source;
            reminder.destination=destination;
            reminder.message=message?message:null;
            reminder.user_id=user_id;
            data.reminder=data.reminder-1;
            data.save();
            reminder.save();
            response.status(201).json({ message: "data saved", data: reminder });
        }
        }).catch((err)=>{
            response.status(500).json({message:"internal server error"});
        })
       
    }
      
    }; 
    
    
    const Update_ = (request, response) => {
        Reminder.findById(request.params.id).then((data) => {
            if (data == null)
                 response.status(400).json({message:"invalid id"});
            else
                {
                    let {email_or_phone,message,status}=request.body;
                    if(email_or_phone && data.email_or_phone!=email_or_phone)
                    data.email_or_phone=email_or_phone;
                    if(message && data.message!=message)
                    data.message=message;
                    if(status!=undefined && data.status!=status)
                    data.status=status;
                    data.save();
                    response.status(204).json({message:"data Updated"});
                }
        }
        ).catch((err) => { response.status(400).json({message:"invalid id"}); });
    };



const Find_ = (request, response) => {
    Reminder.findById(request.params.id).then((data) => {
        if (data == null)
        response.status(400).json({message:"invalid id"});
        else
        response.status(200).json(data);
    }
    ).catch((err) => { response.status(400).json({message:"invalid id"}); });
};

//FindUser_

const FindUser_ = (request, response) => {
    Reminder.find({user_id:request.params.id}).then((data) => {
        if (data == null)
        response.status(400).json({message:"invalid id"});
        else
        response.status(200).json(data);
    }
    ).catch((err) => { response.status(400).json({message:"invalid id"}); });
};

const FindAll_ = (request, response) => {
    Reminder.find().then((data) => {
        if (data.length == 0)
            response.status(404).json({message:"no data found"});
        else
            response.status(200).json(data);
    }).catch((err) => { response.status(500).json({message:"internal server error"}); })
};


const Remove_ = (request, response) => {
    Reminder.findByIdAndDelete(request.params.id).then((data) => {
        if (data == null)
        response.status(400).json({message:"invalid id"});
        else if(data.status===true){
        User.findOneAndUpdate({_id:data.user_id}).then((userData)=>{
            userData.reminder+=1;
        })
        }
        else
        response.status(202).json({ message: "data removed"});
    }).catch((err) => { response.status(400).json({message:"invalid id"});})
};


module.exports = { Find_, FindAll_, Add_, Update_, Remove_ ,FindUser_};