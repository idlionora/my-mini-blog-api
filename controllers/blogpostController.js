const mongoose = require("mongoose");
const { uploadToMemory } = require("../utils/multerImage");
const {
  uploadImgToCloudinary,
  getImgUrl,
} = require("./blogpostControllerFunc");
const ImgBufferGenerator = require("../utils/imgBufferGenerator");
const Blogpost = require("../models/blogpostModel");
const Tag = require("../models/tagModel");
const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const maxSize = 6 * 1000 * 1000;
exports.uploadBlogpostImages = uploadToMemory(maxSize).fields([
  { name: "bannerImg", maxCount: 1 },
  { name: "blogpostImg", maxCount: 1 },
]);

exports.setImgUpdatesFalse = (req, res, next) => {
  req.body.blogpostImgUpdate = false;
  req.body.bannerImgUpdate = false;
  next();
};

exports.uploadBannerImgToCloud = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.bannerImg) return next();
  req.body.bannerImgUpdate = true;

  const bannerImgSource = new ImgBufferGenerator(req.files.bannerImg[0].buffer);
  const outputSize = { width: 1920, height: 1080 };
  const bannerImgBuffer =
    await bannerImgSource.generateImgBufferPrioritizeWidth(outputSize);

  const identifier = { flag: "banner", modelId: req.params.id || req.body._id };
  const bannerUploaded = await uploadImgToCloudinary(
    bannerImgBuffer,
    identifier,
  );

  req.body.bannerImg = getImgUrl(bannerUploaded);
  next();
});

exports.uploadBlogpostImgToCloud = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.blogpostImg) return next();
  req.body.blogpostImgUpdate = true;

  const imgSource = new ImgBufferGenerator(req.files.blogpostImg[0].buffer);

  const postImgSize = { width: 600, height: 400 };
  const postImgBuffer =
    await imgSource.generateImgBufferPrioritizeWidth(postImgSize);

  const postImgId = {
    flag: "blogpost",
    modelId: req.params.id || req.body._id,
  };
  const postImgUploaded = await uploadImgToCloudinary(postImgBuffer, postImgId);
  req.body.blogpostImg = getImgUrl(postImgUploaded);

  const thumbImgSize = { width: 250, height: 200 };
  const thumbImgBuffer = await imgSource.getSharpBuffer(thumbImgSize, "cover");

  const thumbImgId = { flag: "blogthumb", modelId: req.params.id };
  const thumbImgUploaded = await uploadImgToCloudinary(
    thumbImgBuffer,
    thumbImgId,
  );
  req.body.blogthumbImg = getImgUrl(thumbImgUploaded);

  next();
});

exports.setCreateBlogpostUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  req.body._id = new mongoose.mongo.ObjectId();
  next();
};
exports.createBlogpost = factory.createOne(Blogpost);

// exports.getAllTags = catchAsync(async (req, res, next) => {
//   const tags = await Blogpost.distinct("tags");

//   res.status(200).json({
//     status: "success",
//     data: {
//       tags,
//     },
//   });
// });

// exports.setSearchBlogpostsTags = (req, res, next) => {
//   if (req.params.tag.includes(",")) {
//     const tagsParam = req.params.tag
//       .replace(/, /g, ",")
//       .split(",")
//       .filter((tagName) => tagName.length > 0);

//     req.query.tags = { $all: tagsParam };
//   } else {
//     req.query.tags = req.params.tag;
//   }
//   next();
// };

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

exports.deleteBlogpostTags = catchAsync(async (req, res, next) => {
  // Fetch documents which blogpost's id had listed
  const selectedTags = await Tag.find({ blogposts: req.params.id });
  const numOfTags = selectedTags.length;

  // Separate which tags to delete and update
  const tagsToDelete = [];
  const tagsToUpdate = [];
  for (let i = 0; i < numOfTags; i += 1) {
    if (selectedTags[i].blogposts.length < 2) {
      tagsToDelete.push(selectedTags[i]);
    } else {
      const spliceIndex = selectedTags[i].blogposts.indexOf(req.params.id);
      selectedTags[i].blogposts.splice(spliceIndex, 1);
      tagsToUpdate.push(selectedTags[i]);
    }
  }

  // Prepare for bulkWrite (underscore symbol is important)
  const bulkWriteArr = [];
  tagsToDelete.forEach((tag) => {
    bulkWriteArr.push({ deleteOne: { filter: { _id: tag._id } } });
  });
  tagsToUpdate.forEach((tag) => {
    bulkWriteArr.push({
      updateOne: {
        filter: { _id: tag._id },
        update: { $set: { blogposts: tag.blogposts } },
      },
    });
  });
  await Tag.bulkWrite(bulkWriteArr);
  next();
});

exports.deleteBlogpostComments = catchAsync(async (req, res, next) => {
  await Comment.deleteMany({ blogpost: req.params.id });
  next();
});

exports.deleteBlogpost = factory.deleteOne(Blogpost);
