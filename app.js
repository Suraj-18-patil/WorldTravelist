if (process.env.NODE_ENV != "production"){
    require('dotenv').config();
    // console.log(process.env.SECRET);
}
    

const express =require("express");
const app=express();
const port =8080;
const mongoose = require("mongoose");

// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const DB_Url= process.env.ATLASDB_URL;

const Listing =require("./models/listing");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError =require("./utils/ExpressError");
const session =require("express-session")
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require ("passport");
const LocalStrategy = require ("passport-local");
const User  = require("./models/user");

const listingsRouter =require("./routes/listing");
const reviewsRouter =require("./routes/review");
// const { send } = require("process");
const usersRouter =require("./routes/user");
const { error } = require('console');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl:DB_Url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  });

  store.on("error",()=>{
    console.log("ERROR in MONGO STORE",error);
    
  });
  
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        // expires:Date.now().toString().split(" ").slice(0,4).join(" ") + 7 * 24 * 60 * 60 * 1000,
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true ,
    }
  };

 

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// //=============================================================================================================
// --------------- DATABSE CONNECTION ----------------------
main().then(()=>{
    console.log("Connection to DB Successfully");
}).catch((err)=>{
    console.log(err)
});

async function main(){
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(DB_Url);
}

// //--------------------- Root Route -----------------------
// app.get("/",(req,res)=>{
//     res.send("Hi, I am Root");
//     // res.redirect("/login");
// })
// app.get("/",(req,res)=>{
//     res.send("Hi, I am Root");
//     // res.redirect("/login");
// })


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"std@gmail.com",
//         username:"ecx-student",
//     });
//    let registeredUser = await User.register(fakeUser,"helloStd");
//     res.send(registeredUser);
// })
// ---------------------ROUTES FOR LISTING AND REVIEWS 
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// //--------------------- Test Listing Route -----------------------
app.get("/testlisting",async(req,res)=>{
        let sampleListing = new Listing({
                title:"My Old Villa",
                description:"By The Beach side",
                price:1500,
                location:"Near Lighthouse Goa",
                country:"India",
        });
    await sampleListing.save();
    console.log("sample Was Saved");
    res.send("Succesfull Testing")

});

// //==========================================================================================
// //---------------------------Creating Middleware Section -------------------------

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

 // // ------for Create route -----

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!!!"}=err;
    // res,send("Something Went Wrong!!!");
    res.status(statusCode).render("error.ejs",{err});
})

// //--------------------------------------------------------
app.listen(port,()=>{
    console.log(`Server is Listening On Port :- ${port}`);   
})



