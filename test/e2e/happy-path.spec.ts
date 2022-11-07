import { test, expect } from "@playwright/test";

test('/ has repo input field. When valid "user/repo" is entered and form submitted, will display a list of commits', async ({
  page,
  baseURL,
}) => {
  await page.goto(baseURL + "/");

  const userInput = page.getByTestId("userInput");
  const repoInput = page.getByTestId("repoInput");
  const formSubmitButton = page.getByTestId("submitButton");

  await userInput.fill("jamischarles");
  await repoInput.fill("til");
  await formSubmitButton.click();

  // Expects the URL to contain repo url from the input
  await expect(page).toHaveURL(/.*jamischarles\/til/);

  // first commit on page should have 7 digit commit hash, followed by a message.
  await expect(
    page.locator(".commit-list .commit-item:first-child"),
    "First commit should show commit hash and commit subject"
  ).toHaveText(/[a-z0-9]{7}\s.*/);
});

test('/jamischarles/til will show commit list for that repo and clicking "more" button will keep loading more commits, then hide button when no more commits are left. ', async ({
  page,
  baseURL,
}) => {
  // FIXME: Need to get this port number somehow...
  await page.goto(baseURL + "/jamischarles/til");

  await expect(page).toHaveURL(/.*jamischarles\/til/);

  // first commit on page should have 7 digit commit hash, followed by a message.
  await expect(
    page.locator(".commit-list .commit-item:first-child"),
    "First commit should show commit hash and commit subject"
  ).toHaveText(/[a-z0-9]{7}\s.*/);

  async function clickMoreButton() {
    const moreButton = page.locator(".load-more-button");
    try {
      // click the 'more' button. Wait 50ms for the button to be removed from the dom. Then click it again, until it's gone.
      await moreButton?.click();
      await moreButton.waitFor({ state: "detached", timeout: 100 });
    } catch (e) {
      return await clickMoreButton();
    }
  }

  await clickMoreButton();

  await expect(page.locator(".commit-list .commit-item:last-child")).toHaveText(
    /Initial commit 444ae95/
  );

  await expect(page.getByTestId("more-button-container")).toHaveText(
    /No more commits to show/
  );
});
