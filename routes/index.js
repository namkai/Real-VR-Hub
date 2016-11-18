var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");
var VrProject = require("../models/projects")
router.get("/", function(req, res) {
    res.redirect("projects");
})

router.get("/login", function(req, res) {
    res.render("projects/login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/login"
}), function(req, res) {});

router.get("/register", function(req, res) {
    res.render("projects/register");
})

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            // req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            //  req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/projects");
        });
    });
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/projects")
})


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;
