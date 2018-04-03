var mongoose    = require("mongoose"),
Campground      = require("./models/campground"),
Comment         = require("./models/comment");

var data = [
        {
            name: "Cloud's Rest",
            image: "https://images.unsplash.com/photo-1508426494465-6ff39a96b4c7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4e594cc97fb51349df29bc45f0c53b40&auto=format&fit=crop&w=600&q=60",
            description: "Lorem ipsum dolor sit amet, ei vel affert tantas complectitur, at primis iriure accumsan vim, reque vitae eligendi cu sit. Aperiam impedit noluisse eu quo, id posse decore usu. Ceteros mentitum deterruisset ius ne. Quo ne quem partem, id natum dicat aperiam mel. Ferri percipitur efficiendi nec ut, quando quodsi constituto ei nam."
        },
        {
            name: "Desert Mesa",
            image: "https://images.unsplash.com/photo-1444090695923-48e08781a76a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=01ddf4d2efe4f16d0d4ebc048bb267e1&auto=format&fit=crop&w=600&q=60",
            description: "Lorem ipsum dolor sit amet, ei vel affert tantas complectitur, at primis iriure accumsan vim, reque vitae eligendi cu sit. Aperiam impedit noluisse eu quo, id posse decore usu. Ceteros mentitum deterruisset ius ne. Quo ne quem partem, id natum dicat aperiam mel. Ferri percipitur efficiendi nec ut, quando quodsi constituto ei nam."
        },
        {
            name: "Canyon Floor",
            image: "https://images.unsplash.com/photo-1484593068577-0b446a79ed33?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0be745eac49241e5b39ed9c78eb0d73e&auto=format&fit=crop&w=600&q=60",
            description: "Lorem ipsum dolor sit amet, ei vel affert tantas complectitur, at primis iriure accumsan vim, reque vitae eligendi cu sit. Aperiam impedit noluisse eu quo, id posse decore usu. Ceteros mentitum deterruisset ius ne. Quo ne quem partem, id natum dicat aperiam mel. Ferri percipitur efficiendi nec ut, quando quodsi constituto ei nam."
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
                        // // create a comment
                        // Comment.create(
                        //     {
                        //         text: "This place is great. But I wish there was Internet",
                        //         author: "Homer"
                        //     },
                        //     function(err, comment) {
                        //         if(err) {
                        //             console.log(err);
                        //         } else {
                        //             campground.comments.push(comment);
                        //             campground.save(function(err, data) {
                        //                 if(err) {
                        //                     console.log(err);
                        //                 } else {
                        //                     console.log("Comment added!");
                        //                 }
                        //             });
                        //         }
                        //     }
                        // );
                    }
                });
            });
        }
    });
    
    
    
    // Add a few comments
}

module.exports = seedDB;
