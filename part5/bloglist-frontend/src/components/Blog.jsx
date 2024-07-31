import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, setBlogs, handleBlogLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    handleBlogLike(user, blog.likes);

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setBlogs((blogs) =>
        blogs.map((b) =>
          b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }
        )
      );
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs((blogs) => blogs.filter((b) => b.id !== blog.id));
      } catch (error) {
        console.error("Error deleting the blog:", error);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {detailsVisible ? "hide" : "view"}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {user.username === blog.user.username && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
