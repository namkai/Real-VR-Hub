var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var VrProject = require("../models/projects")

router.get("/", function(req, res) {
    VrProject.find({}, function(err, projects) {
        if (err) {
            console.log(err);
        } else {
            res.render("projects/index", {
                projects: projects,
                currentUser: req.user
            })
        };
    })
})

router.post("/", function(req, res) {
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

router.get("/new", isLoggedIn,function(req, res) {
    res.render("projects/new.ejs")
})

router.get("/:id", function(req, res) {
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

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  else {
    res.redirect("/login");
  }
}


module.exports = router;
