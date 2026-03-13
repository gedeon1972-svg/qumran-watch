/* * js/app.js
 * EL ESPÍRITU (CONTROLADOR PRINCIPAL)
 * V10.0: Arquitectura Modular Limpia (SunEngine & ICS extraídos)
 */

// --- 0. IMPORTAMOS LOS MÓDULOS DEL MOTOR ---
import { QumranData } from './data.js';
import { QumranCalendar } from './calendar.js';
import { QumranSun } from './sun.js';     // NUEVO MÓDULO ASTRONÓMICO
import { QumranICS } from './ics.js';     // NUEVO MÓDULO DE ALERTAS PUSH

let deferredPrompt;
let newWorker;

// 1. SISTEMA DE ACTUALIZACIÓN & SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            console.log('SW registrado:', reg.scope);
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
        }).catch(err => console.error('Error SW:', err));
    });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isIOS) {
      const installContainer = document.getElementById('install-container');
      if (installContainer) installContainer.style.display = 'block';
  }
});

function showUpdateNotification() {
    const toast = document.getElementById('update-toast');
    const btn = document.getElementById('btn-refresh');
    if(toast && btn) {
        toast.style.display = 'flex';
        btn.addEventListener('click', () => {
            if (newWorker) newWorker.postMessage({ action: 'skipWaiting' });
            window.location.reload();
        });
    }
}

