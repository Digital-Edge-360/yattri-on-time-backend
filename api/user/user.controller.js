const { User } = require("../../models/User");
const { phoneValidator, formatPhone } = require("../../util/helpers");
const {Transaction} = require("../../models/Transaction");
var jwt = require("jsonwebtoken");
var fs = require("fs");
const {
    sendVerificationSms,
    callAndSay,
    remindUser,
} = require("../../services/twilio.service.js");
const { log } = require("console");

const Add_ = (request, response) => {
    let validExt = ["jpg", "jpeg", "png"];
    let { name, phone } = request.body;
    let user = new User();
    user.name = name;
    user.phone = formatPhone(phone);
    if (!name || !phone) {
        response.status(400).json({ message: "name and phone no required" });
    } else if (!phoneValidator(phone))
        response.status(400).json({ message: "invalid phone number" });
    else if (request.files != null && request.files.image != null) {
        let { size, name, md5 } = request.files.image;
        let img = request.files.image;
        let ext = name.split(".").at(-1);
        if (size > 300000)
            response.status(400).json({ message: "image size less than 3mb" });
        else if (!validExt.includes(ext))
            response.status(400).json({ message: "invalid image type" });
        else {
            let fname = md5 + "__" + Date.now() + "." + ext;
            var uploadPath = __dirname + "/../../uploads/" + fname;
            img.mv(uploadPath, (err) => {
                response.status(500).json({ message: "internal server error" });
            });
            user.image = fname;
        }
    } else {
        user.save();
        let token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        response
            .status(200)
            .json({ message: "user created", token, info: user });
    }
};

const Update_ = (request, response) => {
    let { name, phone, status } = request.body;
    let validExt = ["jpg", "jpeg", "png"];
    User.findById(request.params.id)
        .then((user) => {
            if (user == null)
                response.status(400).json({ message: "invalid id" });
            else {
                user.name = name ? name : user.name;
                if (phone) {
                    if (!phoneValidator(phone))
                        return response
                            .status(400)
                            .json({ message: "invalid phone number" });
                    const usernumber = formatPhone(phone);
                    user.phone = usernumber ? usernumber : user.phone;
                }
                user.status = status != undefined ? status : user.status;
                if (request.files != null && request.files.image != null) {
                    let { size, md5 } = request.files.image;
                    let img = request.files.image;
                    let ext = img.name.split(".").at(-1);
                    if (size > 300000)
                        response
                            .status(400)
                            .json({ message: "image size less than 3mb" });
                    else if (!validExt.includes(ext))
                        response
                            .status(400)
                            .json({ message: "invalid image type" });
                    else {
                        let fname = md5 + "__" + Date.now() + "." + ext;
                        var uploadPath = __dirname + "/../../uploads/" + fname;
                        img.mv(uploadPath, (err) => {
                            if (err) console.log(err);
                        });
                        if (user.image != "avatar.png") {
                            let filePath =
                                __dirname + "/../../uploads/" + user.image;
                            fs.unlinkSync(filePath);
                        }
                        user.image = fname;
                        user.save();
                        response
                            .status(200)
                            .json({ message: "information updated" });
                    }
                } else {
                    user.name = name ? name : user.name;
                    user.status = status != undefined ? status : user.status;
                    user.save();
                    response
                        .status(200)
                        .json({ message: "information updated" });
                }
            }
        })
        .catch((err) => {
            response.status(400).json({ message: "invalid id" });
        });
};

const Find_ = (request, response) => {
    User.findById(request.params.id)
        .then((data) => {
            if (data == null)
                response.status(400).json({ message: "invalid id" });
            else response.status(200).json(data);
        })
        .catch((err) => {
            response.status(400).json({ message: "invalid id" });
        });
};

const FindAll_ = (request, response) => {
    User.find()
        .then((data) => {
            if (data.length == 0)
                response.status(404).json({ message: "no data found" });
            else response.status(200).json(data);
        })
        .catch((err) => {
            response.status(500).json({ message: "internal server error" });
        });
};

