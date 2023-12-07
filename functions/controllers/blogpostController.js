const multer = require("multer");
const sharp = require("sharp");
const cloudinaryUploadStream = require("../utils/cloudinaryUploadStream");
const Blogpost = require("../models/blogpostModel");
const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const maxSize = 6 * 1000 * 1000;

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: maxSize },
});

exports.uploadBlogpostImages = upload.fields([
  { name: "bannerImg", maxCount: 1 },
  { name: "blogpostImg", maxCount: 1 },
]);

exports.setImgUpdatesFalse = (req, res, next) => {
  req.body.blogpostImgUpdate = false;
  req.body.bannerImgUpdate = false;
  next();
};

function getImageSize({ width, height, orientation }) {
  return (orientation || 0) >= 5
    ? { width: height, height: width }
    : { width, height };
}

exports.uploadBannerImgToCloud = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.bannerImg) return next();
  req.body.bannerImgUpdate = true;

  const bannerImgBuffer = req.files.bannerImg[0].buffer;
  const imgSize = getImageSize(await sharp(bannerImgBuffer).metadata());
  let sharpBuffer;

  if (imgSize.width / imgSize.height < 16 / 9) {
    sharpBuffer = await sharp(bannerImgBuffer)
      .resize(1920, 1080, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 90, mozjpeg: true })
      .keepExif()
      .toBuffer();
  } else {
    sharpBuffer = await sharp(bannerImgBuffer)
      .resize(1920, 1080, { fit: "inside" })
      .toFormat("jpeg")
      .jpeg({ quality: 90, mozjpeg: true })
      .keepExif()
      .toBuffer();
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const dateMilliseconds = new Date().getMilliseconds();

  const bannerUploaded = await cloudinaryUploadStream(
    sharpBuffer,
    `banner-${req.params.id}_${currentDate}-${dateMilliseconds}`,
    "my-mini-blog/banner_img",
  );

  const urlArr = bannerUploaded.url.split("/");
  req.body.bannerImg = `/${urlArr.slice(urlArr.length - 4).join("/")}`;
  next();
});

exports.uploadBlogpostImgToCloud = (req, res, next) => {
  if (!req.files || !req.files.BlogpostImg) return next();

  next();
};

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
