import { expect, type Page, test } from "@playwright/test";

async function preparePage(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { name: "Game for 2" })).toBeVisible();
}

test.describe("navigation integration", () => {
  test("TOP → 設定 → 戻る", async ({ page }) => {
    await preparePage(page);

    await page.getByRole("menuitem", { name: "設定" }).click();
    await expect(page.getByRole("heading", { name: "設定" })).toBeVisible();
    await expect(page.getByText("同じPC")).toBeVisible();

    await page.getByRole("button", { name: "戻る" }).click();
    await expect(page.getByRole("heading", { name: "Game for 2" })).toBeVisible();
  });

  test("TOP → ゲーム選択 → ゲーム切替 → 戻る", async ({ page }) => {
    await preparePage(page);

    await page.getByRole("menuitem", { name: "スタート" }).click();
    await expect(page.getByRole("heading", { name: "ゲームを選ぶ" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3 })).toContainText(
      "ボタン連打ゲーム",
    );

    await page.getByRole("button", { name: "次のゲーム" }).click();
    await expect(page.getByRole("heading", { level: 3 })).toContainText(
      "一致度ゲーム",
    );

    await page.getByRole("menuitem", { name: "戻る" }).click();
    await expect(page.getByRole("heading", { name: "Game for 2" })).toBeVisible();
  });

  test("キーボードでゲーム選択からオンゲキ準備画面へ", async ({ page }) => {
    await preparePage(page);

    await page.getByRole("menuitem", { name: "スタート" }).click();
    await expect(page.getByRole("heading", { name: "ゲームを選ぶ" })).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { level: 3 })).toContainText(
      "オンゲキ運指練習",
    );

    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "運指練習" })).toBeVisible();
    await expect(page.getByRole("button", { name: "START" })).toBeVisible();
  });
});
