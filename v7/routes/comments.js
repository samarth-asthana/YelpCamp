var express     = require("express"),
    router      = express.Router({ mergeParams: true}), // mergeParms object will merge /:id route so that id is accessible.
    Comment     = require("../models/comment"),
    Campground  = require("../models/campground");

// render new comment page
router.get("/new", isLoggedIn, function(req,res) { // isLoggedIn functionality added so, UNAUTHORIZED users can not add a comment
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground});
        }
    });
});

// Add this comment to DB and associate it with the Campground
router.post("/", isLoggedIn, function(req,res) { // isLoggedIn functionality added to Prevent someone from accessing the POST route
    Campground.findById(req.params.id, function(err,foundCampground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err,comment) {
                if(err) {
                    console.log("err");
                } else {
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id); // Redirecting bacck to the SHOW Route
                }
            });
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