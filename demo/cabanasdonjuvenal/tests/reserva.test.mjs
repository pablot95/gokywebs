import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const core = require('../reserva-core.js');

test('calcNoches cuenta noches entre fechas', () => {
  assert.equal(core.calcNoches('2026-08-12', '2026-08-15'), 3);
  assert.equal(core.calcNoches('2026-08-12', '2026-08-13'), 1);
});

test('calcNoches devuelve 0 o negativo en casos invalidos', () => {
  assert.equal(core.calcNoches('', '2026-08-15'), 0);
  assert.equal(core.calcNoches('2026-08-12', ''), 0);
  assert.equal(core.calcNoches('basura', 'fechas'), 0);
  assert.equal(core.calcNoches('2026-08-15', '2026-08-12'), -3);
  assert.equal(core.calcNoches('2026-08-12', '2026-08-12'), 0);
});

test('calcNoches no se rompe con el cambio de mes ni de anio', () => {
  assert.equal(core.calcNoches('2026-08-30', '2026-09-02'), 3);
  assert.equal(core.calcNoches('2026-12-30', '2027-01-02'), 3);
});

test('formatearFecha pasa ISO a dd/mm/aaaa', () => {
  assert.equal(core.formatearFecha('2026-08-12'), '12/08/2026');
  assert.equal(core.formatearFecha(''), '');
});

test('armarResumen requiere cabana y fechas validas', () => {
  assert.equal(core.armarResumen({ cabana: '', llegada: '2026-08-12', salida: '2026-08-15', huespedes: 2 }), null);
  assert.equal(core.armarResumen({ cabana: 'muelle', llegada: '2026-08-15', salida: '2026-08-12', huespedes: 2 }), null);
  const r = core.armarResumen({ cabana: 'muelle', llegada: '2026-08-12', salida: '2026-08-15', huespedes: 2 });
  assert.match(r, /Del Muelle/);
  assert.match(r, /3 noches/);
  assert.match(r, /2 huéspedes/);
});

test('armarResumen singulariza noche y huesped', () => {
  const r = core.armarResumen({ cabana: 'monte', llegada: '2026-08-12', salida: '2026-08-13', huespedes: 1 });
  assert.match(r, /1 noche(?!s)/);
  assert.match(r, /1 huésped(?!es)/);
});

test('armarMensajeReserva arma el texto completo con extras', () => {
  const msg = core.armarMensajeReserva({
    cabana: 'timbo',
    llegada: '2026-08-12',
    salida: '2026-08-15',
    huespedes: 4,
    extras: ['Salida de pesca guiada', 'Desayuno de campo'],
  });
  assert.match(msg, /^Hola Cabañas Don Juvenal/);
  assert.match(msg, /Del Timbó \(4 a 5 personas\)/);
  assert.match(msg, /Del 12\/08\/2026 al 15\/08\/2026 \(3 noches\)/);
  assert.match(msg, /Huéspedes: 4/);
  assert.match(msg, /Extras: Salida de pesca guiada, Desayuno de campo/);
});

test('armarMensajeReserva omite extras vacios', () => {
  const msg = core.armarMensajeReserva({ cabana: 'muelle', llegada: '2026-08-12', salida: '2026-08-13', huespedes: 2, extras: [] });
  assert.doesNotMatch(msg, /Extras/);
  assert.match(msg, /1 noche\)/);
});
