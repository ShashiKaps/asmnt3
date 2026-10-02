import { test, expect } from "@playwright/test";

// Smoke test: confirms Playwright + the installed Chromium binary work on this host
// before writing the real builder/user-activity specs.
test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Phoneme Learning Lab/);
});
