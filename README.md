# Qumran Watch | Maskil

Herramienta litúrgica progresiva (PWA) para la restauración del ciclo solar de 364 días, basada en los escritos de Qumrán, Jubileos y Enoc.

> "Para que observen los años de acuerdo con este cómputo: trescientos sesenta y cuatro días, y esto constituirá un año completo." — Jubileos 6:32

## Propósito
Sincronizar a la comunidad con los **Mishmarot** (Turnos Sacerdotales) y los **Moedim** (Tiempos Señalados) según el orden original de la Creación, lejos de la confusión de los calendarios lunares o gregorianos.

## Estructura del Proyecto

El proyecto sigue una arquitectura limpia y modular para facilitar el mantenimiento y la expansión futura (Ej. Códice, Estudios).

```text
/qumran-watch
│
├── /src
│   ├── /data           (Datos estáticos: Fiestas, Salmos, Textos)
│   ├── /js             (Lógica de negocio y controladores)
│   ├── /css            (Estilos)
│   └── /assets         (Recursos futuros)
│
├── index.html          (Punto de entrada)
├── sw.js               (Service Worker - Offline)
└── manifest.json       (Metadatos PWA)