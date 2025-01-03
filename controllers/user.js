const User =require("../models/user");

// // -------------- For Signup ------------
module.exports.renderSignupForm =(req,res)=>{
    // res.send(" Signup form");
    res.render("users/signup.ejs");
}

module.exports.signup =async(req,res)=>{
    try {
        let { username ,email ,password} = req.body;
        const newUser = new User({username,email});
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Account Created Successfully");
            res.redirect("/login");
            // res.redirect("/listings");
        })
        
    } catch (err) {
        req.flash("error",err.message);
        res.redirect("/signup");
    }  
}

// // -------------- For Login ------------

module.exports.renderLoginForm = (req,res)=>{
    // res.send("Login Form");
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    // res.send("Login Form");
    req.flash("success","Welcome To Wanderlust")
    // res.redirect("/listings");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


// // -------------- For LogOut ------------

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if (err) {
           return next(err);
        }
        req.flash("success","You Are Logged Out")
        res.redirect("/listings");
    })
}