const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const { uploadToMemory: upload } = require("../utils/multerImage");
const cloudinaryUploadStream = require("../utils/cloudinaryUploadStream");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObj = require("../utils/filterObj");
const factory = require("./handlerFactory");

const maxSize = 3 * 1000 * 1000;

exports.uploadUserPhotoToMemory = upload(maxSize).single("photo");

exports.uploadUserPhotoToCloud = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  if (req.user.photo !== "/my-mini-blog/user/default.jpg") {
    await cloudinary.uploader.destroy(
      `my-mini-blog/user/profile-${req.user.id}`,
      {
        invalidate: true,
      },
    );
  }
  req.body.photo = "/my-mini-blog/user/default.jpg";

  const sharpPhoto = await sharp(req.file.buffer)
    .resize(200, 200, {
      fit: "cover",
    })
    .toFormat("jpeg")
    .jpeg({ quality: 90, mozjpeg: true })
    .keepExif()
    .toBuffer();

  const result = await cloudinaryUploadStream(
    sharpPhoto,
    `profile-${req.user.id}`,
    "my-mini-blog/user",
  );

  const urlArr = result.url.split("/");
  req.body.photo = `/${urlArr.slice(urlArr.length - 4).join("/")}`;
  next();
});

exports.setNameParamToSearchUser = (req, res, next) => {
  if (req.params.nameRegex) {
    req.query.name = { regex: req.params.nameRegex };
    req.query.fields = "name";
    req.query.sort = "name";
  }
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400,
      ),
    );
  }

  const filteredBody = filterObj(req.body, "name", "email", "photo");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = factory.deleteOne(User);
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
