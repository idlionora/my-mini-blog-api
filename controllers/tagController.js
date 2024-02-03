const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createTag = factory.createOne(Tag);

async function inputTagIntoDB(tag, blogpostId) {
  let currentTag = await Tag.findOne({ tag });

  if (currentTag) {
    currentTag.blogposts.push(blogpostId);
    await currentTag.save();
  } else {
    currentTag = await Tag.create({ tag, blogposts: [blogpostId] });
  }

  return {
    status: "success",
    data: currentTag,
  };
}

exports.updateTagFromNewPost = catchAsync(async (req, res, next) => {
  if (!req.body.tags) next();

  let tagArr = [];
  if (typeof req.body.tags === "string" && req.body.tags.includes("[")) {
    req.body.tags = JSON.parse(req.body.tags);
  } else if (typeof req.body.tags === "string") {
    req.body.tags = [req.body.tags];
  }
  tagArr = [...req.body.tags];

  const tagPromises = tagArr.map((tag) => inputTagIntoDB(tag, req.body._id));
  await Promise.all(tagPromises);
  next();
});

exports.setBlogpostIdSearch = (req, res, next) => {
  if (req.params.blogpostId) {
    req.query.blogposts = req.params.blogpostId;
  }
  req.query.sort = "tag";
  next();
};
exports.getAllTags = factory.getAll(Tag);
exports.getTag = factory.getOne(Tag);
exports.updateTag = factory.updateOne(Tag);
exports.deleteTag = factory.deleteOne(Tag);
