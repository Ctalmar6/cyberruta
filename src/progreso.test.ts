import assert from 'node:assert/strict'
import { test } from 'node:test'
import { completarLeccion, fechaLocal, racha, repasar, tarjetasPendientes, xpHoy, type Progreso } from './progreso.ts'

const vacio: Progreso = { leccionesHechas: [], xpPorDia: {}, tarjetas: {} }
const dia = (d: number, h = 12) => new Date(2026, 9, d, h)

test('fechaLocal usa la hora local', () => {
  assert.equal(fechaLocal(new Date(2026, 0, 5, 23, 59)), '2026-01-05')
})

test('racha cuenta días seguidos y sobrevive si hoy aún no estudias', () => {
  const p = { ...vacio, xpPorDia: { '2026-10-24': 5, '2026-10-25': 10, '2026-10-22': 3 } }
  assert.equal(racha(p, dia(25)), 2)
  assert.equal(racha(p, dia(26)), 2) // hoy sin XP, ayer sí
  assert.equal(racha(p, dia(27)), 0) // se saltó un día
  assert.equal(racha(vacio, dia(26)), 0)
})

test('racha cruza el cambio de mes', () => {
  const p = { ...vacio, xpPorDia: { '2026-09-30': 1, '2026-10-01': 1 } }
  assert.equal(racha(p, new Date(2026, 9, 1)), 2)
})

test('completar lección da XP, bono perfecto y crea tarjetas para mañana', () => {
  let p = completarLeccion(vacio, 'l1', ['a', 'b'], 0, dia(26))
  assert.equal(xpHoy(p, dia(26)), 15)
  assert.deepEqual(p.leccionesHechas, ['l1'])
  assert.deepEqual(tarjetasPendientes(p, dia(26)), [])
  assert.deepEqual(tarjetasPendientes(p, dia(27, 13)).sort(), ['a', 'b'])

  // Repetir la lección no duplica la lección ni reinicia las tarjetas.
  const antes = p.tarjetas.a
  p = completarLeccion(p, 'l1', ['a', 'b'], 2, dia(26))
  assert.equal(xpHoy(p, dia(26)), 25)
  assert.deepEqual(p.leccionesHechas, ['l1'])
  assert.equal(p.tarjetas.a, antes)
})

test('repasar: acordarse aleja la tarjeta y da XP; olvidar no da XP', () => {
  const p = completarLeccion(vacio, 'l1', ['a', 'b'], 1, dia(26))
  const ahora = dia(27, 13)
  const bien = repasar(p, 'a', true, ahora)
  assert.ok(!tarjetasPendientes(bien, ahora).includes('a'))
  assert.equal(xpHoy(bien, ahora), 2)

  const mal = repasar(p, 'b', false, ahora)
  assert.equal(xpHoy(mal, ahora), 0)
  // Sobrevive a JSON (así se guarda en localStorage).
  const recargado = JSON.parse(JSON.stringify(bien))
  assert.ok(tarjetasPendientes(recargado, new Date(2026, 11, 31)).includes('a'))
})
