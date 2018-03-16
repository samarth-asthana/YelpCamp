var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req,res) {
    res.render("landing");
});

app.get("/campgrounds", function(req,res) {
    var campgrounds = 
        [
            { name: "Salmon Creek", image: "https://farm8.staticflickr.com/7296/28070862692_32f82c02ba.jpg" },
            { name: "Granite Hill", image: "https://pixabay.com/get/ea35b3092ff7033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" },
            { name: "Mountain Goat's rest", image: "https://pixabay.com/get/eb35b70b2df6033ed1584d05fb1d4e97e07ee3d21cac104497f1c07fa2ecb0bb_340.jpg" }
        ];
    res.render("campgrounds", { camps: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp has Started!");
});