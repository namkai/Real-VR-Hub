var mongoose = require("mongoose");
var VrProject = require("./models/projects.js")
var Comment = require("./models/comment.js")

var data = [{
    name: "A-Painter",
    image: "https://camo.githubusercontent.com/7a2341b675aa2eb0c364d36a4666213d812a2df6/68747470733a2f2f626c6f672e6d6f7a76722e636f6d2f636f6e74656e742f696d616765732f323031362f30392f6c6f676f5f612d7061696e7465725f686967682d6e6f6272616e64732e6a7067",
    project: "https://aframe.io/a-painter/",
    description: "Paint in 3D with your HTC Vive!"
}, {
    name: "A-Frame",
    image: "https://aframe.io/images/blog/introducing-aframe.png",
    project: "https://aframe.io/",
    description: "Framework full of useful VR design tools"
}, {
    name: "Equirectangular Images!",
    image: "http://3.bp.blogspot.com/-nKsvHDKHNvY/Usrb398L_CI/AAAAAAAALIU/ssDn6p7sRQc/s1600/bergsjostolen.jpg",
    project: "https://threejs.org/examples/webgl_panorama_equirectangular",
    description: "See your panoramic images in VR!"
}];


function seedDB() {
    VrProject.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("removed VR Projects");
        data.forEach(function(seed) {
            VrProject.create(seed, function(err, project) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a Project");
                    Comment.create({
                        text: "What a cool project!",
                        author: "Namkai"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            project.comments.push(comment);
                            project.save();
                            console.log("new comment");
                        }
                    });
                }
            })
        })
    });
}



module.exports = seedDB;
