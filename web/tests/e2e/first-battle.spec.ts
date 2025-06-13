import { test, expect } from '@playwright/test';

test('title to first battle flow', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // click start on title
  await page.getByRole('button', { name: /start/i }).click();
  // skip cinematic
  await page.mouse.click(10,10);
  // create party – assume default names inputs present
  const inputs = await page.locator('input[type="text"]');
  await inputs.nth(0).fill('Hero');
  await page.getByRole('button', { name: /begin adventure/i }).click();
  // Wait for overworld then trigger encounter: simulate key presses
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(2000);
  // Expect ATB gauge element present
  await expect(page.getByText(/HP .*\/.* ATB/i)).toBeVisible({ timeout: 10000 });
}); 