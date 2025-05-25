import { test, expect } from '@playwright/test';


test('clicking the computer 10000 times triggers an achievement', async ({ page }) => {

    await page.goto('http://localhost:5173/EngineerClicker/');


    await page.evaluate(() => {
    const element = document.querySelector('div.console_wrap');
    if (!element) throw new Error('Element not found');
    
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    for (let i = 0; i < 10000; i++) {
        element.dispatchEvent(event);

    }
    });



    const alert = page.locator('label', {
        hasText: 'Achievement Unlocked: Almost like a real job',
    });
    await expect(alert).toHaveText('Achievement Unlocked: Almost like a real job');

});


test('user takes a maximum loan', async ({ page }) => {
    await page.goto('http://localhost:5173/EngineerClicker/'); 

    await page.getByRole('button', { name: 'Bank' }).click();

    const input = await page.locator('input').first();
    await input.fill('5000');

    await page.getByRole('button', { name: 'Take loan' }).click();

    const alert = page.locator('label', {
        hasText: 'Achievement Unlocked: Calculated risk',
    });

    await expect(alert).toHaveText('Achievement Unlocked: Calculated risk');  

  

});