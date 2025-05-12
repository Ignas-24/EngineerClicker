// @ts-check
import { test, expect } from "@playwright/test";

test("has correct title", async ({ page }) => {
  // Navigate to the site
  await page.goto("http://localhost:5173/EngineerClicker/");

  await expect(page).toHaveTitle("Typecoon");
});

test("buying power upgrade 1", async ({ page }) => {
  // Navigate to the site
  await page.goto("http://localhost:5173/EngineerClicker/");

  const EuroLocator = page.getByText(/Euro/);
  await expect(EuroLocator).toHaveText("Euro: 0.00€");

  const TypingPowerLocator = page.getByText(/Current typing power:/);
  await expect(TypingPowerLocator).toContainText("Current typing power: 0.01");

  await page.evaluate(() => {
    const element = document.querySelector("div.console_wrap");
    if (!element) throw new Error("Element not found");

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    for (let i = 0; i < 50; i++) {
      element.dispatchEvent(event);
    }
  });

  await expect(EuroLocator).toHaveText("Euro: 0.50€");

  await page.getByRole("button", { name: "Open Power Upgrades" }).click();
  await page.getByRole("button", { name: "Upgrade 1, Price: 0.5€" }).click();
  await page.getByRole("button", { name: "Open Power Upgrades" }).click();

  await expect(EuroLocator).toHaveText("Euro: 0.00€");
  await expect(TypingPowerLocator).toContainText("Current typing power: 0.02");

  const ConsoleLocator = page.locator("div.console_contents");
  await ConsoleLocator.click();
  await expect(EuroLocator).toHaveText("Euro: 0.02€");
});

test("buying mult upgrade 1", async ({ context, page }) => {
  await context.addInitScript(() => {
    window.localStorage.setItem(
      "ResourceManagerData",
      JSON.stringify({ prestige: 1 }),
    );
  });

  // Navigate to the site
  await page.goto("http://localhost:5173/EngineerClicker/");

  // initial state
  const EuroLocator = page.getByText(/Euro/);
  await expect(EuroLocator).toHaveText("Euro: 0.00€");

  const MultiplierLocator = page.getByText(/Multiplier:/);
  await expect(MultiplierLocator).toContainText("Multiplier: 1");

  const PrestigeLocator = page.getByText(/Prestige/);
  await expect(PrestigeLocator).toHaveText("Prestige: 1");

  // buying multiplier
  await page.getByRole("button", { name: "Open Multiplier Upgrades" }).click();
  await page
    .getByRole("button", { name: "Upgrade 1, Price: 1 Prestige" })
    .click();
  await page.getByRole("button", { name: "Open Multiplier Upgrades" }).click();

  // check if it worked
  await expect(PrestigeLocator).toHaveText("Prestige: 0");
  await expect(MultiplierLocator).toContainText("Multiplier: 2");

  const ConsoleLocator = page.locator("div.console_contents");
  await ConsoleLocator.click();
  await expect(EuroLocator).toHaveText("Euro: 0.02€");
});
