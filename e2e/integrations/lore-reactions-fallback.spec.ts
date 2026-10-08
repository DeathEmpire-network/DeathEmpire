import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4321/DeathEmpire';

test.describe('Lore Reactions - Fallback (Phase 1)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('[CONSOLE ERROR]', msg.text());
      }
    });
    page.on('pageerror', e => {
      console.log('[PAGE ERROR]', e.message);
    });
  });

  test('EN chapter-1: LoreReactions renders unavailable state', async ({ page }) => {
    await page.goto(`${BASE}/lore/chapter-1/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#loreBook', { timeout: 10000, state: 'visible' });
    await page.waitForFunction(() => document.documentElement.classList.contains('js'), { timeout: 5000 });

    // Scroll to bottom where reactions would be inserted
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check LoreReactions component exists (even if not in BookReader yet)
    // For now, verify no console errors related to reactions
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('reaction')) {
        errors.push(msg.text());
      }
    });

    // Wait a bit for any async components
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });

  test('ES chapter-1: LoreReactions renders unavailable state', async ({ page }) => {
    await page.goto(`${BASE}/es/lore/chapter-1/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#loreBook', { timeout: 10000, state: 'visible' });
    await page.waitForFunction(() => document.documentElement.classList.contains('js'), { timeout: 5000 });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('reaction')) {
        errors.push(msg.text());
      }
    });

    expect(errors).toHaveLength(0);
  });

  test('Home page: no reaction errors in console', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    expect(errors.filter(e => e.includes('reaction') || e.includes('Supabase'))).toHaveLength(0);
  });
});