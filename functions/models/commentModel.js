const mongoose = require("mongoose");
const Blogpost = require("./blogpostModel");

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

commentSchema.index({ blogpost: 1, createdAt: 1 });
commentSchema.index({ user: 1 });

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: "blogpost", select: "title" });
  next();
});

commentSchema.pre(/^find/, function (next) {
  if (!this._conditions.user) {
    this.populate({
      path: "user",
      select: "name photo",
    });
  }
  next();
});

commentSchema.statics.calcCommentsPerPost = async function (blogpostId) {
  const commentCount = await this.aggregate([
    {
      $match: { blogpost: blogpostId },
    },
    {
      $group: {
        _id: null,
        commentsNum: { $sum: 1 },
      },
    },
  ]);
  return commentCount[0].commentsNum;
};

commentSchema.post("save", async function () {
  if (this.createdAt.toISOString() === this.updatedAt.toISOString()) {
    const commentsNum = await this.constructor.calcCommentsPerPost(
      this.blogpost,
    );
    await Blogpost.findByIdAndUpdate(this.blogpost, {
      commentCount: commentsNum,
    });
  }
});

commentSchema.pre("findOneAndDelete", async function (next) {
  const deletedComment = await this.findOne().clone();
  const commentsNum = await deletedComment.constructor.calcCommentsPerPost(
    deletedComment.blogpost._id,
  );
  await Blogpost.findByIdAndUpdate(deletedComment.blogpost._id, {
    commentCount: commentsNum - 1,
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
