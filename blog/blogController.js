const blogPosts = require("./blogPosts");

function increaseViews(postId) {
  const post = blogPosts.getBlogPostById(postId);
  if (post) {
    post.views++;
  }
}

function increaseLikes(postId) {
  const post = blogPosts.getBlogPostById(postId);
  if (post) {
    post.likes++;
  }
}

function createNewBlogPost(req, res) {
  const { id } = req.params;
  const { title, content, img, visibility, category } = req.body;

  const newBlogPost = blogPosts.createBlogPost(
    id,
    title,
    content,
    img,
    visibility,
    category
  );

  if (newBlogPost) {
    res.json({ status: "OK" });
  } else {
    res.status(400).json({ error: "Failed to create the blog post" });
  }
}

function removeBlogPost(req, res) {
  const { id } = req.params;

  const deletedPost = blogPosts.deleteBlogPost(id);

  if (deletedPost) {
    res.json({ status: "OK" });
  } else {
    res.status(400).json({ error: "Failed to delete the blog post" });
  }
}

function modifyBlogPost(req, res) {
  const { id } = req.params;
  const { title, content, img, visibility, category } = req.body;

  const updatedPost = blogPosts.updateBlogPost(
    id,
    title,
    content,
    img,
    visibility,
    category
  );

  if (updatedPost) {
    res.json({ status: "OK" });
  } else {
    res.status(400).json({ error: "Failed to update the blog post" });
  }
}

function increaseViewsHandler(req, res) {
  const { id } = req.params;
  increaseViews(id);
  res.json({ status: "OK" });
}

function increaseLikesHandler(req, res) {
  const { id } = req.params;
  increaseLikes(id);
  res.json({ status: "OK" });
}

module.exports = {
  createNewBlogPost,
  removeBlogPost,
  modifyBlogPost,
  increaseViewsHandler,
  increaseLikesHandler,
};
