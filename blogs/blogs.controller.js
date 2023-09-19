const {
  getBlogService,
  getBlogInCategoryService,
  getUserBlogInCategoryService,
  updateBlogService,
  deleteBlogService,
  createBlogService,
} = require("./blogs.services");

async function getBlog(req, res) {
  try {
    const { id } = req.params;
    const response = await getBlogService(id);

    if (!response) {
      res.status(404).send();
      return;
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getBlogsInCategory(req, res) {
  try {
    const { category } = req.params;
    const response = await getBlogInCategoryService(category);

    if (!response) {
      res.status(404).send();
      return;
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getUserBlogsInCategory(req, res) {
  try {
    const { userId, category } = req.params;
    const response = await getUserBlogInCategoryService(userId, category);

    if (!response) {
      res.status(404).send();
      return;
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateBlog(req, res) {
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

    return res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteBlog(req, res) {
  try {
    const { id } = req.params;

    const deletedBlog = await deleteBlogService(id);

    if (deletedBlog) {
      return res.json({ message: "Blog deleted successfully" });
    } else {
      return res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createBlog(req, res) {
  try {
    const { title, content, image, user_id, categories } = req.body;

    if (!title || !content || !user_id || !categories) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

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
