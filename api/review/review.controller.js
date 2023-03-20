const {Review} = require('../../models/Review.js');
const { User } = require('././../../models/User');
const {reviewJoi,UpdatereviewJoi} = require('../../util/helpers');
const Add_ = async (req, res) => {
    try {
        const review = req.body
        if(Object.keys(review).length == 0)  return res.status(400).json({message:"please enter some review"})
       const {userId} = review
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
        const reviews = await Review.find({userId:userId,status:true}).populate("userId","name image")     
        return res.status(200).json(reviews)
     
      } catch (error) {
        return res.status(500).json(error.message)
      }
}


const Update_ = async (req, res) => {
  try {
  
    const review = req.body
    if(Object.keys(review).length == 0)  return res.status(400).json({message:"please enter some review"})
   try {
    await UpdatereviewJoi.validateAsync(review);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
const findReview = await Review.findById(req.params.id)
if(!findReview)  return res.status(404).json({message:"reviews not found"})
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, review, {new:true})
    return res.status(201).json(updatedReview);
  } catch (err) {
    console.log(err);
    return  res.status(500).json(err.message);
  }

}


const Delete_ = async (req, res) => {
  try {
    const reviewId = req.params.id
    const findReview = await Review.findById(reviewId)
    if(!findReview) return res.status(404).json({message:"review not found"})
     await Review.findByIdAndDelete(reviewId);
    return res.status(200).json({message:"review deleted successfully"})
  } catch (err) {
    return  res.status(500).json(err.message);
  }
}

module.exports = {
    Add_,
    Findall_,
    Update_,
    Delete_
}