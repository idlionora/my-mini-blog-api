const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
// const slugify = require("slugify");

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
    summary: {
      type: String,
      trim: true,
    },
    slug: { type: String, unique: true },
    blogpostImg: {
      type: String,
      default: "/my-mini-blog/blogpost_img/default.jpg",
    },
    blogthumbImg: {
      type: String,
      default: "/my-mini-blog/blogthumb_img/default.jpg",
    },
    bannerImg: {
      type: String,
      default: "/my-mini-blog/banner_img/default.jpg",
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
    blogpostImgUpdate: {
      type: Boolean,
      default: false,
      select: false,
    },
    bannerImgUpdate: {
      type: Boolean,
      default: false,
      select: false,
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

// blogpostSchema.pre("save", function (next) {
//   this.slug = slugify(this.title, { lower: true, strict: true });
//   next();
// });

blogpostSchema.pre(/^find/, function (next) {
  if (!this._mongooseOptions.populate) {
    this.populate({ path: "user", select: "name" });
  }
  next();
});

async function tagCycleImg(doc, itemFlag) {
  if (doc[`${itemFlag}Img`] === `/my-mini-blog/${itemFlag}_img/default/jpg`) {
    return;
  }
  const destroyTag = `${itemFlag}-${doc.id}-destroynext`;

  await cloudinary.api.delete_resources_by_tag(destroyTag, {
    invalidate: true,
  }); // indiscriminate delete to all directories, tag carefully!

  const pathArray = doc[`${itemFlag}Img`]
    .slice(1)
    .replace(".jpg", "")
    .split("/");
  const cloudFilename = pathArray.slice(1).join("/");

  cloudinary.uploader.add_tag([destroyTag, doc.id], [cloudFilename]);
}

blogpostSchema.post("save", async function () {
  if (!this.bannerImgUpdate && !this.blogpostImgUpdate) return;
  let itemFlags = [];

  if (this.blogpostImgUpdate) itemFlags = ["blogpost", "blogthumb"];
  if (this.blogpostImgUpdate) itemFlags.push("banner");

  itemFlags.map((flag) => tagCycleImg(this, flag));
  Promise.all(itemFlags);
});

const Blogpost = mongoose.model("Blogpost", blogpostSchema);

module.exports = Blogpost;
