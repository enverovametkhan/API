const { dummyBlogs } = require("./blogs.data");

async function getBlogService(id) {
  try {
    const blog = dummyBlogs.find((blog) => blog.id === id);

    if (!blog) {
      throw new Error("No blog found");
    }

    return blog;
  } catch (e) {
    console.error("Error happened:", e.message);
    throw e;
  }
}

async function getBlogInCategoryService(category) {
  try {
    const blogs = dummyBlogs.filter((blog) =>
      blog.categories.includes(category)
    );

    if (blogs.length === 0) {
      throw new Error("No blogs found in the category");
    }

    return blogs;
  } catch (e) {
    console.error("Error happened:", e.message);
    throw e;
  }
}

async function getUserBlogInCategoryService(userId, category) {
  try {
    if (!userId || !category) {
      throw new Error("Insufficient information");
    }

    const blogs = dummyBlogs.filter(
      (blog) => blog.categories.includes(category) && blog.user_id === userId
    );

    if (blogs.length === 0) {
      throw new Error("No blogs found for the user in the category");
    }

    return blogs;
  } catch (e) {
    console.error("Error happened:", e.message);
    throw e;
  }
}

async function updateBlogService(id, updatedBlog) {
  try {
    const index = dummyBlogs.findIndex((blog) => blog.id === id);

    if (index === -1) {
      throw new Error("Blog not found for updating");
    }

    dummyBlogs[index] = { ...dummyBlogs[index], ...updatedBlog };

    return dummyBlogs[index];
  } catch (e) {
    console.error("Error happened:", e.message);
    throw e;
  }
}
async function deleteBlogService(id) {
  try {
    const index = dummyBlogs.findIndex((blog) => blog.id === id);

    if (index === -1) {
      throw new Error("Blog not found for deletion");
    }

    const deletedBlog = dummyBlogs.splice(index, 1)[0];

    return deletedBlog;
  } catch (e) {
    console.error("Error happened:", e.message);
    throw e;
  }
}

async function createBlogService({
  title,
  content,
  image,
  user_id,
  categories,
}) {
  try {
    if (!title || !content || !user_id || !categories) {
      throw new Error("Missing required fields");
    }

    const newBlog = {
      title,
      content,
      image,
      user_id,
      categories,
    };

    dummyBlogs.push(newBlog);

    return newBlog;
  } catch (e) {
    console.error("Error happened:", e.message);
    throw e;
  }
}

module.exports = {
  getBlogService,
  getBlogInCategoryService,
  getUserBlogInCategoryService,
  updateBlogService,
  deleteBlogService,
  createBlogService,
};
