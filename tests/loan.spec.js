
import { test, expect } from "@playwright/test";

const setSaveData = async (context, key, value) => {
  await context.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key, value],
  );
};

test("taking out and paying off a loan with 0 prestige", async ({
  context,
  page,
}) => {
  await setSaveData(context, "ResourceManagerData", { euro: 499.99 });
  await page.goto("http://localhost:5173/EngineerClicker/");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).fill("5001");
  await page.getByRole("button", { name: "Take Loan" }).click();
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 499.99€");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).fill("5000");
  await page.getByRole("button", { name: "Take Loan" }).click();
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 5499.99€");
  await expect(page.getByText(/Loan:/)).toHaveText("Loan: 5500.00€");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("button", { name: "Pay Off Loan" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 5499.99€");
  await expect(page.getByText(/Loan:/)).toHaveText("Loan: 5500.00€");

  await page.evaluate(() => {
  const element = document.querySelector('div.console_wrap');
  if (!element) throw new Error('Element not found');
  
  const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
  });
    element.dispatchEvent(event);
  });

  //await page.locator(".console_contents").click();

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("button", { name: "Pay Off Loan" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 0.00€");
});

test("taking out and paying off a loan with 2 prestige", async ({
  context,
  page,
}) => {
  await setSaveData(context, "ResourceManagerData", {
    euro: 999.99,
    prestige: 2,
  });
  await page.goto("http://localhost:5173/EngineerClicker/");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).fill("10001");
  await page.getByRole("button", { name: "Take Loan" }).click();
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 999.99€");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).fill("10000");
  await page.getByRole("button", { name: "Take Loan" }).click();
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 10999.99€");
  await expect(page.getByText(/Loan:/)).toHaveText("Loan: 11000.00€");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("button", { name: "Pay Off Loan" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 10999.99€");
  await expect(page.getByText(/Loan:/)).toHaveText("Loan: 11000.00€");
  
  await page.evaluate(() => {
  const element = document.querySelector('div.console_wrap');
  if (!element) throw new Error('Element not found');
  
  const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
  });
    element.dispatchEvent(event);
  });

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("button", { name: "Pay Off Loan" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 0.00€");
});

test("taking out and paying off a loan with 5 prestige", async ({
  context,
  page,
}) => {
  await setSaveData(context, "ResourceManagerData", {
    euro: 7499.99,
    prestige: 5,
  });
  await page.goto("http://localhost:5173/EngineerClicker/");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).fill("100001");
  await page.getByRole("button", { name: "Take Loan" }).click();
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 7499.99€");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).click();
  await page.getByRole("spinbutton", { name: "Loan Amount:" }).fill("100000");
  await page.getByRole("button", { name: "Take Loan" }).click();
  await page.getByRole("button", { name: "Close" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 107499.99€");
  await expect(page.getByText(/Loan:/)).toHaveText("Loan: 107500.00€");

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("button", { name: "Pay Off Loan" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 107499.99€");
  await expect(page.getByText(/Loan:/)).toHaveText("Loan: 107500.00€");
  
  await page.evaluate(() => {
  const element = document.querySelector('div.console_wrap');
  if (!element) throw new Error('Element not found');
  
  const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
  });
    element.dispatchEvent(event);
  });

  await page.getByRole("button", { name: "Bank" }).click();
  await page.getByRole("button", { name: "Pay Off Loan" }).click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 0.00€");
});
