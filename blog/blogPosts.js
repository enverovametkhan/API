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

const getBlogPostById = (id) => {
  try {
    const post = blogPosts.find((post) => post._id === id);
    if (!post) throw new Error("Blog post not found");
    return post;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBlogPostsByCategory = (category) => {
  try {
    const filteredPosts = blogPosts.filter(
      (post) => post.category === category
    );
    return filteredPosts;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBlogPostsByCategoryAndUserId = (category, userId) => {
  try {
    const filteredPosts = blogPosts.filter(
      (post) => post.category === category && post.userId === userId
    );
    return filteredPosts;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createBlogPost = (id, title, content, img, visibility, category) => {
  try {
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
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteBlogPost = (id) => {
  try {
    const index = blogPosts.findIndex((post) => post._id === id);
    if (index === -1) throw new Error("Blog post not found");

    blogPosts.splice(index, 1);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateBlogPost = (id, title, content, img, visibility, category) => {
  try {
    const post = blogPosts.find((post) => post._id === id);
    if (!post) throw new Error("Blog post not found");

    post.name = title;
    post.img = img;
    post.category = category;

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getBlogPostById,
  getBlogPostsByCategory,
  getBlogPostsByCategoryAndUserId,
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
};
