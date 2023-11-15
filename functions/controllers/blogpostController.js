const Blogpost = require("../models/blogpostModel");
const APIFeatures = require("../utils/apiFeatures");

exports.createBlogpost = async (req, res) => {
  try {
    const newBlogpost = await Blogpost.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        blogpost: newBlogpost,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllBlogposts = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getBlogpost = async (req, res) => {
  try {
    const blogpost = await Blogpost.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        blogpost,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateBlogpost = async (req, res) => {
  try {
    const blogpost = await Blogpost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        blogpost,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteBlogpost = async (req, res) => {
  try {
    await Blogpost.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
