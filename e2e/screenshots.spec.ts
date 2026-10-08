import { test } from '@playwright/test';

const BASE = 'http://localhost:4321/DeathEmpire';

test('capture screenshots', async ({ page }) => {
  // Desktop - Home
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/es/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'e2e/home-desktop.png', fullPage: true });

  // Desktop - BookReader Chapter 1
  await page.goto(`${BASE}/es/lore/chapter-1/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#loreBook', { state: 'visible' });
  await page.screenshot({ path: 'e2e/book-reader-desktop.png' });

  // Mobile - Home
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${BASE}/es/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'e2e/home-mobile.png', fullPage: true });

  // Mobile - BookReader
  await page.goto(`${BASE}/es/lore/chapter-1/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#loreBook', { state: 'visible' });
  await page.screenshot({ path: 'e2e/book-reader-mobile.png' });
});
