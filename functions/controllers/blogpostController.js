const Blogpost = require("../models/blogpostModel");

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
      message: err,
    });
  }
};

exports.getAllBlogposts = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (queryObj.createdAt) {
      const timingKeys = Object.keys(queryObj.createdAt);
      timingKeys.forEach((key) => {
        queryObj.createdAt[key] = new Date(`${queryObj.createdAt[key]}`);
      });
    }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`,
    );

    let query = Blogpost.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const blogposts = await query;

    res.status(200).json({
      status: "success",
      results: blogposts.length,
      data: blogposts,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
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
