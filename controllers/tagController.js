const Tag = require("../models/tagModel");
const Blogpost = require("../models/blogpostModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const APIFeatures = require("../utils/apiFeatures");

exports.createTag = factory.createOne(Tag);

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

exports.setBlogpostIdSearch = (req, res, next) => {
  if (req.params.blogpostId) {
    req.query.blogposts = req.params.blogpostId;
  }
  req.query.sort = "tag";
  next();
};

// function addOperatorToTags(tagQuery, operator) {
//   console.log(`tagQuery ${operator}: `, tagQuery);
//   if (tagQuery.includes(",")) {
//     const tagsArr = tagQuery
//       .replace(/, /g, ",")
//       .split(",")
//       .filter((tagName) => tagName.length > 0);

//     let queryInsert;

//     // { {operator}: tagsArr };
//     // console.log("queryInsert1", queryInsert);
//     // queryInsert = JSON.stringify(queryInsert).replace(
//     //   operator,
//     //   (match) => `$${match}`,
//     // );
//     // console.log("queryInsert2", queryInsert)
//     // queryInsert = JSON.parse(queryInsert);

//     return queryInsert;
//   }
//   return tagQuery;
// }

// exports.setTagQueryWithOperators = (req, res, next) => {
//   // normal behavior is returning union search if multiple tags provided
//   req.query.tag = addOperatorToTags(req.query.tag, "in");

//   if (!req.query["tag[in]"] || !req.query["tag[all]"]) {
//     return next();
//   }

//   // adding $in operator to get result for union search
//   req.query.tag = addOperatorToTags(req.query["tag[in]"], "in");

//   // adding $all operator to get result for slice search, override union search
//   req.query.tag = addOperatorToTags(req.query["tag[all]"], "all");

//   next();
// };

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
