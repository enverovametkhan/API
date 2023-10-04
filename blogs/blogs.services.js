const { dummyBlogs } = require("./blogs.data");
const { getAccessToUserData } = require("@root/utilities/getUserData");

async function getBlogService(id) {
  const blog = dummyBlogs.find((blog) => blog.id === id);

  if (!blog) {
    const error = new Error("No blog found");
    error.function = "getBlogService";
    throw error;
  }

  return {
    message: "Here is the content for Blog Service",
    blog,
  };
}

async function getBlogInCategoryService(category) {
  const blogsInCategory = [];

  for (const blog of dummyBlogs) {
    if (blog.categories.includes(category)) {
      blogsInCategory.push(blog);
    }
  }

  return {
    message: "Here you go!",
    blogs: blogsInCategory,
  };
}

async function getUserBlogInCategoryService(category) {
  const blogsInCategory = dummyBlogs.filter(
    (blog) => blog.categories.includes(category) && blog.user_id === userId
  );

  const userData = await getAccessToUserData();

  return {
    message: "List of blogs successfully loaded",
    userData,
    blogs: blogsInCategory,
  };
}

async function updateBlogService({ id, title, content, image, categories }) {
  const blogIndex = dummyBlogs.findIndex((blog) => blog.id === id);

  if (blogIndex === -1) {
    const error = new Error("No blog found");
    error.function = "updateBlogService";
    throw error;
  }

  dummyBlogs[blogIndex] = {
    ...dummyBlogs[blogIndex],
    title,
    content,
    image,
    categories,
  };

  const userData = await getAccessToUserData();

  return {
    message: "Blog post updated successfully",
    userData,
    blog: dummyBlogs[blogIndex],
  };
}

async function deleteBlogService(id) {
  const index = dummyBlogs.findIndex((blog) => blog.id === id);

  if (index === -1) {
    throw new Error("No blogs found for deletion");
  }

  const deletedBlog = dummyBlogs.splice(index, 1)[0];
  const userData = await getAccessToUserData();

  return {
    message: "Blog deleted successfully",
    userData,
    blog: deletedBlog,
  };
}

async function createBlogService({ title, content, image, categories }) {
  const newBlog = {
    title,
    content,
    image,
    categories,
  };

  dummyBlogs.push(newBlog);
  const userData = await getAccessToUserData();

  return {
    message: "Blog created successfully",
    userData,
    blog: newBlog,
  };
}

module.exports = {
  getBlogService,
  getBlogInCategoryService,
  getUserBlogInCategoryService,
  updateBlogService,
  deleteBlogService,
  createBlogService,
};
