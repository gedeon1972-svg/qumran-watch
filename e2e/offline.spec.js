import { test, expect } from '@playwright/test';

async function swReady(page) {
    await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.ready;
        }
    });
}

test('la app carga offline desde la cache del Service Worker', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#view-hoy')).toBeVisible({ timeout: 15000 });
    await swReady(page);
    await expect(page.locator('#greg-date')).not.toHaveText('...');

    await page.context().setOffline(true);
    await page.reload();

    await expect(page.locator('#view-hoy')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#greg-date')).not.toHaveText('...');
    await expect(page.locator('#sun-rise')).not.toHaveText('');
});

test('la navegacion SPA funciona offline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#view-hoy')).toBeVisible({ timeout: 15000 });
    await swReady(page);

    await page.context().setOffline(true);
    await page.reload();

    for (const id of ['hoy', 'lit', 'cal', 'edu', 'con']) {
        await page.locator('#nav-' + id).click();
        await expect(page.locator('#view-' + id)).toBeVisible({ timeout: 10000 });
    }
});
