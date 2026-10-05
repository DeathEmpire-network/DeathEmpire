/**
 * book-geometry.spec.ts — Puerta geométrica del Libro del Lore.
 * Verifica en cada apertura visible: bloques dentro de la caja útil
 * de su página (±1px), sin solapes entre hermanos, citas íntegras
 * y ausencia de recorte en .leaf-inner.
 */
import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:4321/DeathEmpire';
const CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface BlockReport {
  spread: number;
  leaf: number;
  kind: string;
  detail: string;
}

async function auditVisibleSpread(page: Page): Promise<BlockReport[]> {
  return page.evaluate(() => {
    const problems: BlockReport[] = [];
    const spread = document.querySelector('.lore-book .spread:not([hidden])');
    if (!spread) return [{ spread: -1, leaf: -1, kind: 'no-visible-spread', detail: 'none' }];
    const spreadNum = parseInt(spread.getAttribute('data-spread') ?? '0', 10);
    spread.querySelectorAll('.leaf').forEach((leaf, li) => {
      const inner = leaf.querySelector('.leaf-inner');
      if (!inner) return;
      const lr = leaf.getBoundingClientRect();
      const cs = getComputedStyle(leaf);
      const box = {
        top: lr.top + parseFloat(cs.paddingTop),
        bottom: lr.bottom - parseFloat(cs.paddingBottom),
        left: lr.left + parseFloat(cs.paddingLeft),
        right: lr.right - parseFloat(cs.paddingRight),
      };
      // Recorte real: contenido que excede la caja con overflow oculto.
      const clipped = (inner as HTMLElement).scrollHeight - (inner as HTMLElement).clientHeight;
      if (clipped > 1) {
        problems.push({ spread: spreadNum, leaf: li, kind: 'clipped', detail: `+${Math.round(clipped)}px` });
      }
      const kids = Array.from(inner.children) as HTMLElement[];
      kids.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        // Elementos vacíos o sin tamaño con texto son sospechosos.
        if (r.height === 0 && (el.textContent ?? '').trim()) {
          problems.push({ spread: spreadNum, leaf: li, kind: 'zero-height', detail: el.tagName + i });
        }
        if (r.top < box.top - 1) problems.push({ spread: spreadNum, leaf: li, kind: 'above', detail: `${el.tagName}${i} ${Math.round(box.top - r.top)}px` });
        if (r.bottom > box.bottom + 1) problems.push({ spread: spreadNum, leaf: li, kind: 'below', detail: `${el.tagName}${i} +${Math.round(r.bottom - box.bottom)}px` });
        if (r.left < box.left - 1 || r.right > box.right + 1) problems.push({ spread: spreadNum, leaf: li, kind: 'side', detail: el.tagName + i });
        if (i > 0) {
          const pr = kids[i - 1].getBoundingClientRect();
          if (Math.round(r.top - pr.bottom) < -1) {
            problems.push({ spread: spreadNum, leaf: li, kind: 'overlap', detail: `${i - 1}-${i}` });
          }
        }
      });
    });
    return problems;
  });
}

async function spreadTotal(page: Page): Promise<number> {
  return page.evaluate(() => document.querySelectorAll('#loreBook .spread').length);
}

async function goSpread(page: Page, n: number) {
  await page.click(`a[href="#opening-${n}"]`);
}

test.describe('Book geometry — full chapters', () => {
  for (const ch of CHAPTERS) {
    test(`chapter-${ch}: every spread keeps blocks inside pages`, async ({ page }) => {
      await auditChapter(page, ch);
    });
  }
});

test.describe('Book geometry — tall viewport 1920x1080', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });
  for (const ch of [1, 2, 3, 4, 5]) {
    test(`chapter-${ch}: every spread keeps blocks inside pages`, async ({ page }) => {
      await auditChapter(page, ch);
    });
  }
});

test.describe('Book geometry — system fonts only', () => {
  for (const ch of [1, 2, 3, 4, 5]) {
    test(`chapter-${ch}: every spread keeps blocks inside pages`, async ({ page }) => {
      await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());
      await auditChapter(page, ch);
    });
  }
});

async function auditChapter(page: Page, ch: number) {
  await page.goto(`${BASE}/lore/chapter-${ch}/`);
  await page.waitForSelector('#loreBook.js, #loreBook', { timeout: 8000 });
  await page.waitForFunction(() => document.documentElement.classList.contains('js'), { timeout: 5000 });
  const total = await spreadTotal(page);
  expect(total).toBeGreaterThan(0);
  const all: BlockReport[] = [];
  for (let s = 1; s <= total; s++) {
    if (s > 1) {
      await goSpread(page, s);
      await page.waitForTimeout(150);
    }
    const found = await auditVisibleSpread(page);
    all.push(...found);
  }
  expect(all).toEqual([]);
}