const Remove_ = (request, response) => {
    User.findByIdAndDelete(request.params.id)
        .then((data) => {
            if (data == null)
                response.status(400).json({ message: "invalid id" });
            else response.status(202).json({ message: "data removed" });
        })
        .catch((err) => {
            response.status(400).json({ message: "invalid id" });
        });
};

const Login_ = (request, response) => {
    let { phone, otp_verified } = request.body;

    if (!phone || otp_verified == undefined)
        response.status(400).json({ message: "phone,otp_verified requied" });
    else if (!phoneValidator(phone))
        response.status(400).json({ message: "invalid phone number" });
    else {
        // let uphone = formatPhone(phone);
        User.findOne({ phone })
            .then((data) => {
                if (data == null)
                    response.status(404).json({ message: "user not exist" });
                else if (data.status == false)
                    response.status(404).json({ message: "user blocked" });
                else {
                    if (!data.verified) {
                        data.verified = true;
                        data.save();
                    }
                    let token = jwt.sign( {data} , process.env.JWT_SECRET, {
                        expiresIn: "30d",
                    });
                    response
                        .status(200)
                        .json({ message: "user verified", token, info: data });
                }
            })
            .catch((err) => {
                console.log(err);
                response.status(500).json({ message: "internal server error" });
            });
    }
};

const Register_ = (request, response) => {
    let { phone, name } = request.body;
    if (!phone || !name)
        response.status(400).json({ message: "phone,name requied" });
    else if (!phoneValidator(phone))
        response.status(400).json({ message: "invalid phone number" });
    else {
        // let uphone = formatPhone(phone);
        User.findOne({phone})
            .then((data) => {
                if (data == null) {
                    let data = new User();
                    data.name = name;
                    data.phone = phone;
                    data.verified = true;
                    data.status = true;
                    data.save();
                    var token = jwt.sign({data} , process.env.JWT_SECRET, {
                        expiresIn: "30d",
                    });
                    response.json({ user: data, token });
                } else {
                    var token = jwt.sign(data, process.env.JWT_SECRET, {
                        expiresIn: "30d",
                    });
                    response.json({ user: data, token });
                }
            })
            .catch((err) => {
                console.log(err);
                response.status(500).json({ message: "internal server error" });
            });
    }
};

const SendOtp_ = (request, response) => {
    let { phone } = request.body;
    if (!phone) response.status(400).json({ message: "phone requied" });
    else if (!phoneValidator(phone))
        response.status(400).json({ message: "invalid phone number" });
    else {
        let uphone = formatPhone(phone);
        console.log({uphone});
        User.findOne({ phone: uphone })
            .then((data) => {
                if (data == null) {
                    sendVerificationSms(uphone)
                        .then((res) => {
                            response.status(200).json({
                                message: "user not exist",
                                otp: res.otp,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            response.status(500).json({
                                message: "failed to send verification code",
                            });
                        });
                } else
                    sendVerificationSms(uphone)
                        .then((res) => {
                            response.status(200).json({
                                message: "user exist",
                                info: data,
                                otp: res.otp,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            response.status(500).json({
                                message: "failed to send verification code",
                            });
                        });
            })
            .catch((err) => {
                response.status(500).json({ message: "internal server error" });
            });
    }
};

const RemindUser_ = async (req, res) => {
    try {
        const { to, message } = req.body;
        const status = await remindUser({
            to,
            message,
        });
        res.status(200).json({ message: "call was successfull", status });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
};

const getTransactions_= async(req, res) => {
    try {   
            console.log("kkk", req.params.id)
            const transactions = await Transaction.find({user_id: req.params.id});
            res.status(200).json(transactions);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" });
        }
}

module.exports = {
    Find_,
    FindAll_,
    Add_,
    Update_,
    Remove_,
    Login_,
    Register_,
    SendOtp_,
    RemindUser_,
    getTransactions_
};
