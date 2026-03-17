# 📜 Qumran Watch | El Reloj de los Hijos de Sadoc

![Version](https://img.shields.io/badge/Versi%C3%B3n-12.0-gold?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-100%25_Offline-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/ES6-M%C3%B3dulos-yellow?style=for-the-badge)
![GPS](https://img.shields.io/badge/GPS-Solar_Sync-orange?style=for-the-badge)

**Qumran Watch** es una Aplicación Web Progresiva (PWA) de alto rendimiento diseñada para restaurar el **Calendario Solar de 364 Días**, alineado con los Manuscritos del Mar Muerto y los textos de Enoc y Jubileos. Esta herramienta técnica permite a la comunidad de los Hijos de Sadoc sincronizar su vida litúrgica con el orden astronómico original.

---

## ✨ Características de la Versión 12.0

* ☀️ **Motor Astronómico GPS:** Sincronización en tiempo real de la salida y puesta del sol basada en la ubicación geográfica del usuario, ajustando el inicio del día bíblico de forma exacta.
* 🔔 **Sincronización ICS Nativa:** Capacidad de exportar y sincronizar las Fiestas Sagradas directamente con el calendario nativo del celular (iOS/Android) mediante avisos programados.
* 🏛️ **Ciclo de Mishmarot:** Seguimiento perpetuo de los 24 turnos sacerdotales, vinculados al ancla histórica del 20 de Marzo de 2019 (Turno de Gamul).
* 📖 **Biblioteca "Saber":** Acceso a estudios profundos y lecturas litúrgicas (Salmos y Cánticos de Shabat) optimizados para la reflexión diaria.
* 📱 **PWA Ultra-Resiliente:** Funcionamiento 100% offline garantizado mediante una arquitectura de Service Workers avanzada.

---

## 📐 Especificaciones Técnicas

El proyecto ha sido completamente refactorizado bajo estándares modernos de ingeniería de software:

* **Arquitectura Modular (ES6):** Separación estricta de responsabilidades en módulos independientes (`data`, `calendar`, `sun`, `ics`) para garantizar la mantenibilidad y escalabilidad.
* **Zero Dependencies:** Código puro (Vanilla JS) sin librerías externas, eliminando vulnerabilidades y garantizando una carga instantánea.
* **UI/UX Inmersiva:** Interfaz diseñada con tipografía local (`Cinzel` y `David Libre`) y un sistema de modales centrados para una experiencia de lectura sagrada óptima.

### Estructura del Ecosistema
```text
qumran-watch/
├── index.html          # Interfaz de Usuario (HTML5)
├── manifest.json       # Configuración PWA
├── sw.js               # Service Worker (Caché V12.0)
└── src/
    ├── css/            # Estilos y Tipografías
    └── js/
        ├── app.js      # Controlador Principal
        ├── data.js     # Base de Datos Litúrgica
        ├── calendar.js # Motor del Calendario 364
        ├── sun.js      # Algoritmo de Posición Solar (GPS)
        └── ics.js      # Generador de Eventos de Calendario
