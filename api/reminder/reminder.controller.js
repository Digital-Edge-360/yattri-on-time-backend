const { Reminder } = require('../../models/Reminder');
const { User } = require('././../../models/User');
const Add_ = (request, response) => {
    let cat = ['train', 'bus', 'flight', 'others'];
    let { category, date_time, title, call_time, number, source, destination, message, user_id } = request.body;
    if (!category || !date_time || !title || !call_time || !number || !source || !destination || !user_id)
        response.status(400).json({ message: "category,date_time,title,call_time,number,source,destination,user_id requied" });
    else if (!cat.includes(category))
        response.status(400).json({ message: "invalid category" });
    else {
        User.findById(user_id).then((data) => {
            if (data == null)
                response.status(400).json({ message: "invalid id" });
            //validate valid subscription

            //end logic
            else if (data.reminder == 0) {
                // console.log(data)
                response.status(400).json({ message: "no valid subscription found this user" });
            }

            else {
                let reminder = new Reminder();
                reminder.category = category;
                reminder.date_time = new Date(date_time);
                reminder.title = title;
                reminder.call_time = new Date(call_time);
                reminder.number = number;
                reminder.source = source;
                reminder.destination = destination;
                reminder.message = message ? message : null;
                reminder.user_id = user_id;
                data.reminder = data.reminder - 1;
                data.save(); 
                reminder.save();
                response.status(201).json({ message: "data saved", data: reminder });
            }
        }).catch((err) => {
            response.status(500).json({ message: "internal server error" });
        })

    }

};


const Update_ = (request, response) => {
    Reminder.findById(request.params.id).then((data) => {
        if (data == null)
            response.status(400).json({ message: "invalid id" });
        else {
            let cat = ['train', 'bus', 'flight', 'others']
            let { category, date_time, title, call_time, number, source, destination, message, user_id } = request.body;
            if (category) {
                if (!cat.includes(category)) return response.status(400).json({ message: "invalid category" })
                data.category = category;
            }
            if (date_time) {
                data.date_time = new Date(date_time);
            }
            if (title) {
                data.title = title;
            }
            if (call_time) {
                data.call_time = new Date(call_time);
            }
            if (number) {
                data.number = number;
            }
            if (source) {
                data.source = source;
            }
            if (destination) {
                data.destination = destination;
            }
            if (message) {
                data.message = message;
            }
            if (user_id) {
                data.user_id = user_id;
            }
            data.save();
            response.status(200).json({ message: "data Updated", data: data });
        }
    }
    ).catch((err) => { response.status(400).json({ message: "invalid id" }); });
};



const Find_ = (request, response) => {
    Reminder.findById(request.params.id).then((data) => {
        if (data == null)
            response.status(400).json({ message: "invalid id" });
        else
            response.status(200).json(data);
    }
    ).catch((err) => { response.status(400).json({ message: "invalid id" }); });
};

//FindUser_

const FindUser_ = (request, response) => {
    Reminder.find({ user_id: request.params.id }).then((data) => {
        if (data == null)
            response.status(400).json({ message: "invalid id" });
        else
            response.status(200).json(data);
    }
    ).catch((err) => { response.status(400).json({ message: "invalid id" }); });
};

const FindAll_ = (request, response) => {
    Reminder.find().then((data) => {
        if (data.length == 0)
            response.status(404).json({ message: "no data found" });
        else
            response.status(200).json(data);
    }).catch((err) => { response.status(500).json({ message: "internal server error" }); })
};


const Remove_ = (request, response) => {
    Reminder.findByIdAndDelete(request.params.id).then((data) => {
        // console.log(data);
        if (data == null)
            response.status(400).json({ message: "invalid id" });
        else if (data.status === true) {
            User.findOne({ _id: data.user_id }).then((userData) => {
                // console.log(userData);
                userData.reminder += 1;
                userData.save()
                return response.status(200).json({message:"reminder set"})
            })
        }
        else
            response.status(202).json({ message: "data removed" });
    }).catch((err) => { response.status(400).json({ message: "invalid id" }); })
};


module.exports = { Find_, FindAll_, Add_, Update_, Remove_, FindUser_ };