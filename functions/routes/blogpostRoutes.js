const express = require("express");
const blogpostController = require("../controllers/blogpostController");

const router = express.Router();

router.param("id", blogpostController.checkID);

router.route("/").get(blogpostController.getAllBlogposts);
router.route("/:id").get(blogpostController.getBlogpost);

module.exports = router;
