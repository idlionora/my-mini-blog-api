const mongoose = require("mongoose");
const slugify = require("slugify");

const blogpostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A blogpost must have a title"],
    trim: true,
    minLength: [
      4,
      "A blogpost must have a title more than or equal to 4 characters",
    ],
    unique: true,
  },
  slug: String,
  thumbnail: String,
  banner: String,
  content: {
    type: String,
    required: [true, "A blogpost must have some text content"],
    trim: true,
    minLength: [
      26,
      "Blog content must have more than or equal to 26 characters",
    ],
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // select: false,
  },
  user: {
    type: String,
    required: [true, "A blogpost must be attached to user who writes it"],
  },
});

blogpostSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = Blogpost;
