var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true})); // using the body-parser
app.set("view engine", "ejs");

var campgrounds = [
    { name: "Salmon Creek", image: "https://farm8.staticflickr.com/7296/28070862692_32f82c02ba.jpg" },
    { name: "Granite Hill", image: "https://pixabay.com/get/ea35b3092ff7033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" },
    { name: "Mountain Goat's rest", image: "https://pixabay.com/get/eb35b70b2df6033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" },
    { name: "Salmon Creek", image: "https://farm8.staticflickr.com/7296/28070862692_32f82c02ba.jpg" },
    { name: "Granite Hill", image: "https://pixabay.com/get/ea35b3092ff7033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" },
    { name: "Mountain Goat's rest", image: "https://pixabay.com/get/eb35b70b2df6033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" },
    { name: "Salmon Creek", image: "https://farm8.staticflickr.com/7296/28070862692_32f82c02ba.jpg" },
    { name: "Granite Hill", image: "https://pixabay.com/get/ea35b3092ff7033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" },
    { name: "Mountain Goat's rest", image: "https://pixabay.com/get/eb35b70b2df6033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" }

];

app.get("/", function(req,res) {
    res.render("landing");
});

app.get("/campgrounds", function(req,res) {
    res.render("campgrounds", { camps: campgrounds});
});

app.get("/campgrounds/new", function(req,res) {
    res.render("new");
})

app.post("/campgrounds", function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {
        name: name,
        image: image
    };
    campgrounds.push(newCampground); // Add the new Campground
    res.redirect("/campgrounds"); // GET is the default ROUTE 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp has Started!");
});