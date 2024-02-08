const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: [true, "Tag cannot be empty!"],
      unique: true,
    },
    blogposts: [{ type: mongoose.Schema.ObjectId, ref: "Blogpost" }],
  },
  {
    versionKey: false,
  },
);

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
