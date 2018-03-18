var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.remove({name: "Granite Hill"}, function(err, camp) {
//     if(err) {
//         console.log("Error occured: "+err);
//     } else {
//         console.log("Succesffully Deleted");
//         console.log(camp);
//     }
// });

app.use(bodyParser.urlencoded({extended: true})); // using the body-parser
app.set("view engine", "ejs");

app.get("/", function(req,res) {
    res.render("landing");
});

// INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req,res) {
    Campground.find({}, function(err, allCamps) {
        if(err) {
            console.log("Error occured: "+err);
        } else {
            res.render("index", { camps: allCamps});
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
    res.render("new");
});

// SHOW - show a particular campground
app.get("/campgrounds/:id", function(req,res) {
    // find the campground with provided ID
    var id = req.params.id;
    Campground.findById(id, function(err,success) { // Method to find a tuple from DB by an ID
        if(err) {
            console.log("Something went wrong: "+err);
        } else {
            res.render("show", {camp: success}); 
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp has Started!");
});