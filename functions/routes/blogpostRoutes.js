const express = require("express");
const blogpostController = require("../controllers/blogpostController");
const authController = require("../controllers/authController");
const commentRouter = require("./commentRoutes");

const router = express.Router({ mergeParams: true });

router.use("/:blogpostId/comments", commentRouter);

router
  .route("/")
  .get(blogpostController.getAllBlogposts)
  .post(
    authController.protect,
    blogpostController.setCreateBlogpostUserId,
    blogpostController.createBlogpost,
  );

router.get("/allTags", blogpostController.getAllTags);
router.get("/tags", blogpostController.getAllBlogposts);
router.get(
  "/tags/:tag",
  blogpostController.setSearchBlogpostsTags,
  blogpostController.getAllBlogposts,
);

router
  .route("/:id")
  .get(blogpostController.getBlogpost)
  .patch(
    authController.protect,
    blogpostController.uploadBlogpostImages,
    blogpostController.setImgUpdatesFalse,
    blogpostController.uploadBannerImgToCloud,
    blogpostController.uploadBlogpostImgToCloud,
    blogpostController.updateBlogpost,
  )
  .delete(
    authController.protect,
    blogpostController.deleteBlogpostComments,
    blogpostController.deleteBlogpost,
  );

module.exports = router;
