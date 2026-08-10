// src/js/core/sun-worker-client.js
// Cliente del Web Worker NOAA con fallback sincrono.
// Si el worker no esta disponible o falla, usa calcSunTimesPure directamente.
import { calcSunTimesPure } from './sun-algo.js';

let worker = null;
let workerOk = false;
let seq = 0;
const pending = new Map();

function getWorker() {
    if (worker) return worker;
    if (typeof Worker === 'undefined') return null;
    try {
        const w = new Worker(new URL('./sun-worker.js', import.meta.url), { type: 'module' });
        w.onmessage = (e) => {
            const { id, result, error } = e.data || {};
            const p = pending.get(id);
            if (!p) return;
            pending.delete(id);
            if (error) p.reject(new Error(error));
            else p.resolve(result);
        };
        w.onerror = () => {
            workerOk = false;
        };
        worker = w;
        workerOk = true;
        return w;
    } catch (err) {
        return null;
    }
}

export async function calcSunTimesAsync(date, lat, lng) {
    const w = getWorker();
    if (!w || !workerOk) {
        return calcSunTimesPure(date, lat, lng);
    }
    const id = ++seq;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            pending.delete(id);
            resolve(calcSunTimesPure(date, lat, lng));
        }, 1000);
        pending.set(id, {
            resolve: (v) => {
                clearTimeout(timer);
                resolve(v);
            },
            reject: (e) => {
                clearTimeout(timer);
                reject(e);
            },
        });
        try {
            w.postMessage({ id, date: date.getTime(), lat, lng });
        } catch (err) {
            clearTimeout(timer);
            pending.delete(id);
            resolve(calcSunTimesPure(date, lat, lng));
        }
    });
}
