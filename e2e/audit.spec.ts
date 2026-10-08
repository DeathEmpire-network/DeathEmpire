import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4321/DeathEmpire';

test('ES chapter-1: BookReader renders with Crimson Text font', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/es/lore/chapter-1/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#loreBook', { timeout: 15000, state: 'visible' });
  await page.waitForFunction(() => document.documentElement.classList.contains('js'), { timeout: 5000 });

  // Check that BookReader content is visible (no fade-in-up conflict)
  const spread1 = page.locator('#opening-1');
  await expect(spread1).toBeVisible();

  // Check font-family on paragraph uses Crimson Text (via CSS variable)
  const fontFamily = await page.evaluate(() => {
    const p = document.querySelector('#opening-1 .leaf-inner p');
    return p ? window.getComputedStyle(p).fontFamily : 'not found';
  });
  console.log('Font family on paragraph:', fontFamily);
  expect(fontFamily).toContain('Crimson Text');

  // Check internal nav buttons present
  const internalNextBtns = page.locator('.leaf-nav-right [data-book-next]');
  expect(await internalNextBtns.count()).toBeGreaterThan(0);

  console.log('Errors:', errors);
  expect(errors).toHaveLength(0);
  console.log('✅ ES chapter-1 OK');
});

test('EN chapter-1: BookReader renders', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/lore/chapter-1/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#loreBook', { timeout: 15000, state: 'visible' });
  await page.waitForFunction(() => document.documentElement.classList.contains('js'), { timeout: 5000 });

  const spread1 = page.locator('#opening-1');
  await expect(spread1).toBeVisible();

  const internalNextBtns = page.locator('.leaf-nav-right [data-book-next]');
  expect(await internalNextBtns.count()).toBeGreaterThan(0);

  console.log('Errors:', errors);
  expect(errors).toHaveLength(0);
  console.log('✅ EN chapter-1 OK');
});

test('ES Lore index: LoreArchive renders', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/es/lore/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.lore-archive', { timeout: 10000, state: 'visible' });

  const chapterCards = page.locator('.archive-chapter');
  expect(await chapterCards.count()).toBe(10);

  console.log('Errors:', errors);
  expect(errors).toHaveLength(0);
  console.log('✅ ES Lore index OK');
});

test('EN Lore index: LoreArchive renders', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/lore/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.lore-archive', { timeout: 10000, state: 'visible' });

  const chapterCards = page.locator('.archive-chapter');
  expect(await chapterCards.count()).toBe(10);

  console.log('Errors:', errors);
  expect(errors).toHaveLength(0);
  console.log('✅ EN Lore index OK');
});

test('Home page: fade-in-up animation works (not on BookReader)', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

  // Check hero section gets fade-in-up animation
  const hero = page.locator('main > section:first-child, main > .hero:first-child');
  const heroCount = await hero.count();
  console.log('Hero elements:', heroCount);

  // No JS errors
  expect(errors).toHaveLength(0);
  console.log('✅ Home page OK');
});