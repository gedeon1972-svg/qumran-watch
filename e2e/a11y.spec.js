import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const VIEWS = [
    ['hoy', '#view-hoy'],
    ['lit', '#view-lit'],
    ['cal', '#view-cal'],
    ['edu', '#view-edu'],
    ['con', '#view-con'],
];

for (const [id, selector] of VIEWS) {
    test('a11y: la vista ' + id + ' no tiene violaciones WCAG', async ({ page }) => {
        await page.goto('/');
        await page.locator('#nav-' + id).click();
        await expect(page.locator(selector)).toBeVisible();
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
    });
}
