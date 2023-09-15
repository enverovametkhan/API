const express = require("express");
const router = express.Router();
const userController = require("@root/Auth/userController");
const blogController = require("@root/blog/blogController");
const blogPosts = require("@root/blog/blogPosts");

router.post("/api/user/signup", userController.signup);
router.post("/api/user/login", userController.login);
router.delete("/api/user", userController.deleteUser);
router.post("/api/user/refreshToken/:token", userController.refreshToken);
router.get("/api/user/logout", userController.logout);

router.get("/api/blog/:id", blogPosts.getBlogPostById);
router.get("/api/blog/category/:category", blogPosts.getBlogPostsByCategory);
router.get(
  "/api/blog/category/:category/user/:userId",
  blogPosts.getBlogPostsByCategoryAndUserId
);
router.post("/api/blog", blogPosts.createBlogPost);
router.delete("/api/blog/:id", blogPosts.deleteBlogPost);
router.put("/api/blog/:id", blogPosts.updateBlogPost);

router.post("/api/blog/:id", blogController.createNewBlogPost);
router.delete("/api/blog/:id", blogController.removeBlogPost);
router.put("/api/blog/:id", blogController.modifyBlogPost);
router.put("/api/blog/:id/increaseViews", blogController.increaseViewsHandler);
router.put("/api/blog/:id/increaseLikes", blogController.increaseLikesHandler);

module.exports = router;
