/* * js/app.js
 * EL ESPÍRITU (CONTROLADOR)
 * Actualizado: Amanecer Dinámico (GPS)
 */

// REGISTRO DEL SERVICE WORKER
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { 
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado:', reg.scope))
            .catch(err => console.error('Error SW:', err));
    });
}

const QumranApp = {
    // Estado interno
    currentFiestaIdx: null,
    todayFiesta: null,
    sunriseHour: 6.0, // NUEVO: Hora por defecto (6:00 AM) hasta que el GPS detecte la real

    // INICIO
    init: () => {
        console.log("Iniciando Qumran Watch...");
        QumranApp.setupListeners();
        QumranApp.getLocationAndSun(); 
        QumranApp.renderHoy();
    },

    // EVENTOS
    setupListeners: () => {
        // Navegación
        document.getElementById('nav-hoy').addEventListener('click', (e) => QumranApp.nav('hoy', e.currentTarget));
        document.getElementById('nav-lit').addEventListener('click', (e) => QumranApp.nav('lit', e.currentTarget));
        document.getElementById('nav-cal').addEventListener('click', (e) => QumranApp.nav('cal', e.currentTarget));
        document.getElementById('nav-con').addEventListener('click', (e) => QumranApp.nav('con', e.currentTarget));
        document.getElementById('nav-edu').addEventListener('click', (e) => QumranApp.nav('edu', e.currentTarget));
        
        // Interacciones
        document.getElementById('heb-fiesta').addEventListener('click', QumranApp.openFiestaHoy);
        document.getElementById('geo-btn').addEventListener('click', QumranApp.getLocationAndSun);
        
        // Enlaces
        const openPodcast = () => window.open('https://youtube.com/playlist?list=PLr4MABEXstnDLUVcD7EenO4vN8EglZoSz', '_blank');
        const openInstitute = () => window.open('https://www.descubrelabiblia.online/', '_blank');
        
        document.getElementById('btn-podcast-con').addEventListener('click', openPodcast);
        document.getElementById('btn-institute-con').addEventListener('click', openInstitute);
        
        // Calendario
        document.getElementById('btn-render-cal').addEventListener('click', QumranApp.renderCalendar);
        document.getElementById('btn-close-modal').addEventListener('click', () => document.getElementById('modal-fiesta').style.display='none');
        
        // Delegación Calendario
        document.getElementById('cal-lista').addEventListener('click', (e) => {
            const row = e.target.closest('.cal-row.fiesta');
            if (row) {
                const idx = parseInt(row.dataset.index);
                const year = parseInt(row.dataset.year);
                QumranApp.openFiesta(idx, year);
            }
        });
    },

    nav: (viewId, btn) => {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-'+viewId).classList.add('active');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.scrollTo(0,0);
    },
    
    // --- GEOLOCALIZACIÓN Y SOL REAL ---
    getLocationAndSun: () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                let now = new Date();
                // Calculamos tiempos
                let times = QumranApp.calcSunTimes(now, pos.coords.latitude, pos.coords.longitude);
                
                // NUEVO: Guardamos la hora exacta (decimal) del amanecer para la lógica
                if(times && times.riseDecimal) {
                    QumranApp.sunriseHour = times.riseDecimal;
                    console.log("Amanecer detectado a las:", QumranApp.sunriseHour);
                    // Recalculamos toda la app con el nuevo horario
                    QumranApp.renderHoy();
                }

                // Mostramos en pantalla
                let div = document.getElementById('sun-container');
                document.getElementById('sun-rise').innerText = times.rise;
                document.getElementById('sun-set').innerText = times.set;
                div.style.display = 'flex';
                document.getElementById('geo-btn').style.display = 'none';
            }, (err) => { 
                console.warn(err);
                // Si falla o no aceptan, seguimos usando las 6:00 AM por defecto
            });
        }
    },

    // ALGORITMO ASTRONÓMICO
    calcSunTimes: (date, lat, lng) => {
        const toRad = Math.PI / 180;
        const toDeg = 180 / Math.PI;
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        const lngHour = lng / 15;

        const calcTime = (isSunrise) => {
            const t = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24;
            const M = (0.9856 * t) - 3.289;
            let L = M + (1.916 * Math.sin(M * toRad)) + (0.020 * Math.sin(2 * M * toRad)) + 282.634;
            if(L > 360) L -= 360; else if(L < 0) L += 360;
            let RA = toDeg * Math.atan(0.91764 * Math.tan(L * toRad));
            if(RA > 360) RA -= 360; else if(RA < 0) RA += 360;
            const Lquadrant = (Math.floor(L/90)) * 90;
            const RAquadrant = (Math.floor(RA/90)) * 90;
            RA = RA + (Lquadrant - RAquadrant);
            RA = RA / 15;
            const sinDec = 0.39782 * Math.sin(L * toRad);
            const cosDec = Math.cos(Math.asin(sinDec));
            const cosH = (Math.cos(90.833 * toRad) - (sinDec * Math.sin(lat * toRad))) / (cosDec * Math.cos(lat * toRad));
            
            if (cosH > 1 || cosH < -1) return null;
            
            const H = (isSunrise ? (360 - toDeg * Math.acos(cosH)) : (toDeg * Math.acos(cosH))) / 15;
            const T = H + RA - (0.06571 * t) - 6.622;
            let UT = T - lngHour;
            if(UT > 24) UT -= 24; else if(UT < 0) UT += 24;
            
            // Ajuste zona horaria local
            const offset = -date.getTimezoneOffset() / 60;
            let localT = UT + offset;
            if(localT > 24) localT -= 24; else if(localT < 0) localT += 24;
            
            return localT; // Devolvemos el valor decimal (ej: 6.5 para las 6:30)
        };

        let riseDecimal = calcTime(true);
        let setDecimal = calcTime(false);

        // Formateador de hora HH:MM
        const format = (dec) => {
            if(dec === null) return "--:--";
            let h = Math.floor(dec);
            let m = Math.floor((dec - h) * 60);
            return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
        };

        return { 
            rise: format(riseDecimal), 
            set: format(setDecimal),
            riseDecimal: riseDecimal // Devolvemos el valor crudo para la lógica
        };
    },

    // --- VIGÍA Y ALERTAS ---
    checkWatcher: (hoy, qHoy) => {
        let msg = ""; 
        let alertBox = document.getElementById('alert-container');
        let alertMsg = document.getElementById('alert-msg');
        alertBox.style.display = 'none';
        
        if(qHoy.idxSem === 5) { 
            msg += "<strong>¡Día de Preparación!</strong><br>El Shabat entra al próximo amanecer. Completa tus labores."; 
        }
        
        for(let i=1; i<=3; i++) {
            let fut = new Date(hoy); 
            fut.setDate(fut.getDate() + i); 
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

        if(msg !== "") { 
            alertMsg.innerHTML = msg; 
            alertBox.style.display = 'block'; 
        }
    },

    // --- RENDERIZADO PRINCIPAL ---
    renderHoy: () => {
        let hoy = new Date();
        
        // --- NUEVA LÓGICA DE AMANECER ---
        // Obtenemos la hora actual en formato decimal (ej: 6:30 = 6.5)
        let currentHourDecimal = hoy.getHours() + (hoy.getMinutes() / 60);
        
        // Si la hora actual es MENOR que la hora del amanecer calculada (o 6.0 por defecto),
        // seguimos en el día anterior.
        if (currentHourDecimal < QumranApp.sunriseHour) {
            hoy.setDate(hoy.getDate() - 1);
        }
        
        let q = QumranCalendar.calculate(hoy);
        
        document.getElementById('greg-date').innerText = hoy.toLocaleDateString('es-ES', {weekday:'long', day:'numeric', month:'long'});

        if (!q) {
            document.getElementById('heb-date').innerText = "Esperando...";
            return;
        }

        if (q.special) {
            document.getElementById('heb-date').innerText = "SEMANA DE AJUSTE";
            document.getElementById('heb-dia').innerText = "Reset Solar";
        } else {
            QumranApp.checkWatcher(hoy, q); 

            document.getElementById('heb-date').innerText = `${q.d} del ${QumranData.MESES[q.m]}`;
            document.getElementById('heb-dia').innerText = QumranData.DIAS[q.idxSem];
            document.getElementById('heb-turno').innerText = q.turno;
            document.getElementById('heb-estacion').innerText = q.est;
            
            let hIndex = q.dCountYear ? (Math.floor(q.dCountYear / 7) % QumranData.HALAKHA.length) : 0;
            let h = QumranData.HALAKHA[hIndex];
            
            document.getElementById('messiah-theme').innerText = h.t;
            document.getElementById('messiah-hebrew').innerText = h.h || "";
            document.getElementById('messiah-context').innerText = h.c ? `Contexto: ${h.c}` : "";
            document.getElementById('messiah-philology').innerText = h.f || "";
            document.getElementById('messiah-quote').innerText = `"${h.q}"`;
            document.getElementById('messiah-action').innerText = `${h.a} (${h.r})`;

            let fIdx = QumranData.FIESTAS.findIndex(x => x.m === q.m && x.d === q.d);
            if(fIdx !== -1) {
                QumranApp.todayFiesta = fIdx;
                document.getElementById('heb-fiesta').innerText = "★ " + QumranData.FIESTAS[fIdx].n;
            } else {
                QumranApp.todayFiesta = null;
                document.getElementById('heb-fiesta').innerText = "";
            }

            document.querySelectorAll('.gate-dot').forEach((d,i) => {
                d.classList.toggle('active', (i+1) === q.puerta);
            });
            document.getElementById('heb-puerta-num').innerText = q.puerta + "ª Puerta";

            let percent = ((q.idxSem + 1) / 7) * 100;
            let s = null;
            let litType = "";
            let litMain = "";
            
            if(q.idxSem === 6) { 
                document.getElementById('shabat-text').innerText = "¡SHABAT SHALOM!";
                document.getElementById('shabat-progress').style.background = "#fff";
                percent = 100;
                let weekOfYear = Math.floor((q.dCountYear || 0) / 7);
                s = QumranData.CANTICOS_SHABAT[weekOfYear % 13];
                litType = "LITURGIA DE QUMRÁN";
                litMain = "CÁNTICO DEL SACRIFICIO DEL SHABAT";
            } else {
                document.getElementById('shabat-text').innerText = `Faltan ${6 - q.idxSem} días para el Shabat`;
                s = QumranData.SALMOS[q.idxSem];
                litType = "LITURGIA DEL TEMPLO";
                litMain = "SALMO DEL DÍA (Shir Shel Yom)";
            }
            document.getElementById('shabat-progress').style.width = percent + "%";
            
            if (s) {
                document.getElementById('lit-main-title').innerText = litMain;
                document.getElementById('page-lit-type').innerText = litType;
                document.getElementById('page-lit-title').innerText = s.t;
                document.getElementById('page-lit-text').innerText = s.v;
            }
        }
    },

    openFiesta: (index, forceYear) => {
        let f = QumranData.FIESTAS[index];
        let year = forceYear || new Date().getFullYear();
        let anchorGreg = new Date(year, 2, 20); 
        let foundDate = null;
        for(let i=-20; i<370; i++){
            let d = new Date(anchorGreg.getTime() + (i*86400000));
            let q = QumranCalendar.calculate(d);
            if(q && !q.special && q.m === f.m && q.d === f.d) { foundDate = d; break; }
        }
        let dateStr = foundDate ? foundDate.toLocaleDateString('es-ES', {day:'numeric', month:'long'}) : "Calculando...";
        if(foundDate && f.dur > 1) { 
            let end = new Date(foundDate); end.setDate(end.getDate() + f.dur - 1); 
            dateStr += " al " + end.toLocaleDateString('es-ES', {day:'numeric', month:'long'}); 
        }

        document.getElementById('mod-title').innerText = f.n;
        document.getElementById('mod-fechas').innerText = dateStr + ` (${year})`;
        document.getElementById('mod-fechas-heb').innerText = `${f.d} del ${QumranData.MESES[f.m]}\n${f.es}`;
        document.getElementById('mod-instr').innerText = f.instr;
        document.getElementById('mod-ref').innerText = f.ref;
        
        let noteDiv = document.getElementById('mod-note');
        if(f.nota) { noteDiv.innerText = f.nota; noteDiv.style.display = 'block'; } else { noteDiv.style.display = 'none'; }
        let warn = document.getElementById('mod-warn');
        if(f.especial) warn.style.display = 'block'; else warn.style.display = 'none';
        document.getElementById('modal-fiesta').style.display = 'flex';
    },

    openFiestaHoy: () => { if(QumranApp.todayFiesta !== null) QumranApp.openFiesta(QumranApp.todayFiesta); },

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
                    if(f.dur > 1) { let end = new Date(d); end.setDate(end.getDate() + f.dur - 1); dateLabel += " - " + end.toLocaleDateString('es-ES', {day:'numeric', month:'short'}); }
                    html += `<div class="cal-row fiesta" data-index="${fIdx}" data-year="${y}"><div><span class="cal-fiesta-name">${f.n}</span><span class="cal-fiesta-sub">${f.es}</span></div><div style="text-align:right;"><span style="display:block; font-weight:bold;">${dateLabel}</span><span style="font-size:0.8rem;">${q.d}/${q.m+1}</span></div></div>`;
                }
            }
            list.innerHTML = html || "<div class='card'>No se encontraron fiestas.</div>";
        }, 50);
    }
};

document.addEventListener('DOMContentLoaded', QumranApp.init);