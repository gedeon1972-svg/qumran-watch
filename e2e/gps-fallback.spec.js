import { test, expect } from '@playwright/test';

test('geolocalizacion denegada usa fallback Jerusalen y muestra salida/puesta del sol', async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'geolocation', {
            value: {
                getCurrentPosition: (success, error) =>
                    error({ code: 1, message: 'Permission denied' }),
            },
            configurable: true,
        });
    });

    await page.goto('/');

    await expect(page.locator('#geo-btn')).toContainText('Jerusalén', { timeout: 15000 });
    await expect(page.locator('#geo-btn')).toContainText('GPS Inactivo');

    await expect(page.locator('#sun-rise')).not.toHaveText('');
    await expect(page.locator('#sun-set')).not.toHaveText('');
    await expect(page.locator('#sun-rise')).not.toHaveText('--:--');
    await expect(page.locator('#sun-set')).not.toHaveText('--:--');

    const lat = await page.evaluate(() => localStorage.getItem('qw_lat'));
    const lng = await page.evaluate(() => localStorage.getItem('qw_lng'));
    expect(lat).toBeNull();
    expect(lng).toBeNull();
});

test('geolocalizacion concedida guarda coordenadas y etiqueta GPS', async ({ page }) => {
    await page.context().grantPermissions(['geolocation'], { origin: 'http://localhost:4173' });
    await page.context().setGeolocation({ latitude: 40.4168, longitude: -3.7038 });

    await page.goto('/');

    await expect(page.locator('#sun-rise')).not.toHaveText('', { timeout: 15000 });
    const lat = await page.evaluate(() => localStorage.getItem('qw_lat'));
    const lng = await page.evaluate(() => localStorage.getItem('qw_lng'));
    expect(lat).toBe('40.4168');
    expect(lng).toBe('-3.7038');
});
