# 📜 Qumran Watch | El Reloj de los Hijos de Sadoc

![Version](https://img.shields.io/badge/Versi%C3%B3n-9.0-gold?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-100%25_Offline-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/ES6-M%C3%B3dulos-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/Licencia-Open_Source-green?style=for-the-badge)

**Qumran Watch** es una Aplicación Web Progresiva (PWA) de nivel profesional diseñada para calcular, visualizar y enseñar el **Calendario Solar de 364 Días**, restaurado a partir de los textos de Enoc, Jubileos y los Rollos del Mar Muerto (Qumrán).

Esta herramienta está diseñada para alinear a los creyentes con el reloj litúrgico y astronómico original, libre de las alteraciones introducidas por los calendarios lunares babilónicos o solares gregorianos.

---

## ✨ Características Principales

* ☀️ **Motor Astronómico Exacto:** Calcula el año bíblico perfecto de 364 días (52 semanas exactas) basado en el ancla histórica del 20 de Marzo de 2019 (Equinoccio + Superluna + Miércoles + Turno de Gamul).
* 🏛️ **Ciclo Sacerdotal (Mishmarot):** Seguimiento en tiempo real de los 24 turnos sacerdotales (1 Crónicas 24) dentro de un ciclo intercalar de 6 años para la sincronización solar.
* 📍 **Inicio del Día por GPS:** Utiliza la geolocalización del dispositivo para calcular el amanecer astronómico local, respetando el principio de que el día comienza con la Luz (Génesis 1) y no en el ocaso.
* 📖 **Liturgia Auténtica de Qumrán:** Incluye los Salmos Diarios del Templo (Shir Shel Yom) y los místicos *Cánticos del Sacrificio del Shabat* extraídos directamente de los manuscritos 4Q400-4Q407.
* 🕎 **Moedim Completos:** Calculadora interactiva de las Fiestas de YHWH, incluyendo los festivales agrícolas detallados en el Rollo del Templo (Vino Nuevo, Aceite, Ofrenda de Leña).
* 📱 **100% Offline (PWA):** Construida con tecnología de Service Workers, la aplicación se instala en iOS, Android y Escritorio, funcionando a la perfección en modo avión o en lugares sin cobertura de red.

---

## 📐 Arquitectura Técnica

El proyecto ha sido refactorizado recientemente (v9.0) para cumplir con los estándares de la industria del desarrollo de software:

* **Vanilla JavaScript ES6:** Uso estricto de Arquitectura Modular (`import`/`export`) para la separación de responsabilidades (Modelo de Datos, Motor Matemático, Interfaz de Usuario).
* **Ausencia de Dependencias Externas:** El núcleo matemático no depende de librerías de terceros (como Moment.js), lo que garantiza una ejecución ultrarrápida y a prueba de obsolescencia.
* **Service Worker con Cache-First:** Estrategia agresiva de caché para recursos estáticos y fuentes tipográficas personalizadas (`Cinzel`, `David Libre`).

### Estructura del Proyecto
```text
qumran-watch/
├── index.html          # Interfaz principal de la aplicación (UI)
├── manifest.json       # Manifiesto PWA para instalación móvil
├── sw.js               # Service Worker para funcionamiento Offline
├── README.md           # Documentación del proyecto
└── src/
    ├── css/            # Estilos (styles.css) y tipografías locales
    └── js/
        ├── app.js      # Controlador principal y gestión del DOM
        ├── calendar.js # Motor matemático del calendario de 364 días
        └── data.js     # Base de datos local (Textos, Fiestas, Liturgia)