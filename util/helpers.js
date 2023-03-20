const bcrypt = require('bcryptjs');
const moment = require('moment');
const Joi = require('joi');
const phoneValidator = (phone) => {
    let Regx = new RegExp(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/);
    return Regx.test(phone);
}

const emailValidetor = (email) => {
    let Regx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return Regx.test(email);
}
const formatPhone = (phone) => {
    let ph = phone.toString().length;
    if (ph == 10)
        return `+91${phone}`;
    else if (ph == 12) {
        return `+${phone}`;
    }
    else if (ph == 11) {
        let temp = `+91${phone.toString().substring(1, 10)}`;
        return temp;
    }
    else {
        return phone;
    }
}

const comparePassword = async (password1, password2) => {
    try {
        const isMatch = await bcrypt.compare(password1, password2);
        return isMatch
    } catch (error) {
        return false;
    }
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const dividerTime =  (date_time, call_time, frequency) => {
    const date = new Date(date_time).getTime();
    const call = new Date(call_time).getTime();
    const diff = call - date;
    const diff_in_minutes = Math.floor(diff / 60000);
    const callInterval = diff_in_minutes / frequency;
    let callTimes = []
    let reminderTime = new Date(date_time)
    for (let i = 0; i < frequency; i++) {
        reminderTime= new Date(reminderTime.setMinutes(reminderTime.getMinutes()+callInterval))      
         callTimes.push(new Date(reminderTime));
    }
    return  callTimes 

}


const reviewJoi = Joi.object({
    userId: Joi.string().required(),

    rating:Joi.number().min(1).max(5).required(),

    message:Joi.string(),
  
    isDeleted:Joi.boolean()

  })
module.exports = { phoneValidator, formatPhone, emailValidetor, comparePassword, hashPassword, dividerTime,reviewJoi }

