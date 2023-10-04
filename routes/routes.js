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

module.exports = (app) => {
  // Blog Routes
  app.get("/public/blog/:id", getBlog);
  app.get("/public/blog/category/:category", getBlogsInCategory);
  app.get(
    "/secure/blog/:userId/:category",
    authMiddleware,
    getUserBlogsInCategory
  );
  app.put("/secure/blog/:id", authMiddleware, updateBlog);
  app.delete("/secure/blog/:id", authMiddleware, deleteBlog);
  app.post("/secure/blog", authMiddleware, createBlog);

  // User Routes
  app.post("/api/user/login", loginController);
  app.post("/api/user/signup", signupController);
  app.get("/api/user/verifyEmail/:hash", verifyEmailController);
  app.get("/api/user/logout", authMiddleware, logoutController);
  app.get("/api/user", authMiddleware, getUserController);
  app.delete("/api/user/delete", authMiddleware, deleteUserController);
  app.put("/api/user/update", authMiddleware, updateUserController);
  app.get(
    "/api/user/refreshAuthToken",
    authMiddleware,
    refreshAuthTokenController
  );
  app.post("/api/user/resetPassword/:token", resetPasswordController);
  app.get(
    "/api/user/checkResetPasswordToken/:token",
    checkResetPasswordTokenController
  );
  router.put("/api/user/changePassword", changePasswordController);
  // router.post("/api/user/swapEmail/", swapEmailController);
  router.get("/api/user/confirmEmailSwap/:hash", confirmEmailSwapController);
};
