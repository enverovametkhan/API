const { dummyBlogs } = require("./blogs.data");
const { getAccessToUserData } = require("@root/utilities/getUserData");

function getBlogService(id) {
  const blog = dummyBlogs.find((blog) => blog.id === id);

  if (!blog) {
    throw new Error("No blog found");
  }

  blog.comments = [];

  return blog;
}

async function getBlogInCategoryService(category) {
  const blogs = dummyBlogs.filter((blog) => blog.categories.includes(category));

  if (blogs.length === 0) {
    throw new Error("No blogs found in the category");
  }

  return blogs;
}

async function getUserBlogInCategoryService(userId, category) {
  if (!userId || !category) {
    throw new Error("Insufficient information");
  }

  const blogs = [];
  for (const blog of dummyBlogs) {
    if (blog.user_id === userId && blog.categories.includes(category)) {
      blogs.push(blog);
    }
  }

  if (blogs.length === 0) {
    throw new Error("No blogs found for the user in the category");
  }

  return blogs;
}

async function updateBlogService(
  id,
  title,
  content,
  img,
  visibility,
  category
) {
  try {
    if (!id) {
      throw new Error("Blog ID is required");
    }

    const userData = await getAccessToUserData();

    const index = dummyBlogs.findIndex((blog) => blog.id === id);

    if (index === -1) {
      throw new Error("Blog not found for updating");
    }

    const updatedBlog = dummyBlogs[index];

    if (title !== undefined) {
      updatedBlog.title = title;
    }

    if (content !== undefined) {
      updatedBlog.content = content;
    }

    if (img !== undefined) {
      updatedBlog.img = img;
    }

    if (visibility !== undefined) {
      updatedBlog.visibility = visibility;
    }

    if (category !== undefined) {
      updatedBlog.category = category;
    }

    dummyBlogs[index] = updatedBlog;

    const response = {
      content: "Blog post updated successfully",
      userData: {
        customMessage: "Blog post updated by user: " + userData.username,
        ...userData,
      },
    };

    return response;
  } catch (error) {
    throw error;
  }
}

function deleteBlogService(id) {
  const index = dummyBlogs.findIndex((blog) => blog.id === id);

  if (index === -1) {
    return null;
  }

  const deletedBlog = dummyBlogs.splice(index, 1)[0];

  return deletedBlog;
}

async function createBlogService({
  title,
  content,
  image,
  user_id,
  categories,
}) {
  const newBlog = {
    title,
    content,
    image,
    user_id,
    categories,
  };

  dummyBlogs.push(newBlog);

  return newBlog;
}

module.exports = {
  getBlogService,
  getBlogInCategoryService,
  getUserBlogInCategoryService,
  updateBlogService,
  deleteBlogService,
  createBlogService,
};
