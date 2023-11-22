const express = require("express");
const blogpostController = require("../controllers/blogpostController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(blogpostController.getAllBlogposts)
  .post(authController.protect, blogpostController.createBlogpost);
router
  .route("/:id")
  .get(blogpostController.getBlogpost)
  .patch(authController.protect, blogpostController.updateBlogpost)
  .delete(authController.protect, blogpostController.deleteBlogpost);

module.exports = router;
