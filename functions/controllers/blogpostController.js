const Blogpost = require("../models/blogpostModel");
const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.setCreateBlogpostUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createBlogpost = factory.createOne(Blogpost);

exports.getAllTags = catchAsync(async (req, res, next) => {
  const tags = await Blogpost.distinct("tags");

  res.status(200).json({
    status: "success",
    data: {
      tags,
    },
  });
});

exports.setSearchBlogpostsTags = (req, res, next) => {
  if (req.params.tag.includes(",")) {
    const tagsParam = req.params.tag
      .replace(/, /g, ",")
      .split(",")
      .filter((tagName) => tagName.length > 0);

    req.query.tags = { $all: tagsParam };
  } else {
    req.query.tags = req.params.tag;
  }
  next();
};

const allBlogpostsPopOptions = [
  {
    path: "user",
    select: "name",
  },
];
exports.getAllBlogposts = factory.getAll(Blogpost, allBlogpostsPopOptions);

const blogpostPopOptions = [
  {
    path: "user",
    select: "name photo",
  },
  "comments",
];
exports.getBlogpost = factory.getOne(Blogpost, blogpostPopOptions);
exports.updateBlogpost = factory.updateOneForUserOnly(Blogpost);

exports.deleteBlogpostComments = catchAsync(async (req, res, next) => {
  await Comment.deleteMany({ blogpost: req.params.id });
  next();
});
exports.deleteBlogpost = factory.deleteOne(Blogpost);
