import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification("Login successful");
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setError("wrong credentials");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBloglistUser");
    setNotification("Logged out successfully");
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      const blogUser = {
        username: user.username,
        name: user.name,
        id: returnedBlog.user,
      };
      const blogWithUserInfo = { ...returnedBlog, user: blogUser };
      setBlogs(blogs.concat(blogWithUserInfo));
      setNotification(
        `A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      );
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      setError("Failed to create blog");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleBlogLike = (user, likes) => {
    // Dummy function for testing
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={error} />
        <form onSubmit={handleLogin}>
          <div>
            Username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          setBlogs={setBlogs}
          handleBlogLike={handleBlogLike}
        />
      ))}
    </div>
  );
};

export default App;
