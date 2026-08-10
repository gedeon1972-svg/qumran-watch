/* * src/js/app.js
 * EL ESPÍRITU (CONTROLADOR PRINCIPAL)
 * V13.0.0: Reconstrucción Modular Blindada
 */

// --- 1. IMPORTACIÓN DE MÓDULOS ---
import { QumranData } from './core/data.js';
import { QumranCalendar } from './core/calendar.js';
import { QumranICS } from './ics.js';
import { initTheme } from './theme.js';
import { storage } from './core/storage.js';
import { findFestivalDate, getFestivalsForYear, buildHoyViewModel } from './core/calculations.js';
import { renderHoyView } from './ui/hoy-view.js';
import { renderCalendarView } from './ui/calendar-view.js';
import { renderSunView } from './ui/sun-view.js';
import { renderSaberGrid, renderEstudioModal } from './ui/estudio-view.js';
import { renderFiestaModal } from './ui/fiesta-view.js';
import { initPwaPrompt } from './ui/pwa-install.js';
import { getSunriseTime } from './core/time-translator.js';
import { Notifications } from './core/notifications.js';
import { calcSunTimesAsync } from './core/sun-worker-client.js';
import './theme-init.js';

// Versión inyectada automáticamente por Vite desde package.json (vite.config.js → define)
const APP_VERSION = __APP_VERSION__;

// --- 2. GESTIÓN DE SERVICE WORKER & ACTUALIZACIONES ---

console.log('Qumran Watch v' + APP_VERSION + ' - System Online');
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('/qumran-watch/sw.js', { scope: '/qumran-watch/' })
            .then(function (registration) {
                console.log('SW Registered');
                QumranApp.registerPeriodicSync(registration);
                QumranApp.setupSWUpdate(registration);
                console.log(
                    '[DEBUG VIGIA] Elemento DOM encontrado:',
                    document.getElementById('vigia-progress-container') !== null,
                );
            })
            .catch(function (err) {
                console.error('SW Error:', err);
            });
    });
}

