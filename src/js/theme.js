/* src/js/theme.js - SISTEMA DE TEMAS CLARO/OSCURO */

const STORAGE_KEY = 'qw_theme';

function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
}

function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function resolveTheme() {
    return getStoredTheme() || getSystemTheme() || 'dark';
}

function applyTheme(theme) {
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');

    if (theme === 'dark') {
        root.classList.add('dark-theme');
        if (toggle) toggle.textContent = '\u2600';
    } else {
        root.classList.remove('dark-theme');
        if (toggle) toggle.textContent = '\u263D';
    }
}

function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark-theme');
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
}

function initTheme() {
    const theme = resolveTheme();
    applyTheme(theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', toggleTheme);
    }

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

export { initTheme, toggleTheme, applyTheme, getStoredTheme, getSystemTheme, resolveTheme };
