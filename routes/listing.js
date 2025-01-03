const express =require("express");
const router =express.Router();
const wrapAsync =require("../utils/wrapAsync");
const ExpressError =require("../utils/ExpressError");
const {listingSchema} = require("../schema");
const Listing =require("../models/listing");
const {isLoggedIn ,isOwner, validateListing} = require("../middleware");
const listingController =require("../controllers/listing");

const multer  = require('multer')
const {storage} = require("../cloudConfig");
const upload = multer({storage}); //used to save the uploaded image files

// // //----------------------------- for next POST Method validation for listing schema-----------------
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body); //when use this delete if conditions
//     if(error){
//         let errMsg =error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
   
// }
// ----------------- Routes For Listings ---------------------


// //----------- Using router.route ---------
router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing));

// //new Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));


router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// // ==============USE ABOVE OR BELOW ONLY ONE =======================

// //1] Listing Index Route -----------------------
// router.get("/", validateListing,wrapAsync( async (req, res) => {
// router.get("/", wrapAsync(listingController.index));
// // above code write in router.route format


// //2] New Listing Route -----------------------
// router.get("/new",isLoggedIn,listingController.renderNewForm);


// //3] Listing Show Route -----------------------
// router.get("/:id", wrapAsync(listingController.showListing));

// //4]  Create NEW Listing Route -----------------------
// router.post("/",isLoggedIn ,wrapAsync(listingController.createListing));
 // // above code write in router.route format

// //5] Edit Then Update Route ------------------------------------
// router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// router.put("/:id",isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

// //6] Delete Route ------------------------------------
// router.delete("/:id", isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));

// //-------------------------------------------------------------------------------------------------
module.exports=router;
