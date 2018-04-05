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
            res.render("comments/new", { campground: foundCampground });
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
                    // ------ UPDATE IN V8 -------
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id); // Redirecting bacck to the SHOW Route
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE - Show the Edit comment page
router.get("/:comment_id/edit", checkCommentOwnership, function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        res.render("comments/edit", { comment: foundComment, campground_id: req.params.id });
    });
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req,res) {
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
router.delete("/:comment_id", checkCommentOwnership, function(req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
                console.log(err);
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back"); // Take the User back to where they came from
    }
}

module.exports = router;