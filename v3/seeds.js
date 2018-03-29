var mongoose    = require("mongoose"),
Campground      = require("./models/campground"),
Comment         = require("./models/comment");

var data = [
        {
            name: "Cloud's Rest",
            image: "https://pixabay.com/get/ea35b20c2cf0093ed1584d05fb1d4e97e07ee3d21cac104497f2c37ca4ebb1bd_340.jpg",
            description: "blah blah blah"
        },
        {
            name: "Desert Mesa",
            image: "https://pixabay.com/get/ea37b70b2ff4023ed1584d05fb1d4e97e07ee3d21cac104497f2c37ca4ebb1bd_340.jpg",
            description: "blah blah blah"
        },
        {
            name: "Canyon Floor",
            image: "https://pixabay.com/get/ea37b40721f6053ed1584d05fb1d4e97e07ee3d21cac104497f2c37ca4ebb1bd_340.jpg",
            description: "blah blah blah"
        }
    ];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Removed Campgrounds!");
            // Add a few campgrounds
            data.forEach(function(seed) {
                Campground.create(seed, function(err, campground) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Campground added!");
                        // create a comment
                        Comment.create(
                            {
                                text: "This place is great. But I wish there was Internet",
                                author: "Homer"
                            },
                            function(err, comment) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save(function(err, data) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            console.log("Comment added!");
                                        }
                                    });
                                }
                            }
                        );
                    }
                });
            });
        }
    });
    
    
    
    // Add a few comments
}

module.exports = seedDB;
