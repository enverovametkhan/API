const { dummyBlogs } = require("./blogs.data");
const { getAccessToUserData } = require("@root/utilities/getUserData");

// function getBlogService(id) {
//   const blog = dummyBlogs.find((blog) => blog.id === id);

//   if (!blog) {
//     throw new Error("No blog found");
//   }

//   blog.comments = [];

//   return blog;
// }
// function getBlogService(id) {
//   const blog = dummyBlogs.find((blog) => blog.id === id);

//   if (!blog) {
//     const error = new Error("No blog found");
//     error.function = "getBlogService";
//     throw error;
//   }

//   blog.comments = [];

//   return blog;
// }
async function getBlogService(id) {
  try {
    // TAG:001
    // Here we extract the data from the req object and now have access to it on the Service level
    // without passing any parameters to this function, similar to the logic you provided
    const userData = await getAccessToCustomData();

    const blog = dummyBlogs.find((blog) => blog.id === id);

    if (!blog) {
      const error = new Error("No blog found");
      error.function = "getBlogService";
      throw error;
    }

    blog.comments = [];

    const response = {
      content: "Here is the content for Blog Service",
      message: "There you go!",
      userData: {
        personalisedMessage:
          "This content is decrypted from AuthMiddleware and accessed in getBlogService",
        ...userData,
      },
      blog,
    };

    return response;
  } catch (error) {
    throw error;
  }
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

async function updateBlogService(id, updatedBlogData) {
  try {
    if (!id) {
      throw new Error("Blog ID is required");
    }

    const index = dummyBlogs.findIndex((blog) => blog.id === id);

    if (index === -1) {
      throw new Error("Blog not found for updating");
    }

    const updatedBlog = { ...dummyBlogs[index], ...updatedBlogData };
    dummyBlogs[index] = updatedBlog;

    const response = {
      content: "Blog post updated successfully",
      userData: {
        customMessage: `Blog post updated by user: ${updatedBlogData.user_id}`,
        ...updatedBlogData,
      },
    };

    return response;
  } catch (error) {
    throw error;
  }
}

// async function updateBlogService(id, updatedBlogData) {
//   if (!id) {
//     throw new Error("Blog ID is required");
//   }

//   const index = dummyBlogs.findIndex((blog) => blog.id === id);

//   if (index === -1) {
//     throw new Error("Blog not found for updating");
//   }

//   const updatedBlog = { ...dummyBlogs[index], ...updatedBlogData };
//   dummyBlogs[index] = updatedBlog;

//   return "Blog post updated successfully";
// }

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