// --- 4. OBJETO PRINCIPAL DE LA APLICACIÓN ---
const QumranApp = {
    todayFiesta: null,
    sunriseHour: 6.0,

    init: () => {
        initTheme();
        const verEl = document.getElementById('app-version');
        if (verEl) verEl.textContent = 'v' + APP_VERSION;
        initPwaPrompt();
        QumranApp.setupListeners();
        const hasMemory = QumranApp.loadStoredLocation();
        if (!hasMemory) QumranApp.getLocationAndSun();
        QumranApp.renderHoy();
        QumranApp.renderSaber();
        QumranApp.setupNotifications();

        // Manejo del historial y botón "atrás"
        window.history.replaceState({ view: 'hoy' }, '', '#hoy');
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.view) {
                QumranApp.nav(event.state.view, null, true);
            } else {
                QumranApp.nav('hoy', null, true);
            }
        });
    },

    setupListeners: () => {
        // Navegación
        document.getElementById('nav-hoy').addEventListener('click', (e) => QumranApp.nav('hoy', e.currentTarget));
        document.getElementById('nav-lit').addEventListener('click', (e) => QumranApp.nav('lit', e.currentTarget));
        document.getElementById('nav-cal').addEventListener('click', (e) => QumranApp.nav('cal', e.currentTarget));
        document.getElementById('nav-con').addEventListener('click', (e) => QumranApp.nav('con', e.currentTarget));
        document.getElementById('nav-edu').addEventListener('click', (e) => QumranApp.nav('edu', e.currentTarget));
        // Interacción Hoy
        document.getElementById('heb-fiesta').addEventListener('click', QumranApp.openFiestaHoy);
        document.getElementById('geo-btn').addEventListener('click', () => QumranApp.getLocationAndSun(true));

        // Comunidad y Recursos
        document.getElementById('btn-podcast-con').addEventListener('click', () => {
            window.open(
                'https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz',
                '_blank',
                'noopener,noreferrer',
            );
        });
        document.getElementById('btn-institute-con').addEventListener('click', () => {
            window.open('https://www.descubrelabiblia.online/', '_blank', 'noopener,noreferrer');
        });
        document.getElementById('card-evangelio').addEventListener('click', () => {
            window.open('https://www.descubreelevangelio.org/', '_blank', 'noopener,noreferrer');
        });
        document.getElementById('card-edifica').addEventListener('click', () => {
            window.open('https://www.edificamicasa.com/', '_blank', 'noopener,noreferrer');
        });
        document.getElementById('card-whatsapp').addEventListener('click', () => {
            window.open('https://chat.whatsapp.com/JC2v8lmTQaXJP0xIaeZWb7?mode=gi_t', '_blank', 'noopener,noreferrer');
        });
        // El bot�n de Telegram se maneja con onclick directo en el HTML seg�n tu original.

        // Calendario y Alertas
        document.getElementById('btn-render-cal').addEventListener('click', QumranApp.renderCalendar);
        const btnExportICS = document.getElementById('btn-export-ics');
        if (btnExportICS) {
            btnExportICS.addEventListener('click', async () => {
                const y = document.getElementById('cal-year')
                    ? parseInt(document.getElementById('cal-year').value)
                    : new Date().getFullYear();
                try {
                    if (navigator.onLine) {
                        QumranICS.generateAndDownload(y);
                        QumranApp.showToast('Calendario ICS generado');
                    } else {
                        await QumranICS.queueICSForSync(y);
                        QumranApp.showToast('Sin conexión. Calendario encolado para sincronizar cuando haya red.');
                    }
                } catch (err) {
                    const alertBox = document.getElementById('alert-container');
                    const alertMsg = document.getElementById('alert-msg');
                    if (alertBox && alertMsg) {
                        alertMsg.innerHTML = '';
                        const errStrong = document.createElement('strong');
                        errStrong.appendChild(document.createTextNode('Error al generar calendario: '));
                        alertMsg.appendChild(errStrong);
                        alertMsg.appendChild(document.createTextNode(err.message || ''));
                        alertBox.style.display = 'block';
                    }
                }
            });
        }

        // Delegación de eventos para listas dinámicas
        document.getElementById('cal-lista').addEventListener('click', (e) => {
            const row = e.target.closest('.edu-card.fiesta');
            if (row) QumranApp.openFiesta(parseInt(row.dataset.index), parseInt(row.dataset.year));
        });

        document.getElementById('edu-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.edu-card');
            if (card) QumranApp.openEstudio(parseInt(card.dataset.index));
        });

        // Privacy modal
        const btnPrivacy = document.getElementById('btn-privacy');
        const modalPrivacy = document.getElementById('modal-privacy');
        const btnClosePrivacy = document.getElementById('btn-close-privacy');
        if (btnPrivacy && modalPrivacy) {
            btnPrivacy.addEventListener('click', () => (modalPrivacy.style.display = 'flex'));
        }
        if (btnClosePrivacy && modalPrivacy) {
            btnClosePrivacy.addEventListener('click', () => (modalPrivacy.style.display = 'none'));
        }

        // License modal
        const btnLicense = document.getElementById('btn-license');
        const modalLicense = document.getElementById('modal-license');
        const btnCloseLicense = document.getElementById('btn-close-license');
        if (btnLicense && modalLicense) {
            btnLicense.addEventListener('click', () => (modalLicense.style.display = 'flex'));
        }
        if (btnCloseLicense && modalLicense) {
            btnCloseLicense.addEventListener('click', () => (modalLicense.style.display = 'none'));
        }
        // Cierre de Modales
        document
            .getElementById('btn-close-modal')
            .addEventListener('click', () => (document.getElementById('modal-fiesta').style.display = 'none'));
        document
            .getElementById('btn-close-lectura')
            .addEventListener('click', () => (document.getElementById('modal-lectura').style.display = 'none'));
        document.getElementById('btn-close-mishmar').addEventListener('click', function () {
            document.getElementById('modal-mishmar').style.display = 'none';
        });
        document.getElementById('btn-close-estacion').addEventListener('click', function () {
            document.getElementById('modal-estacion').style.display = 'none';
        });

        // Listener para mensajes del Service Worker (procesar ICS sync)
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', async (event) => {
                if (event.data && event.data.type === 'REFRESH_SOLAR') {
                    QumranApp.refreshSolarData();
                }
                if (event.data && event.data.type === 'PROCESS_ICS_SYNC') {
                    try {
                        const result = await QumranICS.processICSSyncQueue();
                        QumranApp.showToast('Sincronización ICS completada: ' + result.processed + ' calendarios');
                    } catch (err) {
                        console.error('Error en ICS sync:', err);
                    }
                }
            });
        }
    },

    setupNotifications: () => {
        if (!Notifications.init()) return;
        const perm = Notifications.permission();
        if (perm === 'granted') {
            Notifications.checkDue().then(() => Notifications.scheduleUpcoming());
            Notifications.notifyServiceWorker();
        } else if (perm === 'default') {
            // Prompt contextual: toast clicable 4 segundos despues de abrir
            setTimeout(() => {
                QumranApp.showToast('Toca para activar recordatorios de Shabat y Fiestas', async () => {
                    const res = await Notifications.requestPermission();
                    if (res === 'granted') {
                        const n = await Notifications.scheduleUpcoming();
                        QumranApp.showToast('Recordatorios activados: ' + n + ' programados');
                        Notifications.notifyServiceWorker();
                    } else {
                        QumranApp.showToast('Recordatorios no activados');
                    }
                });
            }, 4000);
        }
    },

    registerPeriodicSync: async (registration) => {
        try {
            if (!registration || !registration.periodicSync) {
                console.log('[SW] Periodic Background Sync no soportado en este navegador');
                return;
            }
            const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
            if (status.state !== 'granted') {
                console.log('[SW] Permiso periodic-background-sync no otorgado:', status.state);
                return;
            }
            await registration.periodicSync.register('sun-data', { minInterval: 24 * 60 * 60 * 1000 });
            console.log('[SW] Periodic sync registrado: sun-data (diario)');
        } catch (err) {
            console.warn('[SW] No se pudo registrar periodic sync:', err);
        }
    },

    setupSWUpdate: (registration) => {
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    QumranApp.showToast('Nueva versión disponible — toca para actualizar', () => {
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    });
                }
            });
        });
    },

    refreshSolarData: () => {
        if (QumranApp._lastSunData) {
            QumranApp.updateSunData(
                QumranApp._lastSunData.lat,
                QumranApp._lastSunData.lng,
                'Actualización solar periódica',
            );
        } else {
            QumranApp.renderHoy();
        }
    },

    nav: (viewId, btn, isHistoryEvent = false) => {
        document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
        const targetView = document.getElementById('view-' + viewId);
        if (targetView) targetView.classList.add('active');

        if (btn) {
            document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        } else {
            document.querySelectorAll('.nav-btn').forEach((b) => {
                b.classList.toggle('active', b.id === 'nav-' + viewId);
            });
        }

        if (!isHistoryEvent) window.history.pushState({ view: viewId }, '', '#' + viewId);
        window.scrollTo(0, 0);
    },

    loadStoredLocation: () => {
        const lat = storage.getItem('qw_lat');
        const lng = storage.getItem('qw_lng');
        if (lat && lng) {
            QumranApp.updateSunData(parseFloat(lat), parseFloat(lng));
            return true;
        }
        return false;
    },

    getLocationAndSun: (force = false) => {
        if (navigator.geolocation) {
            if (force) renderSunView(null, 'Buscando...');
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    storage.setItem('qw_lat', lat);
                    storage.setItem('qw_lng', lng);
                    QumranApp.updateSunData(lat, lng, force ? 'Actualizar Ubicación (GPS)' : undefined);
                },
                () => {
                    // --- INICIO DEL RESPALDO BÍBLICO (JERUSALÉN) ---
                    console.warn('GPS falló o denegado. Usando Jerusalén.');
                    const latJerusalen = 31.7683;
                    const lngJerusalen = 35.2137;
                    QumranApp.updateSunData(latJerusalen, lngJerusalen, 'Jerusalén (GPS Inactivo)');
                    // --- FIN DEL RESPALDO ---
                },
            );
        }
    },

    updateSunData: async (lat, lng, geoLabel) => {
        const now = new Date();
        const times = await calcSunTimesAsync(now, lat, lng);

        const _newData = { rise: times.rise, set: times.set, riseDecimal: times.riseDecimal, lat, lng };
        if (QumranApp._lastSunData && JSON.stringify(_newData) === JSON.stringify(QumranApp._lastSunData)) {
            return;
        }
        QumranApp._lastSunData = _newData;
        if (times && times.riseDecimal) {
            QumranApp.sunriseHour = times.riseDecimal;
            QumranApp.renderHoy();
        }
        renderSunView({ rise: times.rise, set: times.set }, geoLabel);
        QumranApp.calculateVigiaStatus();
    },

    renderHoy: () => {
        let hoy = new Date();
        if (hoy.getHours() + hoy.getMinutes() / 60 < QumranApp.sunriseHour) {
            hoy = new Date(hoy.getTime() - 86400000);
        }
        const q = QumranCalendar.calculate(hoy);
        const model = buildHoyViewModel(hoy, q);
        QumranApp.todayFiesta = model.festival ? model.festival.index : null;
        renderHoyView(model);
    },

    openFiesta: (index, forceYear) => {
        // eslint-disable-next-line security/detect-object-injection
        const f = QumranData.FIESTAS[index];
        const year = forceYear || new Date().getFullYear();
        const foundDate = findFestivalDate(index, year);

        // RESTAURACIÓN: Día de la semana completo
        let dateStr = foundDate
            ? foundDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            : 'Calculando...';
        if (foundDate && f.dur > 1) {
            const end = new Date(foundDate.getTime() + (f.dur - 1) * 86400000);
            dateStr += ' al ' + end.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        }

        renderFiestaModal({
            title: f.n,
            fechas: dateStr + ' (' + year + ')',
            fechasHeb: f.d + ' del ' + QumranData.MESES[f.m] + '\n' + f.es,
            instr: f.instr,
            ref: f.ref,
            nota: f.nota || null,
            especial: f.especial || false,
        });
    },

    openFiestaHoy: () => {
        if (QumranApp.todayFiesta !== null) QumranApp.openFiesta(QumranApp.todayFiesta);
    },

    renderSaber: () => {
        renderSaberGrid(QumranData.ESTUDIOS);
    },

    openEstudio: (index) => {
        // eslint-disable-next-line security/detect-object-injection
        const estudio = QumranData.ESTUDIOS[index];
        if (!estudio) return;
        renderEstudioModal(estudio);
    },

    renderCalendar: () => {
        const y = document.getElementById('cal-year')
            ? parseInt(document.getElementById('cal-year').value)
            : new Date().getFullYear();
        const list = document.getElementById('cal-lista');
        if (!list) return;
        list.innerHTML = "<div class='text-center' style='padding:20px;'>Calculando ciclo sagrado...</div>";
        setTimeout(() => {
            const festivals = getFestivalsForYear(y);
            renderCalendarView(festivals, y);
        }, 50);
    },
    calculateVigiaStatus: () => {
        if (!QumranApp._lastSunData) return;
        const lat = QumranApp._lastSunData.lat;
        const lng = QumranApp._lastSunData.lng;
        const sunriseData = getSunriseTime(lat, lng, new Date());
        if (!sunriseData) return;
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;

        // --- Simple text line in sun-container ---
        const sunContainer = document.getElementById('sun-container');
        const existingBar = document.getElementById('vigia-progress-container');
        if (existingBar) existingBar.remove();

        if (currentHour < sunriseData.firstLight) {
            const minsToFirstLight = Math.round((sunriseData.firstLight - currentHour) * 60);
            const hoursLeft = Math.floor(minsToFirstLight / 60);
            const minsLeft = minsToFirstLight % 60;

            const el = document.createElement('div');
            el.id = 'vigia-progress-container';
            el.style.cssText =
                'display:none;width:100%;text-align:center;margin-top:10px;font-size:0.9em;color:#d4af37;';
            el.innerHTML =
                '⏳ Faltan <span id="vigia-hours">' +
                hoursLeft +
                '</span>h <span id="vigia-mins">' +
                minsLeft +
                '</span>m para el Nuevo Día';
            el.style.display = 'block';
            if (sunContainer) sunContainer.appendChild(el);

            // --- Also keep the watcher alert message ---
            const alertContainer = document.getElementById('alert-container');
            const alertMsg = document.getElementById('alert-msg');
            if (alertContainer && alertMsg) {
                const alertExisting = document.getElementById('vigia-solar-msg');
                if (alertExisting) alertExisting.remove();
                const yesterday = new Date(now.getTime() - 86400000);
                const qPrev = QumranCalendar.calculate(yesterday);
                const prevDayLabel = qPrev ? qPrev.d + ' del ' + QumranData.MESES[qPrev.m] : 'día anterior';
                const solarMsg = document.createElement('div');
                solarMsg.id = 'vigia-solar-msg';
                solarMsg.style.cssText =
                    'margin-top:8px;padding-top:8px;border-top:1px solid rgba(212,175,55,0.3);font-size:0.9rem;';
                solarMsg.innerHTML =
                    '<strong>Vigía Solar:</strong> Aún en ' +
                    prevDayLabel +
                    '. El nuevo día comenzará en ~' +
                    minsToFirstLight +
                    ' min.';
                alertMsg.appendChild(solarMsg);
                alertContainer.style.display = 'block';
            }
        }
    },
    showToast: (msg, onClick) => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        if (onClick) {
            toast.classList.add('toast-clickable');
            toast.addEventListener('click', onClick);
        }
        container.appendChild(toast);
        toast.addEventListener('animationend', () => toast.remove());
        setTimeout(() => toast.remove(), onClick ? 8000 : 3000);
    },
};

document.addEventListener('DOMContentLoaded', QumranApp.init);

window.QumranApp = QumranApp;
