import { test, expect } from '@playwright/test';

test('generar el calendario y abrir una fiesta muestra historia y qumran', async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-cal').click();
    await expect(page.locator('#view-cal')).toBeVisible();

    await page.locator('#btn-render-cal').click();
    await expect(page.locator('#cal-lista .edu-card.fiesta').first()).toBeVisible({ timeout: 10000 });
    const count = await page.locator('#cal-lista .edu-card.fiesta').count();
    expect(count).toBeGreaterThan(0);

    const row = page.locator('#cal-lista .edu-card.fiesta').first();
    await row.click();

    await expect(page.locator('#modal-fiesta')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#mod-title')).not.toHaveText('');
    await expect(page.locator('#mod-fechas')).not.toHaveText('');
    await expect(page.locator('#mod-instr')).not.toHaveText('...');
    await expect(page.locator('#mod-ref')).not.toHaveText('');
});

test('la primera fiesta del ano muestra su seccion de historia y citas de Qumran', async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-cal').click();
    await page.locator('#btn-render-cal').click();
    await expect(page.locator('#cal-lista .edu-card.fiesta').first()).toBeVisible({ timeout: 10000 });

    await page.locator('#cal-lista .edu-card.fiesta').first().click();
    await expect(page.locator('#modal-fiesta')).toBeVisible({ timeout: 10000 });

    await expect(page.locator('#mod-historia')).toBeVisible();
    await expect(page.locator('#mod-historia')).not.toHaveText('');
    await expect(page.locator('#mod-qumran')).toBeVisible();
    await expect(page.locator('#mod-qumran')).toContainText('Qumrán');
});

test('el boton de cerrar cierra el modal de la fiesta', async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-cal').click();
    await page.locator('#btn-render-cal').click();
    await expect(page.locator('#cal-lista .edu-card.fiesta').first()).toBeVisible({ timeout: 10000 });

    await page.locator('#cal-lista .edu-card.fiesta').first().click();
    await expect(page.locator('#modal-fiesta')).toBeVisible({ timeout: 10000 });

    await page.locator('#btn-close-modal').click();
    await expect(page.locator('#modal-fiesta')).not.toBeVisible();
});
