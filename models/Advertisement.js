var mongoose=require('mongoose');
var con=mongoose.createConnection(process.env.MONGO_DB_URL);
const Schema = mongoose.Schema;
const AdvertisementSchema = new Schema({
    title: {
        type:String,
        default:null
    },
    image: {
        type:String,
        required:true
    },
    url:{
        type:String,
        required:false,
    },
    status:Boolean
  });


  let Advertisement=con.model('Advertisement', AdvertisementSchema);
  module.exports = {Advertisement}
