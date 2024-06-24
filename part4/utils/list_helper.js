const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current;
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorBlogCounts = _.countBy(blogs, "author");
  const maxBlogsAuthor = _.maxBy(
    _.keys(authorBlogCounts),
    (author) => authorBlogCounts[author]
  );

  return {
    author: maxBlogsAuthor,
    blogs: authorBlogCounts[maxBlogsAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // Group blogs by author and sum their likes
  const authorLikes = _.groupBy(blogs, "author");
  const authorTotalLikes = _.map(authorLikes, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, "likes"),
  }));

  // Find the author with the most likes
  const mostLikedAuthor = _.maxBy(authorTotalLikes, "likes");

  return mostLikedAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
