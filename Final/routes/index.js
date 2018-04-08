var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

router.get("/", function(req,res) {
    res.render("landing");
});

// ----- SIGN UP ROUTES -----

// render sign up page
router.get("/register", function(req,res) {
    res.render("register", {page: "register"}); // Tell nav-bar that sign-up page is currently active
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// ----- LOGIN ROUTES -----

// render login page
router.get("/login", function(req,res) {
    res.render("login", { page: "login" }); // Tell nav-bar that login page is currently active
});
// login logic - add middleware authentication
router.post("/login", passport.authenticate("local", { // Login auth using passport-local-mongoose
        successFlash: true,
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true // Provide flash message to the user for an incorrect login
    }), 
    function(req,res) {}
);

// ---- LOGOUT ROUTE -----

router.get("/logout", function(req,res) {
    req.logout(); // Delete all user data in the current session
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;