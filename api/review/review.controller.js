const {Review} = require('../../models/Review.js');
const { User } = require('././../../models/User');
const {reviewJoi} = require('../../util/helpers');
const Add_ = async (req, res) => {
    try {
        const review = req.body
        if(Object.keys(review).length == 0)  return res.status(400).json({message:"please enter some review"})
       const {userId,message,rating} = review
       try {
        await reviewJoi.validateAsync(review);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({message:"user not found"})
        const reviewSubmit = await Review.create(review)
       return res.status(201).json(reviewSubmit);
    } catch (err) {
      console.log(err);
      return  res.status(500).json(err.message);
    }
}

const Findall_ = async (req, res) => {
      try {
        const userId = req.user.data._id
        const reviews = await Review.find({userId:userId})
        return res.status(200).json(reviews)
      } catch (error) {
        
      }
}


const Update_ = async (req, res) => {
}
module.exports = {
    Add_,
    Findall_
}