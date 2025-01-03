const Listing =require ("./models/listing");
const ExpressError =require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema");
const Review = require("./models/review");

//  ====================== For User Logged in Or Not ========================
module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.user);
    // console.log(req.path,"..",req.originalUrl);

    if (!req.isAuthenticated()) {
        req.session.redirect= req.originalUrl;

        req.flash("error","You Must Be Logged In to Create Listings !!!");
        res.redirect("/login")   
    }
    next();
}

// ========================For User Session  Availablity ====================
module.exports.saveRedirectUrl = (req, res, next)=>{
    if ( req.session.redirectUrl) {
        req.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// ========================= For Owner Authorization ========================
module.exports.isOwner =async(req,res,next)=>{
    let { id } = req.params;
    let listing =await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","You Don't Have Permission To Edit")
        return res.redirect(`/listings/${id}`); 
    }
    next();
}


// //----------------------------- for next POST Method validation for listing schema-----------------
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body); //when use this delete if conditions
    if(error){
        let errMsg =error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
   
}

// //----------------------------- for next POST Method validation for review schema-----------------

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  
// ========================= For Owner/Author Authorization  To Delete Reviews ========================
module.exports.isReviewAuthor =async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review =await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","You Are Not The Author of This Review")
        return res.redirect(`/listings/${id}`); 
    }
    next();
}