import { test, expect } from '@playwright/test';

async function fireBeforeInstallPrompt(page) {
    await page.evaluate(() => {
        const evt = new CustomEvent('beforeinstallprompt', { cancelable: true });
        evt.prompt = () => {
            evt.promptCalled = true;
        };
        evt.userChoice = Promise.resolve({ outcome: 'accepted' });
        window.dispatchEvent(evt);
    });
}

test('beforeinstallprompt muestra el banner de instalacion con boton', async ({ page }) => {
    await page.goto('/');
    await fireBeforeInstallPrompt(page);
    const banner = page.locator('#pwa-install-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Instala Qumran Watch');
    await expect(banner.locator('button')).toHaveText('Instalar ahora');
});

test('instalar oculta el banner tras aceptar', async ({ page }) => {
    await page.goto('/');
    await fireBeforeInstallPrompt(page);
    const banner = page.locator('#pwa-install-banner');
    await expect(banner).toBeVisible();
    await banner.locator('button').click();
    await expect(banner).toBeHidden();
});
