import { test, expect } from '@playwright/test';

function notifMock(permResult) {
    return (page) => page.addInitScript((result) => {
        const Not = function (title) {
            this.title = title;
        };
        Not.permission = 'default';
        Not.requestPermission = async () => {
            Not.permission = result;
            return result;
        };
        window.Notification = Not;
    }, permResult);
}

async function clickToastWhenVisible(page) {
    await page.waitForFunction(() => {
        const t = document.querySelector('.toast');
        if (t) {
            t.click();
            return true;
        }
        return false;
    }, { timeout: 15000 });
}

test('aceptar permiso de notificaciones activa recordatorios', async ({ page }) => {
    await notifMock('granted')(page);
    await page.goto('/');
    await clickToastWhenVisible(page);
    await expect(page.locator('.toast').last()).toContainText('Recordatorios activados', { timeout: 15000 });
});

test('denegar permiso de notificaciones muestra mensaje de fallback', async ({ page }) => {
    await notifMock('denied')(page);
    await page.goto('/');
    await clickToastWhenVisible(page);
    await expect(page.locator('.toast').last()).toContainText('Recordatorios no activados', { timeout: 15000 });
});
