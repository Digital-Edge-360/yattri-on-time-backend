const { ContactQuery } = require('../../models/ContactQuery');

const Add_ = (request, response) => {
    let { email_or_phone, message } = request.body;
    if (!email_or_phone || !message)
    response.status(400).json({message:"email_or_phone,message requied"});
    else {
        let contact = new ContactQuery();
        contact.email_or_phone = email_or_phone;
        contact.message = message;
        contact.save();
        response.status(201).json({ message: "data saved", data:contact  });
    }

};


const Update_ = (request, response) => {
    ContactQuery.findById(request.params.id).then((data) => {
        if (data == null)
             response.status(400).json({message:"invalid id"});
        else {
            let { email_or_phone, message, status } = request.body;
            if (email_or_phone && data.email_or_phone != email_or_phone)
                data.email_or_phone = email_or_phone;
            if (message && data.message != message)
                data.message = message;
            if (status != undefined && data.status != status)
                data.status = status;
            data.save();
            response.status(204).json({message:"data Updated"});
        }
    }
    ).catch((err) => { response.status(500).json({message:"internal server error"}) });
};



const Find_ = (request, response) => {
    ContactQuery.findById(request.params.id).then((data) => {
        if (data == null)
            response.status(400).json({message:"invalid id"});
        else
             response.status(200).json(data);
    }
    ).catch((err) => { response.status(400).json({message:"invalid id"}); });
};



const FindAll_ = (request, response) => {
    ContactQuery.find().then((data) => {
        if (data.length == 0)
            response.status(404).json({ message: "no data found" });
        else
            response.status(200).json(data)
    }).catch((err) => { response.status(500).json({message:"internal server error"}) })
};


const Remove_ = (request, response) => {
    ContactQuery.findByIdAndDelete(request.params.id).then((data) => {
        if (data == null)
        response.status(400).json({message:"invalid id"});
        else
        response.status(202).json({ message: "data removed"})
    }).catch((err) => { response.json(err) })
};


module.exports = { Find_, FindAll_, Add_, Update_, Remove_ };