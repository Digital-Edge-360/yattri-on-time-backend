const { Reminder } = require("../../models/Reminder");
const { User } = require("././../../models/User");
const { dividerTime, getISTTime, getGmtTime, convertISOStringToLocal } = require("../../util/helpers.js");
const moment = require("moment");
const { Transaction } = require("../../models/Transaction");
const Add_ = (request, response) => {
    const user_id = request.user.data._id;
    if (!user_id) {
        response.status(400).json({
            message: "user id is required",
        });
    }
    let cat = ["train", "bus", "flight", "others"];
    let {
        category,
        date_time,
        title,
        call_time,
        number,
        source,
        destination,
        message,
        frequency,
    } = request.body;
    let times;
    if (date_time && call_time && frequency) {
        // check if call time & event time are greater than current
        const eventTime = new Date(date_time);
        const callTime = new Date(call_time);
        const currentTime = new Date(Date.now())
        console.log({eventTime, callTime, currentTime});

        if (callTime < currentTime || eventTime < currentTime) {
            return response.status(499).json({
                message:
                    "Event time and call time should be greater than current time",
            });
        }
        times = dividerTime(date_time, call_time, frequency);
    } else {
        return response.status(400).json({
            message: "Event time, call time and frequency is required",
        });
    }

    if (
        !category ||
        !date_time ||
        !title ||
        !call_time ||
        !number ||
        !source ||
        !destination ||
        !user_id
    )
        return response.status(400).json({
            message:
                "category,date_time,title,call_time,number,source,destination,user_id requied",
        });
    else if (!cat.includes(category))
        return response.status(400).json({ message: "invalid category" });
    else {
        User.findById(user_id)
            .then((data) => {
                if (data == null)
                    response.status(400).json({ message: "invalid id" });
                //validate valid subscription
                //end logic
                else if (data.reminder === 0) {
                    // console.log(data)
                    response.status(400).json({
                        message: "no valid subscription found this user",
                    });
                } else {
                    let reminder = new Reminder();
                    reminder.category = category;
                    reminder.date_time = new Date(date_time);
                    reminder.title = title;
                    reminder.call_time = new Date(call_time);
                    reminder.call_times = times;
                    reminder.number = number;
                    reminder.source = source;
                    reminder.destination = destination;
                    reminder.message = message ? message : null;
                    reminder.user_id = user_id;
                    reminder.frequency = frequency;
                    data.reminder = data.reminder - 1;
                    data.save();
                    reminder.save();
                    response
                        .status(201)
                        .json({ message: "data saved", data: reminder });
                }
            })
            .catch((err) => {
                response.status(500).json({ message: "internal server error" });
            });
    }
};

const Update_ = (request, response) => {
    Reminder.findById(request.params.id)
        .then((data) => {

            if (data == null)
                response.status(400).json({ message: "invalid id" });
            else {
                let cat = ["train", "bus", "flight", "others"];
                let {
                    number,
                    source,
                    destination,
                    message,
                } = request.body;
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
                data.save();
                response
                    .status(200)
                    .json({ message: "data Updated", data: data });
            }
        })
        .catch((err) => {
            response.status(400).json({ message: "invalid id" });
        });
};

const Find_ = (request, response) => {
    Reminder.findById(request.params.id)
        .then((data) => {
            if (data == null)
                response.status(400).json({ message: "invalid id" });
            else response.status(200).json(data);
        })
        .catch((err) => {
            response.status(400).json({ message: "invalid id" });
        });
};

//FindUser_

const FindUser_ = (request, response) => {
    Reminder.find({ user_id: request.params.id }).lean()
      .then((data) => {
        if (data == null) {
          response.status(400).json({ message: "invalid id" });
        } else {
          for (let i = 0; i < data.length; i++) {
            data[i].call_time=new Date(data[i].call_time).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
            data[i].date_time=new Date(data[i].date_time).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
            data[i].call_times = data[i].call_times.map((elem) => {
              return new Date(elem).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
            });
          }
          console.log("data", data);
          response.status(200).json(data);
        }
      })
      .catch((err) => {
        response.status(400).json({ message: "invalid id" });
      });
  };
  
const FindAll_ = (request, response) => {
    Reminder.find()
        .populate("user_id", "name phone -_id").lean()
        .then((data) => {
            if (data.length == 0)
                response.status(404).json({ message: "no data found" });
            else {
                for(let i=0; i<data.length; i++){

                    let time=convertISOStringToLocal(data[i].date_time);
                     data[i].date_time= time;
                    //  date[i].call_time=convertISOStringToLocal(data[i].call_time);
                    console.log({data});
                }
                response.status(200).json(data);
            }
        })
        .catch((err) => {
            console.log(err);
            response.status(500).json({ message: "internal server error" });
        });
};

const Remove_ = (request, response) => {
    Reminder.findByIdAndDelete(request.params.id)
        .then((data) => {
            // console.log(data);
            if (data == null)
                response.status(400).json({ message: "invalid id" });
            else if (data.status === true) {
                User.findOne({ _id: data.user_id }).then((userData) => {
                    // console.log(userData);
                    userData.reminder += 1;
                    userData.save();
                    return response
                        .status(200)
                        .json({ message: "reminder set" });
                });
            } else response.status(202).json({ message: "data removed" });
        })
        .catch((err) => {
            response.status(400).json({ message: "invalid id" });
        });
};
 const Add_Single_Reminder=async (request, response) =>{
    try {
        let data=request.body;
        // const eventTime = new Date(date_time);
        // const callTime = new Date(call_time);
        // const currentTime = new Date(Date.now());
        // let reminder = new Reminder();
        //             reminder.category = category;
        //             reminder.date_time = new Date(date_time);
        //             reminder.title = title;
        //             reminder.call_time = new Date(call_time);
        //             reminder.call_times = times;
        //             reminder.number = number;
        //             reminder.source = source;
        //             reminder.destination = destination;
        //             reminder.message = message ? message : null;
        //             reminder.user_id = user_id;
        //             reminder.frequency = frequency;
        let times = dividerTime(data.date_time, data.call_time, data.frequency);
        let transactionData= {
            payment_id:data.payment_id,
            amount:data.amount,
            user_id: data.user_id,
            status:data.status,
            remarks: data.remarks
        }
        let remiderData={
            category:data.category,
            date_time: new Date(data.date_time),
            title:data.title,
            call_time: new Date(data.call_time),
            call_times:times,
            number:data.number,
            source:data.source,
            destination:data.destination,
            message:data.message? data.message:null,
            user_id:data.user_id,
            frequency:data.frequency
        }
        const user_id = request.user.data._id;
        if (!user_id) {
            response.status(400).json({
                message: "user id is required",
            });
        }
        await Reminder.create(remiderData);
        await Transaction.create(transactionData);
        return response.status(201).json({message:"sucess"});
    } catch (error) {
        console.log(`Error in adding single remider ****${error}`);
        return response.status(501).json({message:"Internal server Error"});
    }
 }

module.exports = { Find_, FindAll_, Add_, Update_, Remove_, FindUser_, Add_Single_Reminder };
