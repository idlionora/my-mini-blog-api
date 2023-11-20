const Blogpost = require("../models/blogpostModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createBlogpost = catchAsync(async (req, res, next) => {
  const newBlogpost = await Blogpost.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      blogpost: newBlogpost,
    },
  });
});

exports.getAllBlogposts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Blogpost.find(), req.query)
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
  const blogpost = await Blogpost.findById(req.params.id);

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
  const blogpost = await Blogpost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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
