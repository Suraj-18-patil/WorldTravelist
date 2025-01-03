const express = require("express");
const router = express.Router();
const User =require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport =require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController  = require("../controllers/user");


// ========== Signup Routes ============================


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// // ------- USE Above OR Below Only One for signup -------
// router.get("/signup",userController.renderSignupForm);

// router.post("/signup",wrapAsync(userController.signup));

// ========== Login Routes ============================

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), userController.login);

// // ------- USE Above OR Below Only One for login -------
// router.get("/login",userController.renderLoginForm);

// router.post("/login", saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), userController.login);

// ========== Logout Routes ============================
router.get("/logout",userController.logout);

// //----------------------------------------------------------------------------------------------------------------------------------
module.exports=router;