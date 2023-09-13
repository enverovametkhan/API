const express = require("express");
const router = express.Router();
const blogController = require("./blogController");

router.get("/api/blog/:id", (req, res) => {});

router.get("/api/blog/:category", (req, res) => {});

router.get("/api/blog/:category/:userId", (req, res) => {});

router.post("/api/blog/:id", blogController.createBlogPost);

router.delete("/api/blog/:id", blogController.deleteBlogPost);

router.put("/api/blog/:id", blogController.updateBlogPost);

module.exports = router;
