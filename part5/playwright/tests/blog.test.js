const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Another User",
        username: "anotheruser",
        password: "password",
      },
    });

    await page.goto("http://localhost:3000");
  });

  test("Login form is shown", async ({ page }) => {
    // Varmista, että kirjautumislomake näkyy
    const locator = await page.getByText("Log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "wrong", "wrong");
      const errorMessage = page.locator(".notification", {
        hasText: "wrong credentials",
      });
      await expect(errorMessage).toBeVisible();
      await expect(
        page.locator("text=Matti Luukkainen logged in")
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");

      await createBlog(
        page,
        "Test Blog Title",
        "Test Author",
        "http://testblog.com"
      );
    });

    test("a new blog can be created", async ({ page }) => {
      await expect(page.getByText("Test Blog Title Test Author")).toBeVisible();
    });

    test("blog can be liked", async ({ page }) => {
      const blog = await page.getByText("Test Blog Title Test Author");
      // Click on the blog to expand details if needed
      await blog.getByRole("button", { name: "view" }).click();

      // Check that like count is initially 0
      await expect(page.getByText("likes 0")).toBeVisible();

      // Click like button
      await page
        .getByRole("button", {
          name: "like",
        })
        .click();

      // Check that like count is 1 after clicking like button
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("blog can be deleted", async ({ page }) => {
      const blog = await page.getByText("Test Blog Title Test Author");

      await blog.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "delete" })).toBeVisible();
      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });
      await page.getByRole("button", { name: "delete" }).click();

      await expect(
        page.getByText("Test Blog Title Test Author")
      ).not.toBeVisible();
    });

    test("only the blog author sees the delete button", async ({ page }) => {
      await createBlog(
        page,
        "Blog to be deleted",
        "Test Author",
        "http://deletethisblog.com"
      );

      let blog = await page.getByText("Blog to be deleted Test Author");
      await blog.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "delete" })).toBeVisible();

      await page.getByRole("button", { name: "Logout" }).click();

      await loginWith(page, "anotheruser", "password");

      blog = await page.getByText("Blog to be deleted Test Author");
      await blog.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "delete" })
      ).not.toBeVisible();
    });

    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "First Blog",
          "First Author",
          "http://firstblog.com"
        );
        await createBlog(
          page,
          "Second Blog",
          "Second Author",
          "http://secondblog.com"
        );
        await createBlog(
          page,
          "Third Blog",
          "Third Author",
          "http://thirdblog.com"
        );

        //add likes to the blogs
        let blog = await page.getByText("First Blog First Author");
        await blog.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await page.getByRole("button", { name: "hide" }).click();

        blog = await page.getByText("Second Blog Second Author");
        await blog.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await page.getByRole("button", { name: "hide" }).click();

        blog = await page.getByText("Third Blog Third Author");
        await blog.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await page.getByRole("button", { name: "like" }).click();
        await page.getByRole("button", { name: "like" }).click();
      });

      test("blogs are ordered by number of likes in descending order", async ({
        page,
      }) => {
        const blogs = await page
          .locator("div")
          .filter({ hasText: "likes" })
          .allTextContents();
        const likeCounts = blogs.map((blog) => {
          const match = blog.match(/likes (\d+)/);
          return match ? parseInt(match[1]) : 0;
        });

        for (let i = 0; i < likeCounts.length - 1; i++) {
          expect(likeCounts[i]).toBeGreaterThanOrEqual(likeCounts[i + 1]);
        }
      });
    });
  });
});
