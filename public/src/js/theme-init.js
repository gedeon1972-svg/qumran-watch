(function () {
    var theme = localStorage.getItem('qw_theme');
    if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }
})();
