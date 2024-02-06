const Tag = require("../models/tagModel");
const Blogpost = require("../models/blogpostModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const APIFeatures = require("../utils/apiFeatures");

exports.createTag = factory.createOne(Tag);

/** UPDATING FROM BLOGPOST'S TAGS **/

async function inputTagIntoDB(tag, blogpostId) {
  const selectedTag = await Tag.findOne({ tag });

  if (selectedTag) {
    selectedTag.blogposts.push(blogpostId);
    await selectedTag.save();
  } else {
    await Tag.create({ tag, blogposts: [blogpostId] });
  }

  return 0;
}

async function deleteTagFromDB(tag, blogpostId) {
  const selectedTag = await Tag.findOne({ tag });

  if (!selectedTag) {
    return 1;
  }

  if (!selectedTag.blogposts.includes(blogpostId)) {
    return 1;
  }

  if (selectedTag.blogposts.length < 2) {
    await selectedTag.deleteOne();
    return 0;
  }

  selectedTag.blogposts.splice(selectedTag.blogposts.indexOf(blogpostId), 1);
  return 0;
}

function parseToTagArr(tagsInput) {
  if (typeof tagsInput === "string" && tagsInput.includes("[")) {
    return JSON.parse(tagsInput);
  }
  if (typeof tagsInput === "string") {
    return [tagsInput];
  }
  return tagsInput;
}

exports.updateTagsFromNewPost = catchAsync(async (req, res, next) => {
  if (!req.body.tags) return next();

  req.body.tags = parseToTagArr(req.body.tags);
  const tagArr = [...req.body.tags];

  const tagPromises = tagArr.map((tag) => inputTagIntoDB(tag, req.body._id));
  await Promise.all(tagPromises);

  next();
});

exports.updateTagsFromEdittedPost = catchAsync(async (req, res, next) => {
  if (!req.body.tags) return next();

  // Prepare tag arrays to compare
  const prevBlogpost = await Blogpost.findById(req.params.id);
  const prevTags = prevBlogpost.tags || [];

  req.body.tags = parseToTagArr(req.body.tags);
  const currentTags = [...req.body.tags];

  // Separate which tags to delete and add
  const tagsToDelete = [];
  const tagsToAdd = [];

  prevTags.forEach((prevTag) => {
    if (!currentTags.includes(prevTag)) {
      tagsToDelete.push(prevTag);
    }
  });
  currentTags.forEach((tag) => {
    if (!prevTags.includes(tag)) {
      tagsToAdd.push(tag);
    }
  });

  // Update Tag documents in DB
  const deletionPromises = tagsToDelete.map((tag) =>
    deleteTagFromDB(tag, req.params.id),
  );
  const additionPromises = tagsToAdd.map((tag) =>
    inputTagIntoDB(tag, req.params.id),
  );
  const allTagPromises = deletionPromises.concat(additionPromises);
  await Promise.all(allTagPromises);

  next();
});

/** TAG MODEL'S DIRECT CONTROLLER **/

exports.setBlogpostIdSearch = (req, res, next) => {
  if (req.params.blogpostId) {
    req.query.blogposts = req.params.blogpostId;
  }
  req.query.sort = "tag";
  next();
};

exports.setSearchOperatorsToQuery = (req, res, next) => {
  if (req.query.tag && req.query.tag.includes(",")) {
    const tagsArr = req.query.tag
      .replace(/, /g, ",")
      .split(",")
      .filter((tagName) => tagName.length > 0);
    req.query.tag = { $in: tagsArr };
  }

  if (req.query.blogposts && req.query.blogposts.includes(",")) {
    const blogsArr = req.query.blogposts
      .replace(/, /g, ",")
      .split(",")
      .filter((blogpostId) => blogpostId.length > 0);
    req.query.blogposts = { $all: blogsArr };
  }

  next();
};

exports.getAllTags = catchAsync(async (req, res, next) => {
  const tagQuery = Tag.find();

  if (req.query.populate === "true") {
    tagQuery.populate({
      path: "blogposts",
      select: "title summary slug blogthumbImg user",
    });
  }
  req.query.populate = undefined;

  const features = new APIFeatures(tagQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  res.status(200).json({
    status: "success",
    results: doc.length,
    data: doc,
  });
});

exports.getTag = factory.getOne(Tag);
exports.updateTag = factory.updateOne(Tag);
exports.deleteTag = factory.deleteOne(Tag);
