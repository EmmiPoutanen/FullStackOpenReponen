const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blog");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const initialUsers = [
  {
    name: "Sophia Johnson",
    username: "sophiaj",
    password: "s0ph14j",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate("user");
  return blogs.map((blog) => blog.toJSON());
};

const initializeUsers = async () => {
  await User.deleteMany({});

  const userPromises = initialUsers.map(async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = new User({ ...user, password: passwordHash });
    return newUser.save();
  });

  await Promise.all(userPromises);
};

module.exports = {
  initialBlogs,
  nonExistingId,
  usersInDb,
  blogsInDb,
  initialUsers,
  initializeUsers,
};
