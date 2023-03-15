var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;

const FAQSchema = new Schema ({
    subject:{type:String,required:true},
    body:{type:String,required:true},
    isActive:{
        type:Boolean,
        default:true
    }
})
  
let FAQ=con.model('FAQ', FAQSchema);
module.exports = {FAQ}