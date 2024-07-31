const loginWith = async (page, username, password) => {
  await page.getByRole("textbox").first().fill(username);
  await page.getByRole("textbox").last().fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByTestId("titleInput").fill(title);
  await page.getByTestId("authorInput").fill(author);
  await page.getByTestId("urlInput").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

export { loginWith, createBlog };
