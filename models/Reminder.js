var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;
const ReminderSchema = new Schema({
    category:{
        type: String,
        enum : ['train','bus','flight','others'],
        required: true
    },
    date_time:{
        type:Date,
        required:true,
    },
    title: {
        type:String,
        required:true,
    },
    call_time:{
        type:Date,
        required:true,
    },
    number:{
        type:String,
        required:true,
    },
    source:{
        type:String,
        required:true,
    },
    destination:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:false,
    },
    user_id:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    }
  });


let Reminder=con.model('Reminder', ReminderSchema);
module.exports = {Reminder}