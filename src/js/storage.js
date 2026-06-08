/**
 * src/js/storage.js
 * Wrapper localStorage con try/catch — fallback a memoria en modo privado/incógnito
 */
const memory = {};

export const storage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return memory[key] !== undefined ? memory[key] : null;
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch {
            memory[key] = String(value);
        }
    },
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch {
            delete memory[key];
        }
    },
    clear() {
        try {
            localStorage.clear();
        } catch {
            Object.keys(memory).forEach((k) => delete memory[k]);
        }
    },
};
