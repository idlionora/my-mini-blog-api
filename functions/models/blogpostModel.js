const mongoose = require("mongoose");
const slugify = require("slugify");

const blogpostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A blogpost must have a title."],
      trim: true,
      minLength: [
        4,
        "A blogpost must have a title more than or equal to 4 characters.",
      ],
      unique: true,
    },
    slug: { type: String, unique: true },
    blogpostImg: {
      type: String,
      default: "my-mini-blog/post_img/default.jpg",
    },
    blogthumbImg: {
      type: String,
      default: "my-mini-blog/thumb_img/default.jpg",
    },
    bannerImg: {
      type: String,
      default: "my-mini-blog/banner_img/default.jpg",
    },
    content: {
      type: String,
      required: [true, "A blogpost must have some text content."],
      trim: true,
      minLength: [
        26,
        "Blog content must have more than or equal to 26 characters.",
      ],
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A blogpost must be attached to user who writes it."],
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

blogpostSchema.index({ user: 1 });

blogpostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "blogpost",
  localField: "_id",
});

blogpostSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = Blogpost;
