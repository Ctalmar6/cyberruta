import assert from 'node:assert/strict'
import { test } from 'node:test'
import { completarLeccion, repasar, type Progreso } from './progreso.ts'
import { fusionar, nuevoCodigo, RE_CODIGO, validar } from './sincronizar.ts'

const vacio: Progreso = { leccionesHechas: [], xpPorDia: {}, tarjetas: {} }
const dia = (d: number, h = 12) => new Date(2026, 9, d, h)

test('código de sincronización', () => {
  const c = nuevoCodigo()
  assert.match(c, RE_CODIGO)
  assert.notEqual(c, nuevoCodigo())
})

test('fusionar: dos equipos estudiando por separado no pierden nada', () => {
  // Equipo A estudia la lección 1; B (que ya tenía lo de A) hace la 2 y repasa una tarjeta.
  const a = completarLeccion(vacio, 'l1', ['t1', 't2'], 0, dia(26))
  let b = completarLeccion(a, 'l2', ['t3'], 1, dia(26, 18))
  b = repasar(b, 't1', true, dia(28))
  const a2 = completarLeccion(a, 'l3', [], 0, dia(27)) // A sin conexión, otro día

  const m = fusionar(a2, b)
  assert.deepEqual(m.leccionesHechas, ['l1', 'l2', 'l3'])
  assert.deepEqual(m.xpPorDia, { '2026-10-26': 25, '2026-10-27': 15, '2026-10-28': 2 })
  assert.equal(m.tarjetas.t1.reps, 1) // gana la versión repasada
  assert.ok(m.tarjetas.t3)

  // Conmutativa e idempotente.
  assert.deepEqual(fusionar(b, a2), m)
  assert.deepEqual(fusionar(m, m), m)
  assert.deepEqual(fusionar(m, a2), m)
})

test('validar rechaza datos malformados o peligrosos', () => {
  const bueno = JSON.parse(JSON.stringify(completarLeccion(vacio, 'u1-l1', ['u1-cpu'], 0, dia(26))))
  assert.deepEqual(validar(bueno), bueno)
  assert.equal(validar(null), null)
  assert.equal(validar('hola'), null)
  assert.equal(validar({ ...bueno, leccionesHechas: 'u1' }), null)
  assert.equal(validar({ ...bueno, leccionesHechas: ['<script>'] }), null)
  assert.equal(validar({ ...bueno, xpPorDia: { hoy: 5 } }), null)
  assert.equal(validar({ ...bueno, xpPorDia: { '2026-10-26': -1 } }), null)
  assert.equal(validar({ ...bueno, xpPorDia: { '2026-10-26': 1e9 } }), null)
  assert.equal(validar({ ...bueno, tarjetas: { x: { due: 'nunca', reps: 0, stability: 0, difficulty: 0 } } }), null)
})
