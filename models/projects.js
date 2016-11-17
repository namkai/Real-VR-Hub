var mongoose = require("mongoose");


var VrSchema = new mongoose.Schema({
    name: String,
    image: String,
    project: String,
    description: String,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
});

module.exports = mongoose.model("VrProject", VrSchema);
