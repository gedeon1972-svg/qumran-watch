/**
 * audit-mishmarot.js - Auditoria de Turnos Sacerdotales (Mishmarot)
 */
import { QumranCalendar } from './src/js/calendar.js';
import { QumranData } from './src/js/data.js';

const ANCHOR = new Date(2019, 2, 20);

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function analyze(diff, label) {
    const date = addDays(ANCHOR, diff);
    const q = QumranCalendar.calculate(date);
    const turno = QumranCalendar.getTurno(diff);
    const turnoIdx = QumranData.TURNOS.indexOf(turno);
    return { diff, label, turno, turnoIdx, q };
}

console.log('');
console.log('===============================================================================');
console.log('  AUDITORIA DE TURNOS SACERDOTALES (MISHMAROT)');
console.log('  Qumran Watch - Motor calendario 364d');
console.log('===============================================================================');
console.log('');
console.log('  ANCLA: 20 Mar 2019 -> Gamul (indice 21)');
console.log('  CICLO SEXENAL: 2191 dias (364x5 + 371)');
console.log('  ANO 6: 371 dias -> Semana 53 intercalar (Tekufah)');
console.log('');

console.log('+--------+------------------------------------+---------------------+-------+');
console.log('|  diff  |  Hito                              |  Turno              | Ind.  |');
console.log('+--------+------------------------------------+---------------------+-------+');

const hitos = [
    [0, 'Dia 1, Ano 1, Ciclo 1'],
    [364, 'Dia 1, Ano 2'],
    [728, 'Dia 1, Ano 3'],
    [1092, 'Dia 1, Ano 4'],
    [1456, 'Dia 1, Ano 5'],
    [1820, 'Dia 1, Ano 6'],
    [2183, 'Ano 6, Dia 364 (ultimo normal)'],
    [2184, 'Ano 6, Dia 365 => INICIO SEM INTERCALAR'],
    [2190, 'Ano 6, Dia 371 (fin semana intercalar)'],
    [2191, 'Dia 1, Ano 7 (= Ano 1, Ciclo 2)'],
];

for (let i = 0; i < hitos.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    const h = hitos[i];
    const diff = h[0];
    const label = h[1];
    const r = analyze(diff, label);
    const idxStr = String(r.turnoIdx).padStart(2);
    console.log(
        '| ' +
            String(diff).padStart(6) +
            ' | ' +
            label.padEnd(34) +
            ' | ' +
            r.turno.padEnd(19) +
            ' |  ' +
            idxStr +
            '  |',
    );
}
console.log('+--------+------------------------------------+---------------------+-------+');

console.log('');
console.log('-- SECUENCIA SEMANA A SEMANA (Semanas 48-52 Ano 6 + Semanas 0-2 Ano 7) --');
console.log('');

console.log('+--------+------------+----------+---------------------+----------------------------+');
console.log('|  diff  |  Ano       |  Semana  |  Turno              |  Notas                     |');
console.log('+--------+------------+----------+---------------------+----------------------------+');

for (let sem = 48; sem <= 52; sem++) {
    const diasSem = sem * 7;
    const diff = 1820 + diasSem;
    const r = analyze(diff, '');
    const anio = r.q && r.q.y ? r.q.y : 'Ano 6';
    const nota = sem === 52 ? '<< SEM INTERCALAR (TEKUFAH)' : '';
    console.log(
        '| ' +
            String(diff).padStart(6) +
            ' | ' +
            String(anio).padStart(10) +
            ' | Sem ' +
            String(sem).padStart(2) +
            '     | ' +
            r.turno.padEnd(19) +
            ' | ' +
            nota.padEnd(26) +
            ' |',
    );
}

for (let sem = 0; sem <= 2; sem++) {
    const diasSem = sem * 7;
    const diff = 2191 + diasSem;
    const r = analyze(diff, '');
    const anio = r.q && r.q.y ? r.q.y : 'Ano 7';
    const nota = sem === 0 ? '<< INICIO CICLO 2' : '';
    console.log(
        '| ' +
            String(diff).padStart(6) +
            ' | ' +
            String(anio).padStart(10) +
            ' | Sem ' +
            String(sem).padStart(2) +
            '     | ' +
            r.turno.padEnd(19) +
            ' | ' +
            nota.padEnd(26) +
            ' |',
    );
}
console.log('+--------+------------+----------+---------------------+----------------------------+');

