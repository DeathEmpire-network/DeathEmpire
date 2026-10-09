import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4321/DeathEmpire';

test.describe('Lore Reactions - Live (staging)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('[CONSOLE ERROR]', msg.text());
      }
    });
    page.on('pageerror', e => console.log('[PAGE ERROR]', e.message));
  });

  test('ES chapter-1: live reactions load and submit', async ({ page }) => {
    await page.goto(`${BASE}/es/lore/chapter-1/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#loreBook', { timeout: 15000, state: 'visible' });
    await page.waitForFunction(() => document.documentElement.classList.contains('js'), { timeout: 5000 });

    // Scroll to bottom where reactions would be
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForSelector('.lore-reactions', { timeout: 10000, state: 'visible' });

    // Check LoreReactions component exists and is in live mode
    const reactions = page.locator('.lore-reactions');
    await expect(reactions).toHaveAttribute('data-live', 'true');

    // Check buttons are interactive (not disabled)
    const firstBtn = page.locator('.lore-reactions__button[data-reaction-kind="imperial_loyalty"]');
    await expect(firstBtn).not.toBeDisabled();

    // Submit first reaction
    await firstBtn.click();

    // Wait for response
    await page.waitForTimeout(2000);

    // Verify counter incremented
    const count = page.locator('.lore-reactions__button[data-reaction-kind="imperial_loyalty"] .lore-reactions__count');
    await expect(count).not.toHaveText('0');

    // Second click -> 409 idempotency
    await firstBtn.click();
    await page.waitForTimeout(1000);
    
    // Verify 409 message
    const alreadyMsg = page.locator('.lore-reactions__already');
    await expect(alreadyMsg).toBeVisible();
  });

  test('Rate limit: 429 after burst', async ({ page }) => {
    // Test manual: requires configuring low rate limit in staging
    // or mocking Upstash
  });
});