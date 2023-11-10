exports.checkID = (req, res, next, val) => {
  console.log(`Blogpost id is: ${val}.`);
  if (req.params.id * 1 > 99) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.getAllBlogposts = (req, res) => {
  res.status(200).json({
    status: "success",
    results: "data.length",
    data: "Insert many many posts here",
  });
};

exports.getBlogpost = (req, res) => {
  res.status(200).json({ status: "success", data: "Here is one post" });
};
