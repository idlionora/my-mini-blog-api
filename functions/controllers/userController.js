const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const cloudinaryUploadStream = require("../utils/cloudinaryUploadStream");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const filterObj = require("../utils/filterObj");
const validateUnique = require("../utils/validateUnique");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const maxSize = 2 * 1000 * 1000;

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: maxSize },
});

exports.uploadUserPhotoToMemory = upload.single("photo");

exports.uploadUserPhotoToCloud = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  if (req.body.email) {
    const isNewEmailUnique = await validateUnique("email", req.body.email);
    if (!isNewEmailUnique) return next();
  }

  const prevEmail = req.user.email.split("@")[0];
  const emailName = req.body.email ? req.body.email.split("@")[0] : prevEmail;

  if (req.user.photo !== "/my-mini-blog/user/default.jpg") {
    await cloudinary.uploader.destroy(`my-mini-blog/user/${prevEmail}`, {
      invalidate: true,
    });
  }

  const sharpPhoto = await sharp(req.file.buffer)
    .resize(200, 200, {
      fit: "cover",
    })
    .toFormat("jpeg")
    .jpeg({ mozjpeg: true })
    .keepExif()
    .toBuffer();

  const result = await cloudinaryUploadStream(
    sharpPhoto,
    emailName,
    "my-mini-blog/user",
  );

  const urlArr = result.url.split("/");
  req.body.photo = `/${urlArr.slice(urlArr.length - 4).join("/")}`;
  next();
});

exports.updatePhotoWhenEmailsChanged = catchAsync(async (req, res, next) => {
  if (
    req.file ||
    !req.body.email ||
    req.user.photo === "/my-mini-blog/user/default.jpg"
  ) {
    return next();
  }
  const isNewEmailUnique = await validateUnique("email", req.body.email);
  if (!isNewEmailUnique) return next();

  const prevEmail = req.user.email.split("@")[0];
  const currentEmail = req.body.email.split("@")[0];
  const renamedFile = await cloudinary.uploader.rename(
    `my-mini-blog/user/${prevEmail}`,
    `my-mini-blog/user/${currentEmail}`,
    {
      invalidate: true,
    },
  );
  const urlArr = renamedFile.url.split("/");
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
