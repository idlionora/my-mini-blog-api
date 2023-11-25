const Blogpost = require("../models/blogpostModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createBlogpost = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  const newBlogpost = await Blogpost.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      blogpost: newBlogpost,
    },
  });
});

exports.getAllBlogposts = catchAsync(async (req, res, next) => {
  if (req.params.userId) req.query.user = req.params.userId;
  const features = new APIFeatures(
    Blogpost.find().populate({
      path: "user",
      select: "name",
    }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogposts = await features.query;

  res.status(200).json({
    status: "success",
    results: blogposts.length,
    data: blogposts,
  });
});

exports.getBlogpost = catchAsync(async (req, res, next) => {
  const blogpost = await Blogpost.findById(req.params.id)
    .populate({
      path: "user",
      select: "name photo",
    })
    .populate("comments");

  if (!blogpost) {
    return next(new AppError("No blogpost found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      blogpost,
    },
  });
});

exports.updateBlogpost = catchAsync(async (req, res, next) => {
  const blogpost = await Blogpost.findById(req.params.id);

  if (!blogpost) {
    return next(new AppError("No blogpost found with that ID", 404));
  }

  if (req.user.id !== blogpost.user && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403),
    );
  }

  Object.keys(req.body).forEach((key) => {
    blogpost[key] = req.body[key];
  });

  if (req.user.role !== "admin") {
    blogpost.user = req.user.id;
  }

  blogpost.updatedAt = Date.now();
  await blogpost.save({ validateBeforeSave: true });

  res.status(200).json({
    status: "success",
    data: {
      blogpost,
    },
  });
});

exports.deleteBlogpost = catchAsync(async (req, res, next) => {
  const blogpost = await Blogpost.findByIdAndDelete(req.params.id);

  if (!blogpost) {
    return next(new AppError("No blogpost found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
