const express = require("express");
const blogpostController = require("../controllers/blogpostController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, blogpostController.getAllBlogposts)
  .post(blogpostController.createBlogpost);
router
  .route("/:id")
  .get(blogpostController.getBlogpost)
  .patch(blogpostController.updateBlogpost)
  .delete(blogpostController.deleteBlogpost);

module.exports = router;
