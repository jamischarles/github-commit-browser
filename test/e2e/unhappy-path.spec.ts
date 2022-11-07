import { test, expect } from "@playwright/test";

test('/ has repo input field. When INvalid "user/repo" is entered and form submitted, will redirect to `does/not/exist/` route with no commits showing', async ({
  page,
  baseURL,
}) => {
  await page.goto(baseURL + "/");

  const userInput = page.getByTestId("userInput");
  const repoInput = page.getByTestId("repoInput");
  const formSubmitButton = page.getByTestId("submitButton");

  await userInput.fill("jamischarles");
  await repoInput.fill("arstiaentiaenrst"); // bogus repoName
  await formSubmitButton.click();

  // Expects the URL to contain repo url from the input
  await expect(page).toHaveURL(/.*does\/not\/exist/);

  // no commits should be visible on the page
  await expect(page.locator(".commit-list .commit-item")).toHaveCount(0)
});

