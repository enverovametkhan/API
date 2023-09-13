const blogPosts = [
  {
    _id: "111",
    name: "My blog 1",
    img: "base64-1...",
    views: 4,
    likes: 2,
    category: "Category1",
  },
  {
    _id: "112",
    name: "My blog 2",
    img: "base64-2...",
    views: 5,
    likes: 3,
    category: "Category2",
  },
];

function getBlogPostById(id) {
  return blogPosts.find((post) => post._id === id);
}

function getBlogPostsByCategory(category) {
  return blogPosts.filter((post) => post.category === category);
}

module.exports = { getBlogPostById, getBlogPostsByCategory };
