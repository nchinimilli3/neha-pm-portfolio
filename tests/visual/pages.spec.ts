import { test, expect, type Page } from '@playwright/test';

const CASES = ['commute', 'bookclub', 'scheduler', 'chat', 'rep', 'fcvf', 'finsimple', 'estee', 'kohler', 'accenture', 'marketExpansion'];

// Self-test: VISUAL_PROBE=1 injects a tiny style nudge; every page must then FAIL.
const PROBE = process.env.VISUAL_PROBE ? 'h1,h2,h3,p{letter-spacing:.5px!important}' : '';

// Several mockups render the live time (RepWatch, KohlerDemo, DeskHero); pin it so runs match.
test.beforeEach(async ({ page }) => { await page.clock.setFixedTime(new Date('2026-01-15T09:41:00')); });

async function settle(page: Page) {
  if (PROBE) await page.addStyleTag({ content: PROBE });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800);
}

// Walk the page top to bottom so on-scroll content mounts, then return to the top.
async function walk(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(60); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
}

test('home: scroll positions', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const h = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const f of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(h * f));
    await settle(page);
    await expect(page).toHaveScreenshot(`home-${Math.round(f * 100)}.png`);
  }
});

for (const id of CASES) {
  test(`case: ${id}`, async ({ page }) => {
    await page.goto(`/#/projects/${id}`);
    await settle(page);
    await walk(page);
    await expect(page).toHaveScreenshot(`case-${id}.png`, { fullPage: true });
  });
}
