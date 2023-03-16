var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    payment_id: {
        type:String,
    },
    amount: {
        type:Number,
        required:true,
        default:0,
        min:0
    },
    user_id:{type:String},

    date: {
        type:Date,
        default:new Date()
    },
    status:{
        type: String,
        enum : ['success','pending','failed'],
        default: 'success',
        required: true
    },
    remarks:{
        type: String,
        default:null,
    },
  });

  let Transaction=con.model('Transaction', TransactionSchema);
  module.exports = {Transaction}