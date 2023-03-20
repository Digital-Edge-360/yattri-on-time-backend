var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    message:{
        type:String
    },
    rating:{
        type:Number,
        minlength:1,
        maxlength:5,
        required:true,
    },
    status:{
        type:Boolean,
        default:false
      }
})


let Review=con.model('Review', ReviewSchema);
module.exports = {Review}