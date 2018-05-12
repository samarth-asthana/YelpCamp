var express         = require("express"),
    router          = express.Router(),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware");
    
var NodeGeocoder = require('node-geocoder');

// ---- Multer and Cloudinary ------
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'abhishek363', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// ------------------------

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY, // This is where we put our GEOCODER API KEY and is hidden from everybody
  formatter: null
};

var geocoder = NodeGeocoder(options);

// INDEX ROUTE - show all campgrounds
router.get("/", function(req,res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCamps) {
            if(err) {
                console.log(err);
                req.flash("error","Something went wrong.");
                return res.redirect("back");
            }
            Campground.count({name: regex}).exec(function (err, count) {
                if(err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allCamps.length < 1) {
                        noMatch = "No Campgrounds match that query, try that again!!!";
                    }
                    res.render("campgrounds/index", {
                        camps: allCamps,
                        page: "campgrounds",
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCamps) {
            if(err) {
                console.log(err);
                req.flash("error","Something went wrong.");
                return res.redirect("back");
            }
            Campground.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        camps: allCamps,
                        page: "campgrounds",
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('/campgrounds');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var name = req.body.name;
        var price = req.body.price;
        var desc = req.sanitize(req.body.description); // Sanitizer removes all the Script tags
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        cloudinary.uploader.upload(req.file.path, function(result) {
            var image = result.secure_url; // add image URL 
            var newCampground = {name: name, image: image, price: price, description: desc, author:author, location: location, lat: lat, lng: lng};
            Campground.create(newCampground, function(err, newlyCreated){
                if(err){
                    console.log(err);
                    req.flash("error", err.message);
                    return res.redirect("/campgrounds");
                } else {
                    req.flash("success","Successfully created campground");
                    res.redirect("/campgrounds");
                }
            });
        });
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res) { // isLoggedIn functionality added so, UNAUTHORIZED users can not add a campground
    res.render("campgrounds/new");
});

// SHOW - show a particular campground
router.get("/:id", function(req,res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground) { // Method to find a tuple from DB by an ID
        if(err || !foundCampground) { // If there was no campground found with the ID optimized by the viewer
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
});

// EDIT - Edit a particular campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res) {
    // ------- UPDATE v10 --------
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", { camp: foundCampground });
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('/campgrounds');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    req.body.campground.description = req.sanitize(req.body.campground.description);

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully updated campground");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

// DELETE - Delete a particular campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
            
        foundCampground.comments.forEach(function(comment) {  // foundCampground.comments is an array of unique ID's specifying each comment associated with that campground
            Comment.findByIdAndRemove(comment, function(err) { // Delete the associated comments from the database using the unique ID
                if(err) {
                   console.log(err);
                }
            });
        });
        foundCampground.remove(); // Remove this campground from the DB
        foundCampground.save(); // Save this state of Database
                
        req.flash("success", "Successfully deleted campground");
        res.redirect("/campgrounds");
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;