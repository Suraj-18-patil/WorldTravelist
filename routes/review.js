const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/review");

// // //----------------------------- for next POST Method validation for review schema-----------------

// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };
// //==========================================================================================

// //---------------------------Reviews POST Route -----------------------------
// router.post("/",validateReview ,wrapAsync( async(req,res)=>{
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

// //------------------------ DELETE ROUTE FOR REVIEW SECTION -------------------
router.delete("/:reviewId",  isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));


// //----------------------------------------------------------------------------------------------
module.exports = router;
