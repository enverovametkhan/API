const {
  getBlogService,
  getBlogInCategoryService,
  getUserBlogInCategoryService,
  updateBlogService,
  deleteBlogService,
  createBlogService,
} = require("./blogs.services");

// async function getBlog(req, res) {
//   try {
//     const { id } = req.params;
//     const response = await getBlogService(id);

//     if (!response) {
//       res.status(404).json({ errorMessage: "No blogs found" });
//       return;
//     }

//     res.json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ errorMessage: "Internal Server Error" });
//   }
// }

// async function getBlog(req, res, next) {
//   try {
//     const { id } = req.params;
//     const response = await getBlogService(id);

//     if (!response) {
//       const errorMessage = {
//         function: "getBlog",
//         errorMessage: "No blogs found",
//       };
//       throw errorMessage;
//     }

//     res.ourResponse = response;
//     next();
//   } catch (error) {
//     const errorMessage = {
//       ...error,
//       function: "getBlog",
//       errorMessage: "Internal Server Error",
//     };
//     next(errorMessage);
//   }
// }

async function getBlog(req, res, next) {
  try {
    const { id } = req.params;
    const response = await getBlogService(id);

    if (!response) {
      const errorMessage = {
        function: "getBlogController",
        errorMessage: "No blogs found",
      };
      throw errorMessage;
    }

    res.ourResponse = response;

    console.log(
      "IM IN THE MIDDLE, EXECUTING THE MAIN LOGIC FOR getBlog CONTROLLER"
    );

    next();
  } catch (error) {
    const errorMessage = {
      ...error,
      function: "getBlog",
      errorMessage: "Something went wrong while processing getBlog controller",
    };

    next(errorMessage);
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

// async function updateBlog(req, res, next) {
//   let id;

//   try {
//     id = req.params.id;

//     const { title, content, img, visibility, category } = req.body;

//     const updatedBlogObject = {
//       id,
//       title,
//       content,
//       img,
//       visibility,
//       category,
//     };

//     const updatedBlog = await updateBlogService(id, updatedBlogObject, req);

//     res.ourResponse = updatedBlog;
//     next();
//   } catch (error) {
//     const errorMessage = {
//       ...error,
//       function: "updateBlog",
//       errorMessage: "An error occurred while updating the blog post",
//       id,
//     };
//     next(errorMessage);
//   }
// }

async function updateBlog(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, img, visibility, category } = req.body;

    const updatedBlogObject = {
      id,
      title,
      content,
      img,
      visibility,
      category,
    };

    const updatedBlog = await updateBlogService(id, updatedBlogObject, req);

    res.ourResponse = updatedBlog;

    console.log("Executing the main logic for the updateBlog controller");

    next();
  } catch (error) {
    const errorMessage = {
      ...error,
      function: "updateBlog",
      customMessage: "An error occurred while updating the blog post",
    };

    next(errorMessage);
  }
}

// async function updateBlog(req, res) {
//   try {
//     const { id } = req.params;
//     const { title, content, img, visibility, category } = req.body;

//     const updatedBlogObject = {
//       id,
//       title,
//       content,
//       img,
//       visibility,
//       category,
//     };

//     const updatedBlog = await updateBlogService(id, updatedBlogObject, req);

//     res.status(200).json(updatedBlog);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the blog post" });
//   }
// }

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
