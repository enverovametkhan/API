const blogPosts = [
  {
    _id: "111",
    name: "My blog 1",
    img: "base64-1...",
    views: 4,
    likes: 2,
    category: "Category1",
    userId: "user1",
  },
  {
    _id: "112",
    name: "My blog 2",
    img: "base64-2...",
    views: 5,
    likes: 3,
    category: "Category2",
    userId: "user2",
  },
];

function getBlogPostById(id) {
  return blogPosts.find((post) => post._id === id);
}

function getBlogPostsByCategory(category) {
  return blogPosts.filter((post) => post.category === category);
}

function getBlogPostsByCategoryAndUserId(category, userId) {
  return blogPosts.filter(
    (post) => post.category === category && post.userId === userId
  );
}

function createBlogPost(id, title, content, img, visibility, category) {
  const newPost = {
    _id: id,
    name: title,
    img,
    views: 0,
    likes: 0,
    category,
    userId: "user1",
  };

  blogPosts.push(newPost);

  return newPost;
}

function deleteBlogPost(id) {
  const index = blogPosts.findIndex((post) => post._id === id);

  if (index !== -1) {
    blogPosts.splice(index, 1);
    return true;
  }

  return false;
}

function updateBlogPost(id, title, content, img, visibility, category) {
  const post = blogPosts.find((post) => post._id === id);

  if (post) {
    post.name = title;
    post.img = img;
    post.category = category;

    return true;
  }

  return false;
}

module.exports = {
  getBlogPostById,
  getBlogPostsByCategory,
  getBlogPostsByCategoryAndUserId,
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
};
