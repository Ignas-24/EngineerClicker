import { test, expect } from "@playwright/test";

async function setSaveData(context, key, value) {
  await context.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key, value],
  );
}

test.describe('Project flows', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.clearPermissions();
    await context.addInitScript(() => window.localStorage.clear());
  });

  test('selecting and cancelling a project resets its state', async ({ context, page }) => {
    const projectKey = 'TestProj';

    await setSaveData(context, 'ProjectManagerData', {
      selectedProjectKeys: [projectKey],
      cooldown: 0,
      completedProjectsThisReset: 0,
      completedProjectTotal: 0,
    });

    await setSaveData(context, `${projectKey}Data`, {
      projectName: 'TEST',
      projectSize: 10,
      projectProgress: 0,
      projectReward: 5,
      projectDeadline: 100,
      remainingTime: 100,
      completed: false,
      failed: false,
      isActive: false,
    });

    await page.goto('http://localhost:5173/EngineerClicker/');

    await page.getByRole('button', { name: 'Open Available Projects' }).click();

    await page.getByRole('button', {
      name: 'TEST - Size: 10, Deadline: 100, Reward: 5€',
    }).click();
    
    await page.getByRole('button', { name: 'Open Available Projects' }).click();  


    await expect(page.getByText('Project: TEST')).toBeVisible();
    await expect(page.getByText('Progress: 0.00')).toBeVisible();
    await expect(page.getByText('Size: 10')).toBeVisible();


    
    await page.getByRole('button', { name: 'Open Available Projects' }).click();
    await page.getByRole('button', { name: 'Cancel Project' }).click();
    await page.getByRole('button', { name: 'Open Available Projects' }).click();

    await expect(page.getByText('Project: None selected')).toBeVisible();
    await expect(page.getByText('Progress: 0.00')).toBeVisible();
    await expect(page.getByText('Size: 0')).toBeVisible();
    await expect(page.getByText('Time left: 0')).toBeVisible();
  });

  test('completing a project by clicking awards reward and deselects', async ({ context, page }) => {
    const projectKey = 'CompleteTestProj';

    await setSaveData(context, 'ResourceManagerData', { initClickPower: 1, clickPower: 1 });
    await setSaveData(context, 'ProjectManagerData', {
      selectedProjectKeys: [projectKey],
      cooldown: 0,
      completedProjectsThisReset: 0,
      completedProjectTotal: 0,
    });

    await setSaveData(context, `${projectKey}Data`, {
      projectName: 'COMPLETE',
      projectSize: 5,
      projectProgress: 0,
      projectReward: 7,
      projectDeadline: 50,
      remainingTime: 50,
      completed: false,
      failed: false,
      isActive: false,
    });

    await page.goto('http://localhost:5173/EngineerClicker/');

    await page.getByRole('button', { name: 'Open Available Projects' }).click();
    await page.getByRole('button', { name: 'COMPLETE - Size: 5, Deadline: 50, Reward: 7€' }).click();
    await page.getByRole('button', { name: 'Open Available Projects' }).click();

  await page.evaluate(() => {
    const element = document.querySelector('div.console_wrap');
    if (!element) throw new Error('Element not found');
  
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    for(let i=0; i<5; i++)
    {
      element.dispatchEvent(event);
    }
    
  });

    await expect(page.getByText('Euro: 7.00€')).toBeVisible();

    await expect(page.getByText('Project: None selected')).toBeVisible();
  });

  test('an active project fails when its timer runs out', async ({ context, page }) => {
    const projectKey = 'FailTestProj';

    await setSaveData(context, 'ProjectManagerData', {
      selectedProjectKeys: [projectKey],
      cooldown: 0,
      completedProjectsThisReset: 0,
      completedProjectTotal: 0,
    });

    await setSaveData(context, `${projectKey}Data`, {
      projectName: 'FAIL',
      projectSize: 3,
      projectProgress: 0,
      projectReward: 5,
      projectDeadline: 1,
      remainingTime: 1,
      completed: false,
      failed: false,
      isActive: true,
    });

    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Project FAIL failed');
      await dialog.accept();
    });

    await page.goto('http://localhost:5173/EngineerClicker/');

    await page.waitForTimeout(1500);

    await expect(page.getByText('Project: None selected')).toBeVisible();
    await expect(page.getByText('Progress: 0.00')).toBeVisible();
    await expect(page.getByText('Size: 0')).toBeVisible();
    await expect(page.getByText('Time left: 0')).toBeVisible();
  });
});