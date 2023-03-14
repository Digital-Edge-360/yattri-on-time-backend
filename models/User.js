var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    image:{
        type:String,
        default:'avatar.png'
    },
    status: {
        type:Boolean,
        default:false
    },
    subcription:String,
    registerd_at: {
        type:Date,
        default:new Date(),
    },
    balance:{
        type:Number,
        default:0,
        min:0
    },
    reminder:{
        type:Number,
        default:0,
        min:0
    },
    
  });

  let User=con.model('User', UserSchema);
  module.exports = {User}