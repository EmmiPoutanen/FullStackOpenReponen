const { beforeEach, test, afterAll, expect } = require("@jest/globals");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Blog = require("../models/blog");

let token = "";

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  await helper.initializeUsers();

  const user = await User.findOne({
    username: helper.initialUsers[0].username,
  });
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: "1h",
  });

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
  const blogPromiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(blogPromiseArray);
});

test("notes are returned correctly as JSON", async () => {
  await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("each returned blog contains an id field", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
    expect(blog._id).toBeUndefined();
    expect(blog.__v).toBeUndefined();
  });
});

test("a valid blog can be added with token", async () => {
  const newBlog = {
    title: "New Blog",
    author: "Author Name",
    url: "http://example.com/blog",
    likes: 3,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  const titles = response.body.map((blog) => blog.title);

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  expect(titles).toContain("New Blog");
});

test("adding a new blog without token returns status code 401", async () => {
  const newBlog = {
    title: "New Blog",
    author: "Author Name",
    url: "http://example.com/blog",
    likes: 3,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);
});

test("if likes are empty, set value to 0", async () => {
  const newBlog = {
    title: "New Blog",
    author: "John Smith",
    url: "http://example.com/new",
  };

  await api
    .post("/api/blogs/")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);
  const addedBlog = response.body.find((blog) => blog.title == "New Blog");

  expect(addedBlog.likes).toBe(0);
});

test("if title or url is missing, response with status code 400", async () => {
  const newBlog = {
    author: "John Smith",
    likes: 3,
  };

  await api
    .post("/api/blogs/")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).not.toContain(blogToDelete.title);
});

test("a blog can be updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedLikes = { likes: blogToUpdate.likes + 1 };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedLikes)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
  expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1);
});

afterAll(async () => {
  await mongoose.connection.close();
});
