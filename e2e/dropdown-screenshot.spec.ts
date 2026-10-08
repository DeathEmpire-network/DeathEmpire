import { test } from '@playwright/test';

const BASE = 'http://localhost:4321/DeathEmpire';

test('capture mobile dropdown open screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${BASE}/es/`, { waitUntil: 'networkidle' });
  
  // Click nav toggle to open menu
  await page.click('.nav-toggle');
  await page.waitForTimeout(300); // allow animation
  
  await page.screenshot({ path: 'e2e/home-mobile-dropdown-open.png' });
});
