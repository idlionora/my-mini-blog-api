const express = require("express");
const blogpostController = require("../controllers/blogpostController");

const router = express.Router();

router
  .route("/")
  .get(blogpostController.getAllBlogposts)
  .post(blogpostController.createBlogpost);
router
  .route("/:id")
  .get(blogpostController.getBlogpost)
  .patch(blogpostController.updateBlogpost)
  .delete(blogpostController.deleteBlogpost);

module.exports = router;
