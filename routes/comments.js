var express = require("express");
var router = express.Router();
var VrProject = require("../models/projects")
var Comment = require("../models/comment")
var User = require("../models/user")

router.get("/projects/:id/comments/new", isLoggedIn, function(req, res) {
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

router.post("/projects/:id/comments", isLoggedIn, function(req, res) {
    VrProject.findById(req.params.id, function(err, project) {
        if (err) {
            console.log(err);
            res.redirect("/projects")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    project.comments.push(comment);
                    project.save();
                    res.redirect('/projects/' + project._id);
                }
            })
        }
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;
