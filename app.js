var express = require("express");
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const PORT = 3000;
mongoose.connect("mongodb://localhost/vr_projects");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/fonts", express.static(__dirname + "/fonts"))

// <link rel='stylesheet' href='/style.css' />

//SCHEMA SETUP

var VrSchema = new mongoose.Schema({
    name: String,
    image: String,
    project: String
});

var VrProject = mongoose.model("VrProject", VrSchema);

// VrProject.create({
//     name: "granite hill",
//     image: "http://az616578.vo.msecnd.net/files/2016/05/13/635987791255837195-1892917331_Camping-Near-The-Lake-Background-Wallpaper.jpg",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite."
// }, function(err, campground) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND");
//         console.log(campground);
//     }
// })

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.redirect("projects");
})

app.get("/projects", function(req, res) {
    VrProject.find({}, function(err, projects) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                projects: projects
            })
        };
    })
})

app.post("/projects", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var project = req.body.project;
    var newVrProject = {
        name: name,
        image: image,
        project: project
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
    res.render("new.ejs")
})

app.get("/projects/:id", function(req, res) {
    res.render("show")
})

app.get("/login", function(req, res) {
    res.render("login")
})





app.listen(PORT, function() {
    console.log("YelpCamp Server Has Started");
});
