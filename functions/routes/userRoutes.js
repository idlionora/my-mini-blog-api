const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const blogpostRouter = require("./blogpostRoutes");
const commentRouter = require("./commentRoutes");

const router = express.Router();

router.use("/:userId/blogposts", blogpostRouter);
router.use("/:userId/comments", commentRouter);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword,
);

router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser,
);
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhotoToMemory,
  userController.uploadUserPhotoToCloud,
  userController.updatePhotoWhenEmailsChanged,
  userController.updateMe,
);
router.delete("/deleteme", authController.protect, userController.deleteMe);

router.get(
  "/search/:nameRegex",
  userController.setNameParamToSearchUser,
  userController.getAllUsers,
);
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers,
  );

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.updateUser,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser,
  );

module.exports = router;
