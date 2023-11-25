const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: [true, "Comment can not be empty!"] },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    blogpost: {
      type: mongoose.Schema.ObjectId,
      ref: "Blogpost",
      required: [true, "Comment must belong to a blogpost."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must be attached to a user who writes it."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
