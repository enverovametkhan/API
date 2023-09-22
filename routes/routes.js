const express = require("express");
const router = express.Router();

const {
  getBlog,
  getBlogsInCategory,
  getUserBlogsInCategory,
  updateBlog,
  deleteBlog,
  createBlog,
} = require("@root/blogs/blogs.controller");

const {
  loginUser,
  signupUser,
  verifyUserEmail,
  logoutUser,
  getUserInfo,
  deleteUserAccount,
  updateUserProfile,
  refreshUserToken,
  resetUserPassword,
  checkResetPassword,
} = require("@root/users/users.controller");

// Blog Routes
router.get("/api/blog/:id", getBlog);
router.get("/api/blog/category/:category", getBlogsInCategory);
router.get("/api/blog/:userId/:category", getUserBlogsInCategory);
router.put("/api/blog/:id", updateBlog);
router.delete("/api/blog/:id", deleteBlog);
router.post("/api/blog", createBlog);

// User Routes
router.post("/api/user/login", loginUser);
router.post("/api/user/signup", signupUser);
router.get("/api/user/verifyEmail/:hash", verifyUserEmail);
router.get("/api/user/logout", logoutUser);
router.get("/api/user/:id", getUserInfo);
router.put("/api/user/update", updateUserProfile);
router.delete("/api/user/delete", deleteUserAccount);
router.post("/api/user/refreshAccessToken/:id", refreshUserToken);
router.post("/api/user/resetPassword", resetUserPassword);
router.get("/api/user/checkResetPasswordToken/:id", checkResetPassword);

module.exports = router;
