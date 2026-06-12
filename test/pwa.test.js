import { describe, it, expect } from 'vitest';
import manifest from '../public/manifest.json';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('PWA Configuration Audit', () => {
    it('should have matching versions in manifest and sw.js', () => {
        const swPath = path.resolve(__dirname, '../public/sw.js');

        const swContent = fs.readFileSync(swPath, 'utf8');
        expect(swContent).toContain(manifest.version);
    });

    it('should have correct scope for GitHub Pages', () => {
        expect(manifest.scope).toBe('/qumran-watch/');
        expect(manifest.start_url).toBe('/qumran-watch/');
    });

    it('should use absolute paths in sw.js cache', () => {
        const swContent = fs.readFileSync(path.resolve(__dirname, '../public/sw.js'), 'utf8');
        expect(swContent).toContain('/qumran-watch/');
        expect(swContent).toContain('/qumran-watch/index.html');
        expect(swContent).toContain('/qumran-watch/manifest.json');
        expect(swContent).toContain('/qumran-watch/icon.png');
        expect(swContent).not.toContain('./src/');
    });
});
