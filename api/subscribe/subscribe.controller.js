const { Subscribe } = require('../../models/Subscribe');
const { User } = require('../../models/User');
const { Subcription } = require('../../models/Subcription');
const { Transaction } = require('../../models/Transaction');


const Add_ = (request, response) => {
    let { subcription_id, user_id } = request.body;

    if (!subcription_id || !user_id)
        response.status(400).json({ message: "subcription_id,user_id requied" });
    else {
        User.findById(user_id).then((user) => {
            if (user == null)
                response.status(400).json({ message: "invalid user_id" });
            else {

                Subcription.findById(subcription_id).then((subscription) => {
                    if (subscription == null)
                        response.status(400).json({ message: "invalid subscription id" });
                    else {
                        let { price, validity, no_of_reminder, id } = subscription;
                        let { balance } = user;
                        if (price > balance)
                            response.status(400).json({ message: "insufficient balance" });
                        else {

                            // Create Transaction Object 
                            let transaction = new Transaction();
                            transaction.payment_id = null;
                            transaction.amount = subscription.price;
                            transaction.status = 'success';
                            transaction.remarks = 'subscription charge';
                            transaction.user_id = user.id;

                            // Create Subscribe Object 
                            let subscribe = new Subscribe();
                            subscribe.user_id = user.id;
                            subscribe.start_date = new Date();
                            subscribe.expire_date = new Date().setDate(new Date().getDate() + validity);
                            subscribe.price = price;
                            subscribe.no_of_reminder = no_of_reminder;
                            subscribe.subcription_id = id;
                            subscribe.transaction_id = transaction.id;

                            //Update user Balance
                            user.balance = parseFloat(user.balance) - parseFloat(price);
                            user.reminder = user.reminder + no_of_reminder;

                            //save the data
                            try {
                                subscribe.save();
                                user.save();
                                transaction.save();
                                response.status(201).json({ message: "subscribed sucessfully", data: subscribe });
                            }
                            catch (err) {
                                response.status(500).json({ message: "internal server error" });
                            }
                        }
                    }
                }).catch(err => { response.status(400).json({ message: "invalid subscription id" }); })
            }
        }).catch(err => { response.status(400).json({ message: "invalid user id" }); })
    }

};


const Update_ = (request, response) => {
    response.status(403).json({ message: "request not allowed" });
};


const Find_ = (request, response) => {
    Subscribe.findById(request.params.id).then((data) => {
        if (data == null)
            response.status(400).json({ message: "invalid id" });
        else
            response.status(200).json(data);
    }
    ).catch((err) => { response.status(400).json({ message: "invalid id" }); });
};



const FindAll_ = (request, response) => {
    Subscribe.find().then((data) => {
        if (data.length == 0)
            response.status(404).json({ message: "no data found" });
        else
            response.status(200).json(data)
    }).catch((err) => { response.status(500).json({ message: "internal server error" }); })
};


const Remove_ = (request, response) => {
    Subscribe.findByIdAndDelete(request.params.id).then((data) => {
        if (data == null)
            response.status(400).json({ message: "invalid id" });
        else
            response.status(202).json({ message: "data removed" });
    }).catch((err) => { response.status(400).json({ message: "invalid id" }); })
};


module.exports = { Find_, FindAll_, Add_, Update_, Remove_ };