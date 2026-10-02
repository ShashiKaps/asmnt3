import { test, expect } from "@playwright/test";

// Builder use case: CRUD a word via the Activity Manager on the Settings page.
// Uses a word unlikely to collide with real/seeded data.
test("builder can add, update, and delete a word", async ({ page }) => {
  const englishWord = `pwtest${Date.now()}`;

  await page.goto("/Settings");

  const phonemeInput = page.getByPlaceholder("e.g. b e d");
  const englishInput = page.getByPlaceholder("e.g. bed");
  const status = page.locator("text=/Added|Updated|Deleted|Enter|No existing/");

  // Add
  await phonemeInput.fill("t e s t");
  await englishInput.fill(englishWord);
  await page.getByRole("button", { name: "Add Word" }).click();
  await expect(status).toContainText(`Added "${englishWord}"`);

  // Update
  await phonemeInput.fill("t e s t s");
  await englishInput.fill(englishWord);
  await page.getByRole("button", { name: "Update Word" }).click();
  await expect(status).toContainText(`Updated "${englishWord}"`);

  // Delete
  await englishInput.fill(englishWord);
  await page.getByRole("button", { name: "Delete Word" }).click();
  await expect(status).toContainText(`Deleted "${englishWord}"`);
});
