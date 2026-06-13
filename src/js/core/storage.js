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
            // eslint-disable-next-line security/detect-object-injection
            return memory[key] !== undefined ? memory[key] : null;
        }
    },
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch {
            // eslint-disable-next-line security/detect-object-injection
            memory[key] = String(value);
        }
    },
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch {
            // eslint-disable-next-line security/detect-object-injection
            delete memory[key];
        }
    },
    clear() {
        try {
            localStorage.clear();
        } catch {
            // eslint-disable-next-line security/detect-object-injection
            Object.keys(memory).forEach((k) => delete memory[k]);
        }
    },
};
