var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;

const ContactQuerySchema = new Schema({
    email_or_phone: {
        type:String,
        required:true,
    },
    message:  {
        type:String,
        required:true,
    },
    date: {
        type:Date,
        default:new Date(),
    },
    status:{
        type:Boolean,
        default:false
    },
  });


let ContactQuery=con.model('ContactQuery', ContactQuerySchema);
module.exports = {ContactQuery}