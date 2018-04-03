var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground");
    
// INDEX ROUTE - show all campgrounds
router.get("/", function(req,res) {
    Campground.find({}, function(err, allCamps) {
        if(err) {
            console.log("Error occured: "+err);
        } else {
            res.render("campgrounds/index", { camps: allCamps });
        }
    });
});

// CREATE ROUTE - add new campground to DB
router.post("/", isLoggedIn, function(req,res) { // isLoggedIn functionality added to prevent someone from accessing the POST route
    var name  = req.body.name, // String
        image = req.body.image, // String
        desc  = req.body.desc; // String
    // ---- UPDATE V9 ---- 
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author };
    // ------------------
    Campground.create(newCampground, function(err, newCamp) { // Add a new Campground to the DB
        if(err) {
            console.log("Error occured: "+err);
        } else {
            //console.log("A new Campground was added to the DB:");
            //console.log(newCamp);
            res.redirect("/campgrounds"); // GET is the default ROUTE
        }
    });
});

// NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req,res) { // isLoggedIn functionality added so, UNAUTHORIZED users can not add a campground
    res.render("campgrounds/new");
});

// SHOW - show a particular campground
router.get("/:id", function(req,res) {
    // find the campground with provided ID
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,success) { // Method to find a tuple from DB by an ID
        if(err) {
            console.log("Something went wrong: "+err);
        } else {
            res.render("campgrounds/show", {camp: success}); 
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;