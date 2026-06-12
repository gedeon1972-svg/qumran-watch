export function initPwaPrompt() {
    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        showBanner('android', deferredPrompt);
    });

    if (isIOS) {
        showBanner('ios');
    }
}

function showBanner(type, deferredPrompt) {
    let banner = document.getElementById('pwa-install-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'card pwa-install-banner';
        const frame = document.querySelector('.app-frame');
        if (frame) frame.insertBefore(banner, frame.firstChild);
    }

    if (type === 'android' && deferredPrompt) {
        banner.innerHTML =
            '<strong>Instala Qumran Watch</strong><br><span style="font-size:0.85rem;color:var(--text-secondary);">Acceso rapido y uso Offline</span>';
        const btn = document.createElement('button');
        btn.className = 'btn-action';
        btn.textContent = 'Instalar ahora';
        btn.style.marginTop = '10px';
        btn.addEventListener('click', function () {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function () {
                deferredPrompt = null;
                banner.style.display = 'none';
            });
        });
        banner.appendChild(btn);
        banner.style.display = 'block';
    } else if (type === 'ios') {
        banner.innerHTML =
            '<strong>Instalar Qumran Watch en iOS</strong><br><span style="font-size:0.85rem;color:var(--text-secondary);">Toca Compartir y luego Anadir a Inicio</span>';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-btn';
        closeBtn.textContent = 'Entendido';
        closeBtn.style.marginTop = '10px';
        closeBtn.addEventListener('click', function () {
            banner.style.display = 'none';
        });
        banner.appendChild(closeBtn);
        banner.style.display = 'block';
    }
}
