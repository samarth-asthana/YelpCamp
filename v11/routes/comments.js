var express     = require("express"),
    router      = express.Router({ mergeParams: true}), // mergeParms object will merge /:id route so that id is accessible.
    Comment     = require("../models/comment"),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// render new comment page
router.get("/new", middleware.isLoggedIn, function(req,res) { // isLoggedIn functionality added so, UNAUTHORIZED users can not add a comment
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground });
        }
    });
});

// Add this comment to DB and associate it with the Campground
router.post("/", middleware.isLoggedIn, function(req,res) { // isLoggedIn functionality added to Prevent someone from accessing the POST route
    Campground.findById(req.params.id, function(err,foundCampground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err,comment) {
                if(err) {
                    req.flash("error", "Something went wrong :/");
                    console.log("err");
                } else {
                    // ------ UPDATE IN V8 -------
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Successfully added your Review");
                    res.redirect("/campgrounds/" + foundCampground._id); // Redirecting bacck to the SHOW Route
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE - Show the Edit comment page
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) { // If somebody played with the Campground ID in URL
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            res.render("comments/edit", { comment: foundComment, campground_id: req.params.id });
        });
    });
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted your Review");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;