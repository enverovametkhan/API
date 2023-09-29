const {
  getBlogService,
  getBlogInCategoryService,
  getUserBlogInCategoryService,
  updateBlogService,
  deleteBlogService,
  createBlogService,
} = require("./blogs.services");

const { authMiddleware } = require("@root/utilities/auth.middleware");

async function getBlog(req, res) {
  try {
    const { id } = req.params;
    const response = await getBlogService(id);

    if (!response) {
      res.status(404).json({ errorMessage: "No blogs found" });
      return;
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
}

async function getBlogsInCategory(req, res) {
  try {
    const { category } = req.params;
    const response = await getBlogInCategoryService(category);

    if (!response || response.length === 0) {
      res.status(404).json({ errorMessage: "No blogs found" });
      return;
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getUserBlogsInCategory(req, res, next) {
  try {
    const { userId, category } = req.params;
    const response = await getUserBlogInCategoryService(userId, category);

    if (!response || response.length === 0) {
      res.status(404).json({ errorMessage: "No blogs found" });
      return;
    }

    res.ourResponse = response;
    next();
  } catch (error) {
    const { userId, category } = req.params;
    const errorMessage = {
      ...error,
      function: "getUserBlogsInCategory",
      errorMessage: "An error occurred while fetching blogs",
      userId,
      category,
    };

    next(errorMessage);
  }
}

async function updateBlog(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, img, visibility, category } = req.body;

    const updatedBlog = await updateBlogService(
      id,
      title,
      content,
      img,
      visibility,
      category
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.ourResponse = updatedBlog;
    next();
  } catch (error) {
    const { userId, category } = req.params;
    const errorMessage = {
      ...error,
      function: "updateBlog",
      errorMessage: "An error occurred while updating the blog post",
      userId,
      category,
    };

    next(errorMessage);
  }
}

async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    const result = await deleteBlogService(id);

    if (result) {
      return res.json({ message: "Blog deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ errorMessage: "No blogs found for deletion" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createBlog(req, res) {
  try {
    const { title, content, image, user_id, categories } = req.body;

    const newBlog = await createBlogService({
      title,
      content,
      image,
      user_id,
      categories,
    });

    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getBlog,
  getBlogsInCategory,
  getUserBlogsInCategory,
  updateBlog,
  createBlog,
  deleteBlog,
};
