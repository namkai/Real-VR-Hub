var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var VrProject = require("./models/projects");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var commentRoutes = require("./routes/comments");
var projectRoutes = require("./routes/projects");
var indexRoutes =  require("./routes/index")

// seedDB();

const PORT = 3000;


mongoose.connect("mongodb://localhost/vr_projects");
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/fonts", express.static(__dirname + "/fonts"))
//PASSPORT
app.use(require("express-session")({
  secret: "Virtual Reality is the future of technology.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})


app.set("view engine", "ejs");



app.use(indexRoutes);
app.use(commentRoutes);
app.use("/projects", projectRoutes);



app.listen(PORT, function() {
    console.log("VR HuB Server Has Started");
});
