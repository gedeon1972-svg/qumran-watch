/* * src/js/app.js
 * EL ESPÍRITU (CONTROLADOR PRINCIPAL)
 * V12.0: Reconstrucción Modular Blindada
 */

// --- 1. IMPORTACIÓN DE MÓDULOS ---
import { QumranData } from './data.js';
import { QumranCalendar } from './calendar.js';
import { QumranSun } from './sun.js';
import { QumranICS } from './ics.js';

let deferredPrompt;
let newWorker;

// --- 2. GESTIÓN DE SERVICE WORKER & ACTUALIZACIONES ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        const toast = document.getElementById('update-toast');
                        const btn = document.getElementById('btn-refresh');
                        if (toast && btn) {
                            toast.style.display = 'flex';
                            btn.addEventListener('click', () => {
                                if (newWorker) newWorker.postMessage({ action: 'skipWaiting' });
                                window.location.reload();
                            });
                        }
                    }
                });
            });
        });
    });
}

// --- 3. LÓGICA DE INSTALACIÓN PWA ---
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isIOS) {
        const installContainer = document.getElementById('install-container');
        if (installContainer) installContainer.style.display = 'block';
    }
});

// --- 4. OBJETO PRINCIPAL DE LA APLICACIÓN ---
const QumranApp = {
    currentFiestaIdx: null,
    todayFiesta: null,
    sunriseHour: 6.0,

    init: () => {
        QumranApp.setupListeners();
        const hasMemory = QumranApp.loadStoredLocation();
        if (!hasMemory) QumranApp.getLocationAndSun(); 
        QumranApp.renderHoy();
        QumranApp.renderSaber(); 
        
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
            window.open('https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz', '_blank');
        });
        document.getElementById('btn-institute-con').addEventListener('click', () => {
            window.open('https://www.descubrelabiblia.online/', '_blank');
        });
        // El botón de Telegram se maneja con onclick directo en el HTML según tu original.

        // Calendario y Alertas
        document.getElementById('btn-render-cal').addEventListener('click', QumranApp.renderCalendar);
        const btnExportICS = document.getElementById('btn-export-ics');
        if (btnExportICS) {
            btnExportICS.addEventListener('click', () => {
                let y = document.getElementById('cal-year') ? parseInt(document.getElementById('cal-year').value) : new Date().getFullYear();
                QumranICS.generateAndDownload(y);
            });
        }

        // Delegación de eventos para listas dinámicas
        document.getElementById('cal-lista').addEventListener('click', (e) => {
            const row = e.target.closest('.cal-row.fiesta');
            if (row) QumranApp.openFiesta(parseInt(row.dataset.index), parseInt(row.dataset.year));
        });
        
        document.getElementById('edu-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.edu-card');
            if (card) QumranApp.openEstudio(parseInt(card.dataset.index));
        });

        // Cierre de Modales
        document.getElementById('btn-close-modal').addEventListener('click', () => document.getElementById('modal-fiesta').style.display='none');
        document.getElementById('btn-close-lectura').addEventListener('click', () => document.getElementById('modal-lectura').style.display='none');
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
        
        if (!isHistoryEvent) window.history.pushState({ view: viewId }, '', '#' + viewId);
        window.scrollTo(0, 0);
    },

    loadStoredLocation: () => {
        const lat = localStorage.getItem('qw_lat');
        const lng = localStorage.getItem('qw_lng');
        if (lat && lng) { QumranApp.updateSunData(parseFloat(lat), parseFloat(lng)); return true; }
        return false;
    },

    getLocationAndSun: (force = false) => {
        if (navigator.geolocation) {
            if (force) document.getElementById('geo-btn').innerText = "Buscando...";
            navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude; const lng = pos.coords.longitude;
                localStorage.setItem('qw_lat', lat); localStorage.setItem('qw_lng', lng);
                QumranApp.updateSunData(lat, lng);
            }, () => { 
                if (force) document.getElementById('geo-btn').innerText = "Error GPS. Reintentar."; 
            });
        }
    },

    updateSunData: (lat, lng) => {
        let now = new Date();
        let times = QumranSun.calcSunTimes(now, lat, lng);
        if (times && times.riseDecimal) {
            QumranApp.sunriseHour = times.riseDecimal;
            QumranApp.renderHoy();
        }
        document.getElementById('sun-rise').innerText = times.rise;
        document.getElementById('sun-set').innerText = times.set;
        document.getElementById('sun-container').style.display = 'flex';
        const btn = document.getElementById('geo-btn');
        btn.innerText = "↻ Actualizar Ubicación (GPS)";
        btn.style.display = 'block'; 
    },

    checkWatcher: (hoy, qHoy) => {
        let msg = ""; 
        let alertBox = document.getElementById('alert-container');
        alertBox.style.display = 'none';

        if (qHoy.idxSem === 5) msg += "<strong>¡Día de Preparación!</strong><br>El Shabat entra al próximo amanecer.";
        
        for (let i = 1; i <= 3; i++) {
            let fut = new Date(hoy); fut.setDate(fut.getDate() + i); 
            let qFut = QumranCalendar.calculate(fut);
            if (qFut && !qFut.special) {
                let fIdx = QumranData.FIESTAS.findIndex(x => x.m === qFut.m && x.d === qFut.d);
                if (fIdx !== -1) {
                    if (msg !== "") msg += "<br><hr style='border-color:var(--gold); opacity:0.3; margin:8px 0;'>";
                    msg += `<strong>¡Atención!</strong><br>En ${i} día(s) es <strong>${QumranData.FIESTAS[fIdx].n}</strong>.`;
                }
            }
        }
        
        if (qHoy.m !== undefined && !qHoy.special) {
            let isOmer = false, omerDay = 0;
            if (qHoy.m === 0 && qHoy.d >= 26) { isOmer = true; omerDay = qHoy.d - 25; } 
            else if (qHoy.m === 1) { isOmer = true; omerDay = 5 + qHoy.d; } 
            else if (qHoy.m === 2 && qHoy.d <= 15) { isOmer = true; omerDay = 35 + qHoy.d; } 
            
            if (isOmer && omerDay < 50) {
                document.getElementById('card-omer').style.display = 'block';
                document.getElementById('omer-count').innerText = omerDay;
            } else {
                document.getElementById('card-omer').style.display = 'none';
            }
        }

        if (qHoy.m === 6 && qHoy.d >= 1 && qHoy.d <= 10) {
            let tData = QumranData.YAMIM_NORAIM[qHoy.d - 1];
            document.getElementById('card-teshuva').style.display = 'block';
            document.getElementById('teshuva-cmd').innerText = `DÍA ${qHoy.d}: ${tData.t}`;
            document.getElementById('teshuva-ref').innerText = `Lectura: ${tData.r}`;
        } else {
            document.getElementById('card-teshuva').style.display = 'none';
        }

        if (msg !== "") { 
            document.getElementById('alert-msg').innerHTML = msg; 
            alertBox.style.display = 'block'; 
        }
    },

    renderHoy: () => {
        let hoy = new Date();
        // Ajuste de "Día" según la salida del sol
        if ((hoy.getHours() + (hoy.getMinutes() / 60)) < QumranApp.sunriseHour) {
            hoy.setDate(hoy.getDate() - 1);
        }
        
        let q = QumranCalendar.calculate(hoy);
        document.getElementById('greg-date').innerText = hoy.toLocaleDateString('es-ES', {weekday:'long', day:'numeric', month:'long'});
        
        if (!q) return;

        if (q.special) {
            document.getElementById('heb-date').innerText = "SEMANA DE AJUSTE";
            document.getElementById('heb-dia').innerText = "Reset Solar";
        } else {
            QumranApp.checkWatcher(hoy, q); 
            document.getElementById('heb-date').innerText = `${q.d} del ${QumranData.MESES[q.m]}`;
            document.getElementById('heb-dia').innerText = QumranData.DIAS[q.idxSem];
            document.getElementById('heb-turno').innerText = q.turno;
            document.getElementById('heb-estacion').innerText = q.est;
            
            // Lógica de Instrucción del Mesías
            let hIndex = q.dCountYear ? (Math.floor(q.dCountYear / 7) % QumranData.HALAKHA.length) : 0;
            let h = QumranData.HALAKHA[hIndex];
            document.getElementById('messiah-theme').innerText = h.t;
            document.getElementById('messiah-hebrew').innerText = h.h || "";
            document.getElementById('messiah-context').innerText = h.c ? `Contexto: ${h.c}` : "";
            document.getElementById('messiah-philology').innerText = h.f || "";
            document.getElementById('messiah-quote').innerText = `"${h.q}"`;
            document.getElementById('messiah-action').innerText = `${h.a} (${h.r})`;

            // Distintivo de Fiesta
            let fIdx = QumranData.FIESTAS.findIndex(x => x.m === q.m && x.d === q.d);
            if (fIdx !== -1) {
                QumranApp.todayFiesta = fIdx;
                document.getElementById('heb-fiesta').innerText = "★ " + QumranData.FIESTAS[fIdx].n;
            } else { 
                QumranApp.todayFiesta = null; 
                document.getElementById('heb-fiesta').innerText = ""; 
            }

            // Puertas del Sol
            document.querySelectorAll('.gate-dot').forEach((d,i) => d.classList.toggle('active', (i+1) === q.puerta));
            document.getElementById('heb-puerta-num').innerText = q.puerta + "ª Puerta";

            // Progreso del Shabat y Liturgia
            let percent = ((q.idxSem + 1) / 7) * 100;
            let s = null; let litType = ""; let litMain = "";
            
            if (q.idxSem === 6) { 
                document.getElementById('shabat-text').innerText = "¡SHABAT SHALOM!";
                document.getElementById('shabat-progress').style.background = "#fff";
                percent = 100;
                s = QumranData.CANTICOS_SHABAT[Math.floor((q.dCountYear || 0) / 7) % 13];
                litType = "LITURGIA CELESTIAL"; 
                litMain = "CÁNTICO DEL SACRIFICIO DEL SHABAT";
            } else {
                document.getElementById('shabat-text').innerText = `Faltan ${6 - q.idxSem} días para el Shabat`;
                s = QumranData.SALMOS[q.idxSem];
                litType = "LITURGIA DEL TEMPLO"; 
                litMain = "SALMO DEL DÍA";
            }
            document.getElementById('shabat-progress').style.width = percent + "%";
            
            if (s) {
                document.getElementById('lit-main-title').innerText = litMain;
                document.getElementById('page-lit-type').innerText = litType;
                document.getElementById('page-lit-title').innerText = s.t;
                let cHTML = s.c ? `<div style="background:rgba(212,175,55,0.15); padding:15px; border-left:4px solid #d4af37; margin-bottom:25px; font-style:italic;"><strong>Contexto:</strong><br>${s.c}</div>` : '';
                document.getElementById('page-lit-text').innerHTML = cHTML + `<div style="line-height:1.8;">${s.v.replace(/\n/g, '<br>')}</div>`;
            }
        }
    },

    openFiesta: (index, forceYear) => {
        let f = QumranData.FIESTAS[index];
        let year = forceYear || new Date().getFullYear();
        let anchorGreg = new Date(year, 2, 20); 
        let foundDate = null;
        for (let i = -20; i < 370; i++) {
            let d = new Date(anchorGreg.getTime() + (i * 86400000));
            let q = QumranCalendar.calculate(d);
            if (q && !q.special && q.m === f.m && q.d === f.d) { foundDate = d; break; }
        }
        
        // RESTAURACIÓN: Día de la semana completo
        let dateStr = foundDate ? foundDate.toLocaleDateString('es-ES', {weekday:'long', day:'numeric', month:'long'}) : "Calculando...";
        if (foundDate && f.dur > 1) { 
            let end = new Date(foundDate); end.setDate(end.getDate() + f.dur - 1); 
            dateStr += " al " + end.toLocaleDateString('es-ES', {weekday:'long', day:'numeric', month:'long'}); 
        }

        document.getElementById('mod-title').innerText = f.n;
        document.getElementById('mod-fechas').innerText = dateStr + ` (${year})`;
        document.getElementById('mod-fechas-heb').innerText = `${f.d} del ${QumranData.MESES[f.m]}\n${f.es}`;
        document.getElementById('mod-instr').innerText = f.instr;
        document.getElementById('mod-ref').innerText = f.ref;
        document.getElementById('mod-note').style.display = f.nota ? 'block' : 'none';
        if (f.nota) document.getElementById('mod-note').innerText = f.nota;
        document.getElementById('mod-warn').style.display = f.especial ? 'block' : 'none';
        document.getElementById('modal-fiesta').style.display = 'flex';
    },
    
    openFiestaHoy: () => { if (QumranApp.todayFiesta !== null) QumranApp.openFiesta(QumranApp.todayFiesta); },

    renderSaber: () => {
        const container = document.getElementById('edu-grid');
        if (!container) return; 
        container.innerHTML = "";
        let htmlCards = "";
        QumranData.ESTUDIOS.forEach((item, idx) => {
            htmlCards += `<div class="edu-card" data-index="${idx}"><div class="edu-card-title">${item.t}</div><div class="edu-card-subtitle">${item.s}</div><div class="edu-card-arrow">➔</div></div>`;
        });
        container.innerHTML = htmlCards;
    },
    
    openEstudio: (index) => {
        const estudio = QumranData.ESTUDIOS[index];
        if (!estudio) return;
        document.getElementById('lec-title').innerText = estudio.t;
        document.getElementById('lec-meta').innerText = estudio.s;
        document.getElementById('lec-body').innerHTML = estudio.c;
        document.getElementById('modal-lectura').style.display = 'flex';
    },

    renderCalendar: () => {
        let y = document.getElementById('cal-year') ? parseInt(document.getElementById('cal-year').value) : new Date().getFullYear();
        let list = document.getElementById('cal-lista');
        if (!list) return;
        list.innerHTML = "<div class='text-center' style='padding:20px;'>Calculando ciclo sagrado...</div>";
        setTimeout(() => {
            let test = new Date(y, 2, 5); let html = "";
            for (let i = 0; i < 380; i++) {
                let d = new Date(test.getTime() + (i * 86400000));
                let q = QumranCalendar.calculate(d);
                if (!q || q.special) continue;
                let fIdx = QumranData.FIESTAS.findIndex(x => x.m === q.m && x.d === q.d);
                if (fIdx !== -1) {
                    let f = QumranData.FIESTAS[fIdx];
                    let dateLabel = d.toLocaleDateString('es-ES', {day:'numeric', month:'short'});
                    if (f.dur > 1) { 
                        let end = new Date(d); end.setDate(end.getDate() + f.dur - 1); 
                        dateLabel += " - " + end.toLocaleDateString('es-ES', {day:'numeric', month:'short'}); 
                    }
                    html += `
<div class="edu-card fiesta" data-index="${fIdx}" data-year="${y}">
    <div class="edu-card-title">${f.n}</div>
    <div class="edu-card-subtitle">${f.es}</div>
    <div class="card-meta-info">
        <span>${dateLabel}</span>
        <span class="q-date">Qumrán: ${q.d}/${q.m+1}</span>
    </div>
    <div class="edu-card-arrow">➔</div>
</div>`;
                }
            }
            list.innerHTML = html || "<div class='card'>No se encontraron fiestas.</div>";
        }, 50);
    }
};

document.addEventListener('DOMContentLoaded', QumranApp.init);
