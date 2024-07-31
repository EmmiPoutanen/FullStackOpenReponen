/* eslint-disable no-undef */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog />", () => {
  const blog = {
    title: "Testing Blog",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 10,
    user: {
      id: "1234",
      username: "testuser",
      name: "Test User",
    },
  };

  const user = {
    id: "1234",
  };

  test("renders title and author but not url or likes by default", () => {
    render(<Blog blog={blog} user={user} />);

    // Check that the title and author are rendered
    expect(screen.getByText(/Testing Blog/)).toBeInTheDocument();
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();

    // Check that the url and likes are not rendered by default
    expect(screen.queryByText("http://testurl.com")).not.toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  test("shows url, likes, and user when the button is clicked", async () => {
    render(<Blog blog={blog} user={user} />);
    const userClick = userEvent.setup();

    const button = screen.getByText("view");
    await userClick.click(button);

    expect(screen.getByText("http://testurl.com")).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
  });

  test("call event handler twice if the like button is clicked twice", async () => {
    const mockHandler = jest.fn();
    const userClick = userEvent.setup();

    render(<Blog blog={blog} user={user} handleBlogLike={mockHandler} />);

    const viewButton = screen.getByText("view");
    await userClick.click(viewButton);

    screen.debug(screen.getByText("like"));

    const likeButton = screen.getByText("like");
    await userClick.dblClick(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
