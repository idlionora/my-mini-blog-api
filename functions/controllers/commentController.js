const Comment = require("../models/commentModel");
const factory = require("./handlerFactory");

exports.setCreateCommentRequiredIds = (req, res, next) => {
  if (!req.body.blogpost) req.body.blogpost = req.params.blogpostId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createComment = factory.createOne(Comment);

exports.setSearchCommentsBlogpostId = (req, res, next) => {
  if (req.params.blogpostId) req.query.blogpost = req.params.blogpostId;
  next();
};
exports.getAllComments = factory.getAll(Comment);

exports.getComment = factory.getOne(Comment);
exports.updateComment = factory.updateOneForUserOnly(Comment);
exports.deleteComment = factory.deleteOne(Comment);