const QumranApp = {
    currentFiestaIdx: null,
    todayFiesta: null,
    sunriseHour: 6.0,

    init: () => {
        console.log("Iniciando Qumran Watch V10 (Arquitectura Modular)...");
        QumranApp.setupListeners();
        
        const hasMemory = QumranApp.loadStoredLocation();
        if (!hasMemory) QumranApp.getLocationAndSun(); 

        QumranApp.renderHoy();
        QumranApp.renderSaber(); 
        
        // --- PREVENCIÓN DE CIERRE INESPERADO (HISTORY API) ---
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
        document.getElementById('nav-hoy').addEventListener('click', (e) => QumranApp.nav('hoy', e.currentTarget));
        document.getElementById('nav-lit').addEventListener('click', (e) => QumranApp.nav('lit', e.currentTarget));
        document.getElementById('nav-cal').addEventListener('click', (e) => QumranApp.nav('cal', e.currentTarget));
        document.getElementById('nav-con').addEventListener('click', (e) => QumranApp.nav('con', e.currentTarget));
        document.getElementById('nav-edu').addEventListener('click', (e) => QumranApp.nav('edu', e.currentTarget));
        
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isIOS) {
            const installContainer = document.getElementById('install-container');
            if (installContainer) {
                installContainer.innerHTML = `
                    <div style="background: rgba(212, 175, 55, 0.15); padding: 15px; border-radius: 12px; border: 1px solid var(--gold); text-align: center; margin-bottom: 20px;">
                        <p style="margin:0 0 8px 0; font-weight:bold; color:var(--gold); font-family:'Cinzel',serif;">PARA INSTALAR EN IPHONE:</p>
                        <p style="margin:0; font-size:0.85rem; line-height:1.5;">
                            1. Abre esta web en <strong>Safari</strong>.<br>
                            2. Toca el botón <span style="font-size:1.2rem; display:inline-block; transform:translateY(3px);">⎋</span> (Compartir).<br>
                            3. Elige <span style="font-weight:bold; color:#fff;">"Agregar a Inicio"</span>.
                        </p>
                    </div>
                `;
                installContainer.style.display = 'block';
            }
        }

        const btnInstall = document.getElementById('btn-install-app');
        if(btnInstall) {
            btnInstall.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    deferredPrompt = null;
                    if(outcome === 'accepted'){
                        document.getElementById('install-container').style.display = 'none';
                    }
                }
            });
        }
        
        document.getElementById('heb-fiesta').addEventListener('click', QumranApp.openFiestaHoy);
        document.getElementById('geo-btn').addEventListener('click', () => QumranApp.getLocationAndSun(true));
        
        const openPodcast = () => window.open('https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz', '_blank');
        const openInstitute = () => window.open('https://www.descubrelabiblia.online/', '_blank');
        document.getElementById('btn-podcast-con').addEventListener('click', openPodcast);
        document.getElementById('btn-institute-con').addEventListener('click', openInstitute);
        
        document.getElementById('btn-render-cal').addEventListener('click', QumranApp.renderCalendar);
        document.getElementById('btn-close-modal').addEventListener('click', () => document.getElementById('modal-fiesta').style.display='none');
        document.getElementById('btn-close-lectura').addEventListener('click', () => document.getElementById('modal-lectura').style.display='none');

        // NUEVO: Conectar el botón de exportar alertas al módulo ICS
        const btnExportICS = document.getElementById('btn-export-ics');
        if (btnExportICS) {
            btnExportICS.addEventListener('click', () => {
                let calInput = document.getElementById('cal-year');
                let y = calInput ? parseInt(calInput.value) : new Date().getFullYear();
                QumranICS.generateAndDownload(y);
            });
        }

        document.getElementById('cal-lista').addEventListener('click', (e) => {
            const row = e.target.closest('.cal-row.fiesta');
            if (row) {
                const idx = parseInt(row.dataset.index);
                const year = parseInt(row.dataset.year);
                QumranApp.openFiesta(idx, year);
            }
        });
        
        document.getElementById('edu-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.edu-card');
            if (card) {
                const idx = parseInt(card.dataset.index);
                QumranApp.openEstudio(idx);
            }
        });
    },

    nav: (viewId, btn, isHistoryEvent = false) => {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById('view-' + viewId);
        if (targetView) targetView.classList.add('active');
        
        if (btn) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        } else {
            document.querySelectorAll('.nav-btn').forEach(b => {
                b.classList.toggle('active', b.id === 'nav-' + viewId);
            });
        }
        
        if (!isHistoryEvent) {
            window.history.pushState({ view: viewId }, '', '#' + viewId);
        }
        window.scrollTo(0, 0);
    },
    
    loadStoredLocation: () => {
        const storedLat = localStorage.getItem('qw_lat');
        const storedLng = localStorage.getItem('qw_lng');
        if(storedLat && storedLng) {
            QumranApp.updateSunData(parseFloat(storedLat), parseFloat(storedLng));
            return true;
        }
        return false;
    },

    getLocationAndSun: (force = false) => {
        if(navigator.geolocation) {
            if(force) document.getElementById('geo-btn').innerText = "Buscando satélites...";
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                localStorage.setItem('qw_lat', lat);
                localStorage.setItem('qw_lng', lng);
                QumranApp.updateSunData(lat, lng);
            }, (err) => { 
                console.warn(err);
                document.getElementById('geo-btn').innerText = "Error GPS. Reintentar.";
            });
        }
    },

    updateSunData: (lat, lng) => {
        let now = new Date();
        // USANDO EL NUEVO MÓDULO EXTERNO DE SOL
        let times = QumranSun.calcSunTimes(now, lat, lng); 
        if(times && times.riseDecimal) {
            QumranApp.sunriseHour = times.riseDecimal;
            QumranApp.renderHoy();
        }
        let div = document.getElementById('sun-container');
        document.getElementById('sun-rise').innerText = times.rise;
        document.getElementById('sun-set').innerText = times.set;
        div.style.display = 'flex';
        const btn = document.getElementById('geo-btn');
        btn.innerText = "↻ Actualizar Ubicación (GPS)";
        btn.style.display = 'block'; 
    },

    checkWatcher: (hoy, qHoy) => {
        let msg = ""; 
        let alertBox = document.getElementById('alert-container');
        let alertMsg = document.getElementById('alert-msg');
        alertBox.style.display = 'none';
        
        if(qHoy.idxSem === 5) { msg += "<strong>¡Día de Preparación!</strong><br>El Shabat entra al próximo amanecer."; }
        
        for(let i=1; i<=3; i++) {
            let fut = new Date(hoy); fut.setDate(fut.getDate() + i); 
            let qFut = QumranCalendar.calculate(fut);
            if(qFut && !qFut.special) {
                let fIdx = QumranData.FIESTAS.findIndex(x => x.m === qFut.m && x.d === qFut.d);
                if(fIdx !== -1) {
                    if(msg !== "") msg += "<br><hr style='border-color:var(--gold); opacity:0.3; margin:8px 0;'>";
                    msg += `<strong>¡Atención!</strong><br>En ${i} día(s) es <strong>${QumranData.FIESTAS[fIdx].n}</strong>.`;
                }
            }
        }
        
        if(qHoy.m !== undefined && !qHoy.special) {
            let isOmer = false, omerDay = 0;
            if (qHoy.m === 0 && qHoy.d >= 26) { isOmer = true; omerDay = qHoy.d - 25; } 
            else if (qHoy.m === 1) { isOmer = true; omerDay = 5 + qHoy.d; } 
            else if (qHoy.m === 2 && qHoy.d <= 15) { isOmer = true; omerDay = 35 + qHoy.d; } 
            
            if(isOmer && omerDay < 50) {
                document.getElementById('card-omer').style.display = 'block';
                document.getElementById('omer-count').innerText = omerDay;
            } else { document.getElementById('card-omer').style.display = 'none'; }
        }

        if(qHoy.m === 6 && qHoy.d >= 1 && qHoy.d <= 10) {
            let teshuvaIndex = qHoy.d - 1;
            let tData = QumranData.YAMIM_NORAIM[teshuvaIndex];
            document.getElementById('card-teshuva').style.display = 'block';
            document.getElementById('teshuva-cmd').innerText = `DÍA ${qHoy.d}: ${tData.t}`;
            document.getElementById('teshuva-ref').innerText = `Lectura: ${tData.r}`;
        } else { document.getElementById('card-teshuva').style.display = 'none'; }

        if(msg !== "") { alertMsg.innerHTML = msg; alertBox.style.display = 'block'; }
    },

    renderHoy: () => {
        let hoy = new Date();
        let currentHourDecimal = hoy.getHours() + (hoy.getMinutes() / 60);
        if (currentHourDecimal < QumranApp.sunriseHour) hoy.setDate(hoy.getDate() - 1);
        
        let q = QumranCalendar.calculate(hoy);
        document.getElementById('greg-date').innerText = hoy.toLocaleDateString('es-ES', {weekday:'long', day:'numeric', month:'long'});

        if (!q) { document.getElementById('heb-date').innerText = "Esperando..."; return; }

        if (q.special) {
            document.getElementById('heb-date').innerText = "SEMANA DE AJUSTE";
            document.getElementById('heb-dia').innerText = "Reset Solar";
        } else {
            QumranApp.checkWatcher(hoy, q); 
            document.getElementById('heb-date').innerText = `${q.d} del ${QumranData.MESES[q.m]}`;
            document.getElementById('heb-dia').innerText = QumranData.DIAS[q.idxSem];
            document.getElementById('heb-turno').innerText = q.turno;
