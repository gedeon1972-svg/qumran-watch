/**
 * js/sun.js
 * MOTOR ASTRONÓMICO
 * Calcula los tiempos de salida y puesta del sol basados en coordenadas GPS.
 */

export const QumranSun = {
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
            
            if (cosH > 1 || cosH < -1) return null; // El sol no sale ni se pone (polos)
            
            const H = (isSunrise ? (360 - toDeg * Math.acos(cosH)) : (toDeg * Math.acos(cosH))) / 15;
            const T = H + RA - (0.06571 * t) - 6.622;
            let UT = T - lngHour;
            
            if(UT > 24) UT -= 24; else if(UT < 0) UT += 24;
            
            const offset = -date.getTimezoneOffset() / 60;
            let localT = UT + offset;
            if(localT > 24) localT -= 24; else if(localT < 0) localT += 24;
            
            return localT;
        };

        let riseDecimal = calcTime(true);
        let setDecimal = calcTime(false);

        const format = (dec) => {
            if(dec === null) return "--:--";
            let h = Math.floor(dec);
            let m = Math.floor((dec - h) * 60);
            return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
        };

        return { 
            rise: format(riseDecimal), 
            set: format(setDecimal), 
            riseDecimal: riseDecimal 
        };
    }
};
