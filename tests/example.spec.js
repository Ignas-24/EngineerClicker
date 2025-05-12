// @ts-check
import { test, expect } from '@playwright/test';

test('has correct title', async ({ page }) => {
  // Navigate to the site
  await page.goto('http://localhost:5173/EngineerClicker/');

  await expect(page).toHaveTitle('Typecoon');
});

test('buying power upgrade 1', async ({ page }) => {
  // Navigate to the site
  await page.goto('http://localhost:5173/EngineerClicker/');

  const EuroLocator = page.getByText(/Euro/);
  await expect(EuroLocator).toHaveText('Euro: 0.00€');

  const TypingPowerLocator = page.getByText(/Current typing power:/);
  await expect(TypingPowerLocator).toContainText('Current typing power: 0.01');

  const ConsoleLocator = page.locator('div.console_contents');

  const clickPromises = [];
  for (let i = 0; i < 50; i++) {
    clickPromises.push(ConsoleLocator.click());
  }
  await Promise.all(clickPromises);

  await expect(EuroLocator).toHaveText('Euro: 0.50€');


  await page.getByRole('button', { name: 'Open Power Upgrades' }).click();
  await page.getByRole('button', { name: 'Upgrade 1, Price: 0.5€' }).click();
  await page.getByRole('button', { name: 'Open Power Upgrades' }).click();

  await expect(EuroLocator).toHaveText('Euro: 0.00€');
  await expect(TypingPowerLocator).toContainText('Current typing power: 0.02');

  await ConsoleLocator.click();
  await expect(EuroLocator).toHaveText('Euro: 0.02€');
});