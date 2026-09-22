import { expect, type Page, test } from "@playwright/test";

async function preparePage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { name: "Game for 2" })).toBeVisible();
}

test.describe("visual regression", () => {
  test("TOP画面", async ({ page }) => {
    await preparePage(page);
    await expect(page).toHaveScreenshot("top.png", { fullPage: true });
  });

  test("設定画面", async ({ page }) => {
    await preparePage(page);
    await page.getByRole("menuitem", { name: "設定" }).click();
    await expect(page.getByRole("heading", { name: "設定" })).toBeVisible();
    await expect(page).toHaveScreenshot("settings.png", { fullPage: true });
  });

  test("ゲーム選択画面", async ({ page }) => {
    await preparePage(page);
    await page.getByRole("menuitem", { name: "スタート" }).click();
    await expect(page.getByRole("heading", { name: "ゲームを選ぶ" })).toBeVisible();
    await expect(page).toHaveScreenshot("game-select.png", { fullPage: true });
  });

  test("オンゲキ準備画面", async ({ page }) => {
    await preparePage(page);
    await page.getByRole("menuitem", { name: "スタート" }).click();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "運指練習" })).toBeVisible();
    await expect(page.getByRole("button", { name: "START" })).toBeVisible();
    await expect(page).toHaveScreenshot("ongeki-ready.png", { fullPage: true });
  });
});
