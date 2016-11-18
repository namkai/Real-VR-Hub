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
var passportLocalMongoose = require("passport-local-mongoose")

seedDB();

const PORT = 3000;


mongoose.connect("mongodb://localhost/vr_projects");
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/fonts", express.static(__dirname + "/fonts"))
app.use(passport.initialize());
app.use(passport.session());


app.use(require("express-session")({
  secret: "Virtual Reality is the future of technology.",
  resave: false,
  saveUninitialized: false
}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");


// ==============
// ROUTES
// ==============

app.get("/", function(req, res) {
    res.redirect("projects");
})

app.get("/projects", function(req, res) {
    VrProject.find({}, function(err, projects) {
        if (err) {
            console.log(err);
        } else {
            res.render("projects/index", {
                projects: projects
            })
        };
    })
})

app.post("/projects", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var project = req.body.project;
    var description = req.body.description;
    var newVrProject = {
        name: name,
        image: image,
        project: project,
        description: description
    }
    VrProject.create(newVrProject, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/projects");
        }
    })
})

app.get("/projects/new", function(req, res) {
    res.render("projects/new.ejs")
})

app.get("/projects/:id", function(req, res) {
    VrProject.findById(req.params.id).populate("comments").exec(function(err, foundProject) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundProject);
            res.render("projects/show", {
                project: foundProject
            })
        }
    })
})

app.get("/projects/:id/comments/new", function(req, res) {
    VrProject.findById(req.params.id, function(err, project) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                project: project
            })
        }
    })
})

app.post("/projects/:id/comments", function(req, res) {
    VrProject.findById(req.params.id, function(err, project) {
        if (err) {
            console.log(err);
            res.redirect("/projects")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    project.comments.push(comment);
                    project.save();
                    res.redirect('/projects/' + project._id);
                }
            })
        }
    })
})

app.get("/login", function(req, res) {
    res.render("projects/login")
})

app.post("/login", passport.authenticate("local", {
  successRedirect: "./projects",
  failureRedirect: "./login"
}) ,function(req, res){
  console.log("you did it!");
});

app.get("/register", function(req, res){
  res.render("projects/register");
})

app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err) {
        console.log(err);
        res.redirect("register")
      } else {
        passport.authenticate("local")(req, res, function(){
          res.render("projects/index")
        })
      }
    });
});

app.get("/logout", function(req, res){
  console.log("You logged out fool!");
})


app.listen(PORT, function() {
    console.log("VR HuB Server Has Started");
});
