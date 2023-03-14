var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;
const AdminSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
})

const Admin=con.model('Admin',AdminSchema);
module.exports={Admin};