const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");

exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.body.blogpost) req.body.blogpost = req.params.blogpostId;
  if (!req.body.user) req.body.user = req.user.id;

  const newComment = await Comment.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.blogpostId) filter.blogpost = req.params.blogpostId;
  const comments = await Comment.find(filter);

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: comments,
  });
});
