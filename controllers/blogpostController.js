const { uploadToMemory } = require("../utils/multerImage");
const {
  uploadImgToCloudinary,
  getImgUrl,
} = require("./blogpostControllerFunc");
const ImgBufferGenerator = require("../utils/imgBufferGenerator");
const Blogpost = require("../models/blogpostModel");
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

  const identifier = { flag: "banner", modelId: req.params.id };
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

  const postImgId = { flag: "blogpost", modelId: req.params.id };
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

exports.deleteBlogpostComments = catchAsync(async (req, res, next) => {
  await Comment.deleteMany({ blogpost: req.params.id });
  next();
});
exports.deleteBlogpost = factory.deleteOne(Blogpost);
