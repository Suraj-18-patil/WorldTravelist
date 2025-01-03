const Review = require("../models/review");
const Listing = require("../models/listing");


module.exports.createReview =async (req, res) => {
    console.log(req.params.id);

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author =req.user._id;
    console.log(newReview);
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success","New Review Addded!!!");
    console.log("New Review Saved");
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.deleteReview =async (req, res) => {
    let { id, reviewId } = req.params;
    // console.log(id);
    // console.log(reviewId);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully!!!");
    res.redirect(`/listings/${id}`);
  }