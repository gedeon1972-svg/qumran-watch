// src/js/core/notifications.js
// Notificaciones locales sin backend: Notification API + Periodic Background Sync.
// Arquitectura compatible con GitHub Pages estatico (no requiere servidor de push).
import { QumranData } from './data.js';
import { QumranCalendar } from './calendar.js';
import { notifStore } from './notif-store.js';

const DAY_MS = 86400000;
const ICON = '/qumran-watch/icon.png';

function iso(d) {
    return (
        d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    );
}

export const Notifications = {
    supported: false,

    init() {
        Notifications.supported = typeof window !== 'undefined' && 'Notification' in window;
        return Notifications.supported;
    },

    permission() {
        return typeof Notification !== 'undefined' ? Notification.permission : 'denied';
    },

    async requestPermission() {
        if (typeof Notification === 'undefined') return 'unsupported';
        try {
            return await Notification.requestPermission();
        } catch {
            return 'denied';
        }
    },

    // Calcula los proximos recordatorios liturgicos (Shabat de preparacion + Fiestas)
    computeUpcoming(days = 10) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const items = [];
        for (let i = 1; i <= days; i++) {
            const d = new Date(today.getTime() + i * DAY_MS);
            const q = QumranCalendar.calculate(d);
            if (!q || q.special) continue;
            if (q.idxSem === 5) {
                items.push({
                    date: iso(d),
                    type: 'shabat',
                    title: 'Dia de Preparacion',
                    body: 'El Shabat entra manana al amanecer.',
                });
            }
            const fIdx = QumranData.FIESTAS.findIndex((x) => x.m === q.m && x.d === q.d);
            if (fIdx !== -1) {
                // eslint-disable-next-line security/detect-object-injection
                const f = QumranData.FIESTAS[fIdx];
                items.push({ date: iso(d), type: 'fiesta', title: 'Fiesta de YHWH: ' + f.n, body: f.es });
            }
        }
        return items;
    },

    async scheduleUpcoming(days = 10) {
        if (!Notifications.supported || Notification.permission !== 'granted') return 0;
        const items = Notifications.computeUpcoming(days);
        let count = 0;
        for (const item of items) {
            const existing = await notifStore.findByDate(item.date);
            if (existing) continue;
            await notifStore.add({ ...item, shown: false });
            count++;
        }
        return count;
    },

    async checkDue() {
        if (!Notifications.supported || Notification.permission !== 'granted') return 0;
        const today = iso(new Date());
        const items = await notifStore.getAll();
        let shown = 0;
        for (const item of items) {
            if (item.date === today && !item.shown) {
                Notifications.showLocal(item.title, item.body);
                await notifStore.markShown(item.id);
                shown++;
            }
        }
        return shown;
    },

    showLocal(title, body) {
        if (!Notifications.supported || Notification.permission !== 'granted') return;
        try {
            new Notification(title, { body, icon: ICON, tag: 'qumran-' + title });
        } catch {
            // Algunos navegadores solo permiten notificaciones desde el SW
        }
    },

    notifyServiceWorker() {
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready
                .then((reg) => {
                    if (reg.active) reg.active.postMessage({ type: 'CHECK_NOTIFICATIONS' });
                })
                .catch(() => {});
        }
    },
};
