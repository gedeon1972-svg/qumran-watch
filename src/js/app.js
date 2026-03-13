/* * js/app.js
 * EL ESPÍRITU (CONTROLADOR)
 * V9.1: Fusión Profesional con Notificaciones y Filología V8.4
 */

import { QumranData } from './data.js';
import { QumranCalendar } from './calendar.js';

let deferredPrompt;
let newWorker;

// 1. SISTEMA DE ACTUALIZACIÓN & SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        const toast = document.getElementById('update-toast');
                        if(toast) toast.style.display = 'flex';
                    }
                });
            });
        });
    });
}

const QumranApp = {
    todayFiesta: null,
    sunriseHour: 6.0,

    init: () => {
        QumranApp.setupListeners();
        if (!QumranApp.loadStoredLocation()) QumranApp.getLocationAndSun(); 
        QumranApp.renderHoy();
        QumranApp.renderSaber();
        QumranApp.checkNotificationStatus(); // Activa el chequeo de avisos
    },

    setupListeners: () => {
        // Navegación
        const views = ['hoy', 'lit', 'cal', 'con', 'edu'];
        views.forEach(v => {
            document.getElementById(`nav-${v}`)?.addEventListener('click', (e) => QumranApp.nav(v, e.currentTarget));
        });

        // Instalación PWA
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (!isIOS) {
                const installContainer = document.getElementById('install-container');
                if (installContainer) installContainer.style.display = 'block';
            }
        });

        document.getElementById('btn-install-app')?.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if(outcome === 'accepted') document.getElementById('install-container').style.display = 'none';
            }
        });

        // NOTIFICACIONES
        document.getElementById('btn-notifications')?.addEventListener('click', QumranApp.requestNotificationPermission);

        // Listeners de UI
        document.getElementById('heb-fiesta')?.addEventListener('click', QumranApp.openFiestaHoy);
        document.getElementById('geo-btn')?.addEventListener('click', () => QumranApp.getLocationAndSun(true));
        document.getElementById('btn-render-cal')?.addEventListener('click', QumranApp.renderCalendar);
        document.getElementById('btn-close-modal')?.addEventListener('click', () => document.getElementById('modal-fiesta').style.display='none');
        document.getElementById('btn-close-lectura')?.addEventListener('click', () => document.getElementById('modal-lectura').style.display='none');
        document.getElementById('btn-refresh')?.addEventListener('click', () => {
            if (newWorker) newWorker.postMessage({ action: 'skipWaiting' });
            window.location.reload();
        });
    },

    // --- MOTOR DE NOTIFICACIONES ---
    checkNotificationStatus: () => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            const notifContainer = document.getElementById('notification-container');
            if (notifContainer) notifContainer.style.display = 'block';
        }
    },

    requestNotificationPermission: async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            document.getElementById('notification-container').style.display = 'none';
            QumranApp.sendNotification('¡Avisos Activados!', 'El Vigía te notificará el inicio de Shabat y Fiestas.');
        }
    },

    sendNotification: (title, body) => {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, {
                body: body,
                icon: 'icon.png',
                badge: 'icon.png',
                vibrate: [200, 100, 200]
            });
        });
    },

    // --- LÓGICA DE NAVEGACIÓN Y GPS ---
    nav: (viewId, btn) => {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-'+viewId).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.scrollTo(0,0);
    },

    loadStoredLocation: () => {
        const lat = localStorage.getItem('qw_lat'), lng = localStorage.getItem('qw_lng');
        if(lat && lng) { QumranApp.updateSunData(parseFloat(lat), parseFloat(lng)); return true; }
        return false;
    },

    getLocationAndSun: (force = false) => {
        if(navigator.geolocation) {
            if(force) document.getElementById('geo-btn').innerText = "Buscando...";
            navigator.geolocation.getCurrentPosition((pos) => {
                localStorage.setItem('qw_lat', pos.coords.latitude);
                localStorage.setItem('qw_lng', pos.coords.longitude);
                QumranApp.updateSunData(pos.coords.latitude, pos.coords.longitude);
            });
        }
    },

    updateSunData: (lat, lng) => {
        let times = QumranApp.calcSunTimes(new Date(), lat, lng);
        if(times.riseDecimal) { QumranApp.sunriseHour = times.riseDecimal; QumranApp.renderHoy(); }
        document.getElementById('sun-rise').innerText = times.rise;
        document.getElementById('sun-set').innerText = times.set;
        document.getElementById('sun-container').style.display = 'flex';
        document.getElementById('geo-btn').innerText = "↻ Actualizar GPS";
    },

    calcSunTimes: (date, lat, lng) => {
        const toRad = Math.PI / 180, toDeg = 180 / Math.PI;
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
        const lngHour = lng / 15;
        const calcTime = (isSunrise) => {
            const t = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24;
            const M = (0.9856 * t) - 3.289;
            let L = M + (1.916 * Math.sin(M * toRad)) + (0.020 * Math.sin(2 * M * toRad)) + 282.634;
            L = (L + 360) % 360;
            let RA = toDeg * Math.atan(0.91764 * Math.tan(L * toRad));
            RA = (RA + 360) % 360;
            RA = (RA + (Math.floor(L/90)*90 - Math.floor(RA/90)*90)) / 15;
            const sinDec = 0.39782 * Math.sin(L * toRad), cosDec = Math.cos(Math.asin(sinDec));
            const cosH = (Math.cos(90.833 * toRad) - (sinDec * Math.sin(lat * toRad))) / (cosDec * Math.cos(lat * toRad));
            if (cosH > 1 || cosH < -1) return null;
            const H = (isSunrise ? (360 - toDeg * Math.acos(cosH)) : (toDeg * Math.acos(cosH))) / 15;
            let UT = H + RA - (0.06571 * t) - 6.622 - lngHour;
            let localT = (UT + (-date.getTimezoneOffset()/60) + 24) % 24;
            return localT;
        };
        const rD = calcTime(true), sD = calcTime(false);
        const f = (d) => d ? `${Math.floor(d).toString().padStart(2,'0')}:${Math.floor((d-Math.floor(d))*60).toString().padStart(2,'0')}` : "--:--";
        return { rise: f(rD), set: f(sD), riseDecimal: rD };
    },

    // --- RENDERIZADO PRINCIPAL ---
    renderHoy: () => {
        let hoy = new Date();
        if ((hoy.getHours() + hoy.getMinutes()/60) < QumranApp.sunriseHour) hoy.setDate(hoy.getDate() - 1);
        let q = QumranCalendar.calculate(hoy);
        if (!q) return;

        document.getElementById('greg-date').innerText = hoy.toLocaleDateString('es-ES', {weekday:'long', day:'numeric', month:'long'});
        
        if (q.special) {
            document.getElementById('heb-date').innerText = "SEMANA DE AJUSTE";
        } else {
            document.getElementById('heb-date').innerText = `${q.d} del ${QumranData.MESES[q.m]}`;
            document.getElementById('heb-dia').innerText = QumranData.DIAS[q.idxSem];
            document.getElementById('heb-turno').innerText = q.turno;
            document.getElementById('heb-estacion').innerText = q.est;

            // Puerta Solar
            document.getElementById('heb-puerta-num').innerText = `Puerta ${q.puerta}`;
            const dots = document.querySelectorAll('.gate-dot');
            dots.forEach((dot, idx) => dot.classList.toggle('active', (idx + 1) === q.puerta));

            // Shabat Progress
            const prog = ((q.idxSem + 1) / 7) * 100;
            document.getElementById('shabat-progress').style.width = prog + "%";
            document.getElementById('shabat-text').innerText = q.idxSem === 6 ? "¡SHABAT SHALOM!" : `Día ${q.idxSem + 1} de la semana`;

            // Omer y Teshuva
            document.getElementById('card-omer').style.display = q.omer ? 'block' : 'none';
            if(q.omer) document.getElementById('omer-count').innerText = q.omer;
            document.getElementById('card-teshuva').style.display = q.teshuva ? 'block' : 'none';
            if(q.teshuva) {
                document.getElementById('teshuva-cmd').innerText = q.teshuva.cmd;
                document.getElementById('teshuva-ref').innerText = q.teshuva.ref;
            }

            // Instrucción del Mesías (Filología)
            let h = QumranData.HALAKHA[Math.floor((q.dCountYear || 0) / 7) % QumranData.HALAKHA.length];
            document.getElementById('messiah-theme').innerText = h.t;
            document.getElementById('messiah-hebrew').innerText = h.h || "";
            document.getElementById('messiah-quote').innerText = `"${h.q}"`;
            document.getElementById('messiah-context').innerText = h.c || "";
            document.getElementById('messiah-philology').innerText = h.f || "";
            document.getElementById('messiah-action').innerText = `${h.a} (${h.r})`;

            // Liturgia
            let s = q.idxSem === 6 ? QumranData.CANTICOS_SHABAT[Math.floor((q.dCountYear || 0) / 7) % 13] : QumranData.SALMOS[q.idxSem];
            if (s) {
                document.getElementById('page-lit-title').innerText = s.t;
                document.getElementById('page-lit-text').innerHTML = (s.c ? `<div class="context-box">${s.c}</div>` : '') + s.v.replace(/\n/g, '<br>');
            }

            // Fiestas
            let fIdx = QumranData.FIESTAS.findIndex(x => x.m === q.m && x.d === q.d);
            const badge = document.getElementById('heb-fiesta');
            if(fIdx !== -1) {
                QumranApp.todayFiesta = fIdx;
                badge.innerText = "⭐ " + QumranData.FIESTAS[fIdx].n;
                badge.style.display = "inline-block";
            } else {
                badge.style.display = "none";
            }
        }
    },

    renderSaber: () => {
        const container = document.getElementById('edu-grid');
        if(!container) return;
        container.innerHTML = "";
        QumranData.ESTUDIOS.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = "edu-card";
            card.innerHTML = `<div class="edu-card-title">${item.t}</div><div class="edu-card-subtitle">${item.s}</div><div class="edu-card-arrow">➔</div>`;
            card.onclick = () => QumranApp.openEstudio(idx);
            container.appendChild(card);
        });
    },

    openEstudio: (idx) => {
        const e = QumranData.ESTUDIOS[idx];
        document.getElementById('lec-title').innerText = e.t;
        document.getElementById('lec-body').innerHTML = e.c;
        document.getElementById('modal-lectura').style.display = 'flex';
    },

    openFiestaHoy: () => {
        if(QumranApp.todayFiesta === null) return;
        const f = QumranData.FIESTAS[QumranApp.todayFiesta];
        document.getElementById('mod-title').innerText = f.n;
        document.getElementById('mod-instr').innerText = f.i;
        document.getElementById('mod-ref').innerText = f.r;
        document.getElementById('modal-fiesta').style.display = 'flex';
    },

    renderCalendar: () => {
        let y = parseInt(document.getElementById('cal-year').value);
        let list = document.getElementById('cal-lista');
        list.innerHTML = "<div class='text-center' style='padding:20px;'>Calculando ciclo sagrado...</div>";
        setTimeout(() => {
            let test = new Date(y, 2, 5); 
            let html = "";
            for(let i=0; i<380; i++) {
                let d = new Date(test.getTime() + (i*86400000));
                let q = QumranCalendar.calculate(d);
                if(!q || q.special) continue;
                let fIdx = QumranData.FIESTAS.findIndex(x => x.m === q.m && x.d === q.d);
                if(fIdx !== -1) {
                    let f = QumranData.FIESTAS[fIdx];
                    let dateLabel = d.toLocaleDateString('es-ES', {day:'numeric', month:'short'});
                    html += `<div class="cal-row fiesta"><div><span class="cal-fiesta-name">${f.n}</span></div><div style="text-align:right;"><span style="font-weight:bold;">${dateLabel}</span></div></div>`;
                }
            }
            list.innerHTML = html;
        }, 50);
    }
};

document.addEventListener('DOMContentLoaded', QumranApp.init);
