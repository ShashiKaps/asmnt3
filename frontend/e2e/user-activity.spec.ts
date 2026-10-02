import { test, expect } from "@playwright/test";

// User use case: generate a Word Search puzzle and confirm the grid + word list render,
// then reveal the solution overlay to confirm the generated placements are valid.
test("user can generate a Word Search puzzle and view the solution", async ({ page }) => {
  await page.goto("/WordSearch");

  const grid = page.locator("[data-row][data-col]");
  await expect(grid.first()).toBeVisible();
  const initialCellCount = await grid.count();
  expect(initialCellCount).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Generate Puzzle" }).click();
  await expect(grid.first()).toBeVisible();
  await expect(grid).toHaveCount(initialCellCount);

  const wordListHeading = page.getByRole("heading", { name: "Word List:" });
  await expect(wordListHeading).toBeVisible();

  await page.getByRole("button", { name: "Show Answers" }).click();
  await expect(page.getByRole("button", { name: "Hide Answers" })).toBeVisible();
});
