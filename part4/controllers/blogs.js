const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogsRouter.use(userExtractor);

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  blog ? response.json(blog) : response.status(404).end();
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  // Validate that title and url are present
  if (!title || !url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  try {
    const user = await User.findById(request.user.id);

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error during blog creation:", error);
    response.status(500).json({ error: "something went wrong" });
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).json({ error: "unauthorized user" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "something went wrong" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes: body.likes },
      { new: true, runValidators: true, context: "query" }
    );
    response.json(updatedBlog);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "something went wrong" });
  }
});

module.exports = blogsRouter;
