import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(join(root, 'script.js'), 'utf-8');
const cut = src.indexOf('function initReservas()');
assert.ok(cut > 0, 'marcador initReservas encontrado');
const pure = src.slice(0, cut);

function makeSandbox() {
  const noop = () => {};
  const sandbox = {
    window: { matchMedia: () => ({ matches: false, addEventListener: noop }), addEventListener: noop },
    document: { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ addEventListener: noop, setAttribute: noop, appendChild: noop, classList: { add: noop }, style: {} }), body: { appendChild: noop } },
    setTimeout: noop,
    console,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(pure, sandbox);
  return sandbox;
}

test('formatearFecha convierte ISO a dd/mm/aaaa', () => {
  const s = makeSandbox();
  const f = vm.runInContext('formatearFecha', s);
  assert.equal(f('2026-08-21'), '21/08/2026');
  assert.equal(f('2026-12-03'), '03/12/2026');
  assert.equal(f('basura'), '');
  assert.equal(f(''), '');
});

test('validarReserva exige fechas y orden correcto', () => {
  const s = makeSandbox();
  const v = vm.runInContext('validarReserva', s);
  assert.notEqual(v({ llegada: '', salida: '' }), '');
  assert.notEqual(v({ llegada: '2026-08-21', salida: '' }), '');
  assert.notEqual(v({ llegada: '2026-08-21', salida: '2026-08-21' }), '', 'misma fecha no vale');
  assert.notEqual(v({ llegada: '2026-08-21', salida: '2026-08-20' }), '', 'salida anterior no vale');
  assert.equal(v({ llegada: '2026-08-21', salida: '2026-08-24' }), '');
});

test('componerMensajeReserva arma el texto por tipo, plural y nombre', () => {
  const s = makeSandbox();
  const c = vm.runInContext('componerMensajeReserva', s);
  const m1 = c({ tipo: 'cabana', llegada: '2026-08-21', salida: '2026-08-24', huespedes: '6', nombre: 'Ana' });
  assert.match(m1, /una cabaña/);
  assert.match(m1, /del 21\/08\/2026 al 24\/08\/2026/);
  assert.match(m1, /6 personas/);
  assert.match(m1, /Soy Ana\./);
  const m2 = c({ tipo: 'camping', llegada: '2026-01-05', salida: '2026-01-06', huespedes: '1', nombre: '' });
  assert.match(m2, /un lugar en el camping/);
  assert.match(m2, /1 persona\./);
  assert.doesNotMatch(m2, /Soy/);
  const m3 = c({ tipo: 'camping', llegada: '2026-01-05', salida: '2026-01-08', huespedes: 'más de 10', nombre: '' });
  assert.match(m3, /más de 10 personas/);
});

test('HUESPEDES: cabaña tope 6, camping llega a más de 10', () => {
  const s = makeSandbox();
  const H = vm.runInContext('HUESPEDES', s);
  assert.equal(H.cabana.length, 6);
  assert.equal(H.cabana.at(-1), '6');
  assert.equal(H.camping.at(-1), 'más de 10');
});
