import { test, expect } from '@playwright/test';

test('volver con el boton atras restaura la vista previa', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#view-hoy')).toBeVisible({ timeout: 15000 });

    await page.locator('#nav-cal').click();
    await expect(page.locator('#view-cal')).toBeVisible();
    await expect(page.locator('#nav-cal')).toHaveClass(/active/);

    await page.goBack();
    await expect(page.locator('#view-hoy')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#nav-hoy')).toHaveClass(/active/);
    await expect(page.url().endsWith('#hoy')).toBe(true);
});

test('el historial permite avanzar y retroceder entre vistas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#view-hoy')).toBeVisible({ timeout: 15000 });

    await page.locator('#nav-lit').click();
    await expect(page.locator('#view-lit')).toBeVisible();
    await page.locator('#nav-edu').click();
    await expect(page.locator('#view-edu')).toBeVisible();

    await page.goBack();
    await expect(page.locator('#view-lit')).toBeVisible({ timeout: 10000 });

    await page.goBack();
    await expect(page.locator('#view-hoy')).toBeVisible({ timeout: 10000 });

    await page.goForward();
    await expect(page.locator('#view-lit')).toBeVisible({ timeout: 10000 });
});
