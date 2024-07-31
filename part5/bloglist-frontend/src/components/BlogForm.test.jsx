/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("BlogForm component", () => {
  test("calls createBlog with correct data when form is submitted", async () => {
    const mockCreateBlog = jest.fn();
    render(<BlogForm createBlog={mockCreateBlog} />);

    const titleInput = screen.getByTestId("titleInput");
    const authorInput = screen.getByTestId("authorInput");
    const urlInput = screen.getByTestId("urlInput");
    const submitButton = screen.getByText("Create");

    await userEvent.type(titleInput, "Test Blog Title");
    await userEvent.type(authorInput, "Test Author");
    await userEvent.type(urlInput, "http://test.com");

    fireEvent.click(submitButton);

    expect(mockCreateBlog).toHaveBeenCalledTimes(1);
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: "Test Blog Title",
      author: "Test Author",
      url: "http://test.com",
    });
  });
});
