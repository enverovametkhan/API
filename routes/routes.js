const express = require("express");
const router = express.Router();
const userController = require("@root/Auth/userController");
const blogController = require("@root/blog/blogController");

router.post("/api/user/signup", userController.signup);
router.post("/api/user/login", userController.login);
router.delete("/api/user", userController.deleteUser);
router.post("/api/user/refreshToken/:token", userController.refreshToken);
router.get("/api/user/logout", userController.logout);
router.post("/api/user/createBlogPost/:id", blogController.createNewBlogPost);

router.post("/api/blog/:id", blogController.createNewBlogPost);
router.delete("/api/blog/:id", blogController.removeBlogPost);
router.put("/api/blog/:id", blogController.modifyBlogPost);

module.exports = router;
