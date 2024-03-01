const express = require("express");
const authController = require("../controllers/authController");
const tagController = require("../controllers/tagController");

const router = express.Router({ mergeParams: true });

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
