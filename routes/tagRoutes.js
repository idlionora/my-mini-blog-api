const express = require("express");
const authController = require("../controllers/authController");
const tagController = require("../controllers/tagController");

const router = express.Router({ mergeParams: true });

/* TODOS 
 - getRandomRelatedPosts, /related-posts/:postNum, maybe I can just put it in client side
 
 - middleware to aggregate tags and put it into getBlogpost x I did not think things through
 - delete cloudinary pictures when delete blogpost

 - add image to new post
 - middleware updateTagFromNewPost, updateTagFromEdittedPost
 - populate blogposts if search for related posts (summary=true)
*/

router
  .route("/")
  .get(
    tagController.setBlogpostIdSearch,
    tagController.setSearchOperatorsToQuery,
    tagController.getAllTags,
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    tagController.createTag,
  );

router
  .route("/:id")
  .get(tagController.getTag)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    tagController.updateTag,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    tagController.deleteTag,
  );
module.exports = router;
