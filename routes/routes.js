const express = require("express");
const router = express.Router();
const { authMiddleware } = require("@root/utilities/auth.middleware");

const {
  getBlog,
  getBlogsInCategory,
  getUserBlogsInCategory,
  updateBlog,
  deleteBlog,
  createBlog,
} = require("@root/blogs/blogs.controller");

const {
  loginController,
  signupController,
  verifyEmailController,
  logoutController,
  getUserController,
  deleteUserController,
  updateUserController,
  refreshAuthTokenController,
  resetPasswordController,
  checkResetPasswordTokenController,
  changePasswordController,
  // swapEmailController,
  confirmEmailSwapController,
} = require("@root/users/users.controller");

// Blog Routes
router.get("/api/blog/:id", getBlog);
router.get("/api/blog/category/:category", getBlogsInCategory);
router.get(
  "/api/blog/:userId/:category",
  authMiddleware,
  getUserBlogsInCategory
);
router.put("/api/blog/:id", authMiddleware, updateBlog);
router.delete("/api/blog/:id", deleteBlog);
router.post("/api/blog", createBlog);

// User Routes
router.post("/api/user/login", loginController);
router.post("/api/user/signup", signupController);
router.get("/api/user/verifyEmail/:hash", verifyEmailController);
router.get("/api/user/logout", logoutController);
router.get("/api/user/", getUserController);
router.put("/api/user/update", updateUserController);
router.delete("/api/user/delete", deleteUserController);
router.get("/api/user/refreshAuthToken", refreshAuthTokenController);
router.post("/api/user/resetPassword", resetPasswordController);
router.get(
  "/api/user/checkResetPasswordToken/:token",
  checkResetPasswordTokenController
);
router.put("/api/user/changePassword", changePasswordController);
// router.post("/api/user/swapEmail/", swapEmailController);
router.get("/api/user/confirmEmailSwap/:hash", confirmEmailSwapController);
module.exports = router;
