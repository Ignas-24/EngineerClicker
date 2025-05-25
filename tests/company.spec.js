// @ts-check
import { test, expect } from "@playwright/test";

const PAGE_URL = "http://localhost:5173/EngineerClicker/";

const setSaveData = async (context, key, value) => {
  await context.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key, value],
  );
};

test("buy small studio", async ({ context, page }) => {
  await setSaveData(context, "ResourceManagerData", { euro: 4000 });
  await page.goto(PAGE_URL);

  await page
    .getByRole("button", {
      name: "Buy a Company",
    })
    .click();

  await expect(page.getByText(/Completed Projects:/)).toHaveText(
    "Completed Projects: 0",
  );

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 4000.00€");

  await page
    .getByRole("button", {
      name: "Buy Small Software Development Studio (3,000 €)",
    })
    .click();

  await page.getByRole("button", { name: "Close" }).click(); // Achievement pop-up

  await expect(
    page.getByRole("button", {
      name: "Small Software Development Studio",
    }),
  ).toBeVisible(); // Menu toggle button name changed

  await expect(
    page.getByRole("button", {
      name: "Upgrade to Medium Sized Software Company (12,000 €)",
    }),
  ).toBeVisible();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 1000.00€");
});

test("buy medium company", async ({ context, page }) => {
  await setSaveData(context, "ResourceManagerData", { euro: 12500 });
  await setSaveData(context, "ProjectManagerData", {
    completedProjectsThisReset: 20,
  });
  await setSaveData(
    context,
    "CompanyManagerData",
    JSON.parse(
      '{"currentCompany":{"type":"small","cost":3000,"maxEmployees":5,"upkeep":180,"unlocks":["junior","midlevel"]},"developers":{"junior":0,"midlevel":0,"senior":0,"lead":0}}',
    ),
  );

  await page.goto(PAGE_URL);

  await page
    .getByRole("button", {
      name: "Small Software Development Studio",
    })
    .click();

  await expect(page.getByText(/Completed Projects:/)).toHaveText(
    "Completed Projects: 20",
  );

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 12500.00€");

  await page
    .getByRole("button", {
      name: "Upgrade to Medium Sized Software Company (12,000 €)",
    })
    .click();

  await expect(
    page.getByRole("button", {
      name: "Medium Sized Software Company",
    }),
  ).toBeVisible(); // Menu toggle button name changed

  await expect(
    page.getByRole("button", {
      name: "Upgrade to Large Software Corporation (60,000 €)",
    }),
  ).toBeVisible();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 500.00€");
});

test.fixme("buy large corporation", async ({ context, page }) => {
  await page.goto(PAGE_URL);
});

test.fixme("buy upgrades", async ({ context, page }) => {
  await page.goto(PAGE_URL);
});

test("hire developers", async ({ context, page }) => {
  await setSaveData(context, "ResourceManagerData", { euro: 18000 });
  await setSaveData(
    context,
    "CompanyManagerData",
    JSON.parse(
      '{"currentCompany":{"type":"small","cost":3000,"maxEmployees":5,"upkeep":180,"unlocks":["junior","midlevel"]},"developers":{"junior":0,"midlevel":0,"senior":0,"lead":0}}',
    ),
  );

  await page.goto(PAGE_URL);

  await page
    .getByRole("button", {
      name: "Small Software Development Studio",
    })
    .click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 18000.00€");

  await page
    .getByRole("button", {
      name: "Hire developer",
    })
    .click();

  const HireJuniorButton = page.getByText(/Hire Junior Developer/);
  const HireMidButton = page.getByText(/Hire Mid-Level Developer/);

  await expect(HireJuniorButton).toHaveText(
    "Hire Junior Developer (€300, €60 upkeep) (Hired: 0)",
  );
  await expect(HireMidButton).toHaveText(
    "Hire Mid-Level Developer (€600, €120 upkeep) (Hired: 0)",
  );

  await HireJuniorButton.click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 17700.00€");
  await expect(HireJuniorButton).toHaveText(
    "Hire Junior Developer (€300, €60 upkeep) (Hired: 1)",
  );

  await HireMidButton.click();

  await expect(page.getByText(/Euro:/)).toHaveText("Euro: 17100.00€");
  await expect(HireMidButton).toHaveText(
    "Hire Mid-Level Developer (€600, €120 upkeep) (Hired: 1)",
  );

  await expect(page.getByText(/Developer upkeep: /)).toHaveText(
    "Developer upkeep: 180.00€ / 5 min",
  );
});
