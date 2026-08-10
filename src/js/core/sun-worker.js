// src/js/core/sun-worker.js
// Web Worker: ejecuta el algoritmo NOAA fuera del main thread.
import { calcSunTimesPure } from './sun-algo.js';

self.onmessage = (e) => {
    const { id, date, lat, lng } = e.data || {};
    let result = null;
    let error = null;
    try {
        result = calcSunTimesPure(new Date(date), lat, lng);
    } catch (err) {
        error = String(err);
    }
    self.postMessage({ id, result, error });
};
