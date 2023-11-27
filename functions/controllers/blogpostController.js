const Blogpost = require("../models/blogpostModel");
const factory = require("./handlerFactory");

exports.setCreateBlogpostUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createBlogpost = factory.createOne(Blogpost);

const allBlogpostsPopOptions = [
  {
    path: "user",
    select: "name",
  },
];
exports.getAllBlogposts = factory.getAll(Blogpost, allBlogpostsPopOptions);

const blogpostPopOptions = [
  {
    path: "user",
    select: "name photo",
  },
  "comments",
];
exports.getBlogpost = factory.getOne(Blogpost, blogpostPopOptions);
exports.updateBlogpost = factory.updateOneForUserOnly(Blogpost);
exports.deleteBlogpost = factory.deleteOne(Blogpost);
