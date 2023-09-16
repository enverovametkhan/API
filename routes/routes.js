const express = require("express");
const router = express.Router();

const {
  baseFunctionControllerBlogs,
  getBlog,
  getBlogsInCategory,
  getUserBlogsInCategory,
  updateBlog,
  deleteBlog,
  createBlog,
} = require("@root/blogs/blogs.controller");

const { baseFunctionControllerUsers } = require("@root/users/users.controller");

// Blogs
router.get("/api/blog/:id", getBlog);
router.get("/api/blog/category/:category", getBlogsInCategory);
router.get("/api/blog/:userId/:category", getUserBlogsInCategory);
router.put("/api/blog/:id", updateBlog);
router.delete("/api/blog/:id", deleteBlog);
router.post("/api/blog", createBlog);

// Users

// Other routes
router.post("/hellos", baseFunctionControllerUsers);

module.exports = router;
