var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    localStratergy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true})); // using the body-parser
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// ======================
// PASSPORT CONFIGURATION
//=======================
app.use(require("express-session")({
    secret: "keyboard cat", // Secret Key for the session
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// Responsible for:-
// reading the session, taking the data from the session which is encoded and unencoding it. -> DeserialiseUser
// then, encoding it, serializing it, and putting it back to the session. -> SerializeUser
passport.use(new localStratergy(User.authenticate())); // coming from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This function adds the currentUser value to all the templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next(); // proceed to next ROUTE
});

// ====================
// ------ ROUTES ------
// ====================

app.get("/", function(req,res) {
    res.render("landing");
});

// INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req,res) {
    Campground.find({}, function(err, allCamps) {
        if(err) {
            console.log("Error occured: "+err);
        } else {
            res.render("campgrounds/index", { camps: allCamps });
        }
    });
});

// NEW - show form to create new campground
app.get("/campgrounds/new", isLoggedIn, function(req,res) { // isLoggedIn functionality added so, UNAUTHORIZED users can not add a campground
    res.render("campgrounds/new");
});

// CREATE ROUTE - add new campground to DB
app.post("/campgrounds", isLoggedIn, function(req,res) { // isLoggedIn functionality added to prevent someone from accessing the POST route
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res) { // isLoggedIn functionality added so, UNAUTHORIZED users can not add a comment
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res) { // isLoggedIn functionality added to Prevent someone from accessing the POST route
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

// =============================
// -------- AUTH ROUTES --------
// =============================

// ----- SIGN UP ROUTES -----

// render sign up page
app.get("/register", function(req,res) {
    res.render("register");
});
// sign up logic
app.post("/register", function(req,res) {
    var newUser = new User({ username: req.body.username}); // Register user using passport-local-mongoose
    User.register(newUser, req.body.password, function(err,user) { // Instead of password store hash-key data in MongoDB
        if(err) {
            console.log(err);
            return res.render("register");
        }
        // Create session for this user and then call the serialise() function
        passport.authenticate("local")(req, res, function() { // for "local" stratergy. Other methods: twitter, facebook, etc.
            res.redirect("/campgrounds");
        });
    });
});

// ----- LOGIN ROUTES -----

// render login page
app.get("/login", function(req,res) {
    res.render("login");
});
// login logic - add middleware authentication
app.post("/login", passport.authenticate("local", { // Login auth using passport-local-mongoose
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
    function(req,res) {}
);

// ---- LOGOUT ROUTE -----

app.get("/logout", function(req,res) {
    req.logout(); // Delete all user data in the current session
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp has Started!");
});