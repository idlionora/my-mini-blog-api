const Tag = require("../models/tagModel");
const factory = require("./handlerFactory");

exports.createTag = factory.createOne(Tag);

exports.setBlogpostIdSearch = (req, res, next) => {
  if (req.params.blogpostId) {
    req.query.blogposts = req.params.blogpostId;
  }
  req.query.sort = "tag";
  next();
};
exports.getAllTags = factory.getAll(Tag);
exports.getTag = factory.getOne(Tag);
exports.updateTag = factory.updateOne(Tag);
exports.deleteTag = factory.deleteOne(Tag);
