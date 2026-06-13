import { SOLAR_DATA_CONFIG } from './data.js';
import { QumranSun } from './sun.js';

export function getQumranEquivalent(date, sunriseHour) {
    const hours = date.getHours() + date.getMinutes() / 60;
    if (sunriseHour == null || isNaN(sunriseHour)) return 'current';
    if (hours < sunriseHour) return 'prev';
    return 'current';
}

export function getSunriseTime(lat, lng, date) {
    const times = QumranSun.calcSunTimes(date, lat, lng);
    if (!times || times.riseDecimal == null) return null;
    return {
        sunrise: times.riseDecimal,
        firstLight: times.riseDecimal + SOLAR_DATA_CONFIG.FIRST_LIGHT_OFFSET,
    };
}
