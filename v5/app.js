var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true})); // using the body-parser
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function(req,res) {
    res.render("landing");
});

// INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req,res) {
    Campground.find({}, function(err, allCamps) {
        if(err) {
            console.log("Error occured: "+err);
        } else {
            res.render("campgrounds/index", { camps: allCamps});
        }
    });
});

// CREATE ROUTE - add new campground to DB
app.post("/campgrounds", function(req,res) {
    var name = req.body.name; // String
    var image = req.body.image; // String
    var desc = req.body.desc; // String
    var newCampground = {
        name: name,
        image: image,
        description: desc
    };
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
app.get("/campgrounds/new", function(req,res) {
    res.render("campgrounds/new");
});

// SHOW - show a particular campground
app.get("/campgrounds/:id", function(req,res) {
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

// ==================================
// -------- COMMENTS ROUTES ---------
// ==================================

app.get("/campgrounds/:id/comments/new", function(req,res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res) {
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

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp has Started!");
});