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
  req.query.sort = "createdAt";
  next();
};

const commentPopOptions = [
  {
    path: "blogpost",
    select: "title",
  },
];
exports.getAllComments = factory.getAll(Comment, commentPopOptions);
exports.getComment = factory.getOne(Comment, commentPopOptions);
exports.updateComment = factory.updateOneForUserOnly(Comment);
exports.deleteComment = factory.deleteOne(Comment);
