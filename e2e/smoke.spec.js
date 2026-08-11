import { test, expect } from '@playwright/test';

const VIEWS = [
    ['hoy', '#view-hoy'],
    ['lit', '#view-lit'],
    ['cal', '#view-cal'],
    ['edu', '#view-edu'],
    ['con', '#view-con'],
];

test('la app carga y muestra la vista Hoy con fecha', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Qumran Watch/);
    await expect(page.locator('#view-hoy')).toBeVisible();
    await expect(page.locator('#greg-date')).not.toHaveText('...');
});

test('el reloj solar muestra salida y puesta del sol', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sun-rise')).not.toHaveText('');
    await expect(page.locator('#sun-set')).not.toHaveText('');
});

test('la navegacion SPA recorre las 5 vistas', async ({ page }) => {
    await page.goto('/');
    for (const [id, selector] of VIEWS) {
        await page.locator('#nav-' + id).click();
        await expect(page.locator(selector)).toBeVisible();
        await expect(page.locator('#nav-' + id)).toHaveClass(/active/);
        expect(page.url().endsWith('#' + id)).toBe(true);
    }
});

test('volver a la vista Hoy desde Calendario restaura la navegacion', async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-cal').click();
    await expect(page.locator('#view-cal')).toBeVisible();
    await page.locator('#nav-hoy').click();
    await expect(page.locator('#view-hoy')).toBeVisible();
    await expect(page.locator('#nav-hoy')).toHaveClass(/active/);
});
