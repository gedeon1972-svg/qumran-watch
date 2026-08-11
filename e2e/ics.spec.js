import { test, expect } from '@playwright/test';

test('exportar calendario descarga un archivo .ics valido', async ({ page }) => {
    await page.goto('/');
    await page.locator('#nav-cal').click();
    await expect(page.locator('#view-cal')).toBeVisible();

    await page.locator('#cal-year').fill('2024');
    await page.locator('#btn-render-cal').click();
    await expect(page.locator('#cal-lista')).not.toBeEmpty();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#btn-export-ics').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^Qumran_Moedim_2024\.ics$/);

    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const content = Buffer.concat(chunks).toString('utf8');

    expect(content).toContain('BEGIN:VCALENDAR');
    expect(content).toContain('END:VCALENDAR');
    expect(content).toContain('BEGIN:VEVENT');
    expect(content).toContain('DTSTART');
    expect(content).toContain('SUMMARY');
});
