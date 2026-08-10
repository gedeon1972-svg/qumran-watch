// js/sun.js
// MOTOR ASTRONOMICO
// Calcula los tiempos de salida y puesta del sol basados en coordenadas GPS.
import { calcSunTimesPure } from './sun-algo.js';

export const QumranSun = {
    calcSunTimes: (date, lat, lng) => calcSunTimesPure(date, lat, lng),
};
