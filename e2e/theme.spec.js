import { test, expect } from '@playwright/test';

test('el toggle de tema aplica dark-theme y persiste en localStorage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#theme-toggle')).toBeVisible();

    const before = await page.evaluate(() => document.documentElement.classList.contains('dark-theme'));
    expect(before).toBe(false);

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark-theme/);
    await expect(page.locator('#theme-toggle')).toHaveText('☽');

    const stored = await page.evaluate(() => localStorage.getItem('qw_theme'));
    expect(stored).toBe('dark');
});

test('el tema elegido persiste tras recargar', async ({ page }) => {
    await page.goto('/');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark-theme/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark-theme/);
});

test('volver a tema claro quita la clase y actualiza localStorage', async ({ page }) => {
    await page.goto('/');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark-theme/);

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).not.toHaveClass(/dark-theme/);
    await expect(page.locator('#theme-toggle')).toHaveText('☀');

    const stored = await page.evaluate(() => localStorage.getItem('qw_theme'));
    expect(stored).toBe('light');
});
