const {
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
} = require("./blogPosts");

function createNewBlogPost(req, res) {
  const { id } = req.params;
  const { title, content, img, visibility, category } = req.body;

  const newBlogPost = createBlogPost(
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

  const deletedPost = deleteBlogPost(id);

  if (deletedPost) {
    res.json({ status: "OK" });
  } else {
    res.status(400).json({ error: "Failed to delete the blog post" });
  }
}

function modifyBlogPost(req, res) {
  const { id } = req.params;
  const { title, content, img, visibility, category } = req.body;

  const updatedPost = updateBlogPost(
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

module.exports = {
  createNewBlogPost,
  removeBlogPost,
  modifyBlogPost,
};
