const express = require("express");
const blogpostController = require("../controllers/blogpostController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");

const router = express.Router({ mergeParams: true });

router.use("/:blogpostId/comments", commentRouter);

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
