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
    res.render("register");
});
// sign up logic
router.post("/register", function(req,res) {
    var newUser = new User({ username: req.body.username}); // Register user using passport-local-mongoose
    User.register(newUser, req.body.password, function(err,user) { // Instead of password store hash-key data in MongoDB
        if(err) {
            return res.render("register", { "error": err.message }); // IMPORTANT: This code removes the bug that Submit button has to be refreshed twice when we provide invalid details
        }
        // Create session for this user and then call the serialise() function
        passport.authenticate("local")(req, res, function() { // for "local" stratergy. Other methods: twitter, facebook, etc.
        req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// ----- LOGIN ROUTES -----

// render login page
router.get("/login", function(req,res) {
    res.render("login");
});
// login logic - add middleware authentication
router.post("/login", passport.authenticate("local", { // Login auth using passport-local-mongoose
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