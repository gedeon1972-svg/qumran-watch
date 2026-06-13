(function () {
    let theme;
    try {
        theme = localStorage.getItem('qw_theme');
    } catch {
        theme = null;
    }
    if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }
})();