console.log('');
console.log('-- DIAGNOSTICO ------------------------------------------------------------------');
console.log('');

const r2184 = analyze(2184, '');
const r2191 = analyze(2191, '');
const r2183 = analyze(2183, '');
const r2198 = analyze(2198, '');

if (r2184.turno === r2191.turno) {
    console.log('  ** REPETICION: ' + r2184.turno + ' aparece en la semana intercalar');
    console.log('    Y TAMBIEN en la semana 0 del nuevo ciclo (diff=2191).');
    console.log('    -> Sirve 2 semanas consecutivas.');
    console.log('');
    console.log('  Secuencia observada en el limite:');
    console.log('    Sem 51, Ano 6: ' + r2183.turno + ' (idx ' + r2183.turnoIdx + ')');
    console.log('    Sem 52, Ano 6: ' + r2184.turno + ' (idx ' + r2184.turnoIdx + ') << intercalar');
    console.log('    Sem  0, Ano 7: ' + r2191.turno + ' (idx ' + r2191.turnoIdx + ') << inicio ciclo 2');
    console.log('    Sem  1, Ano 7: ' + r2198.turno + ' (idx ' + r2198.turnoIdx + ')');
    console.log('');
    const expectedNext = QumranData.TURNOS[(r2184.turnoIdx + 1) % 24];
    const expectedIdx = (r2184.turnoIdx + 1) % 24;
    console.log('  Si la rotacion fuera continua (sin reset), la semana 0 del Ano 7');
    console.log('  deberia ser ' + expectedNext + ' (idx ' + expectedIdx + ')');
    console.log('  en lugar de ' + r2191.turno + ' (idx ' + r2191.turnoIdx + ').');
} else {
    console.log('  ** NO HAY REPETICION. La rotacion es continua.');
}

console.log('');
console.log('-- VERIFICACION DE INICIOS DE ANO -------------------------------------------------');
console.log('');
const aniosEsperados = ['Gamul', 'Jedaiah', 'Mijamin', 'Secanias', 'Jesebeab', 'Hapises'];
console.log('+--------+---------------------+---------------------+--------+');
console.log('|  Ano   |  Esperado           |  Real               | OK?    |');
console.log('+--------+---------------------+---------------------+--------+');
for (let i = 0; i < 6; i++) {
    const diff = i * 364;
    const r = analyze(diff, '');
    // eslint-disable-next-line security/detect-object-injection
    const ok = r.turno === aniosEsperados[i] ? 'YES' : 'NO ';
    // eslint-disable-next-line security/detect-object-injection
    console.log(
        '|  Ano ' + (i + 1) + '  | ' + aniosEsperados[i].padEnd(19) + ' | ' + r.turno.padEnd(19) + ' |  ' + ok + '  |',
    );
}
console.log('+--------+---------------------+---------------------+--------+');

console.log('');
console.log('-- VERIFICACION CICLO 2 (ano 7 = ano 1 del ciclo 2) ------------------------------');
console.log('');
const rCycle2 = analyze(2191, '');
const okCycle2 = rCycle2.turno === 'Gamul' ? 'OK' : 'DESVIADO';
console.log('  Ano 7 (Ciclo 2, Ano 1): turno = ' + rCycle2.turno + ' -> ' + okCycle2);
console.log('  Esperado: Gamul (debe reiniciarse)');
console.log('');

console.log('-- RESUMEN -----------------------------------------------------------------------');
console.log('');
if (r2184.turno === r2191.turno) {
    console.log('  HALLAZGO: El motor asigna ' + r2184.turno + ' tanto a la semana');
    console.log('  intercalar como a la semana 0 del nuevo ciclo sexenal.');
    console.log('  Esto ocurre porque getTurno() resetea absoluteWeek a 0 al');
    console.log('  comenzar un nuevo ciclo, en lugar de continuar la cuenta');
    console.log('  desde la semana intercalar.');
    console.log('  El desfase es de 1 semana cada 6 anos.');
    console.log('');
    const desfase294 = Math.floor(294 / 6);
    console.log('  POSIBLE IMPACTO: En 294 anos (un ciclo de Jubileos), este');
    console.log('  desfase acumularia ' + desfase294 + ' semanas de repeticion');
    console.log('  (= ' + desfase294 + ' turnos repetidos) si no se corrige.');
}
console.log('===============================================================================');
