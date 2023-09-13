const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { createToken } = require("./jwt");
const { getBlogPostById, getBlogPostsByCategory } = require("./blogPosts");

app.get("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  const blogPost = getBlogPostById(id);

  if (blogPost) {
    const token = createToken({ postId: blogPost._id });
    res.json({ ...blogPost, token });
  } else {
    res.status(404).json({ error: "Blog post not found" });
  }
});

app.get("/api/blog/:category", (req, res) => {
  const { category } = req.params;
  const blogPosts = getBlogPostsByCategory(category);

  res.json(blogPosts);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
