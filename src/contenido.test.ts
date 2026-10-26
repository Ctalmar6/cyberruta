import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizar, todasLasTarjetas, unidad1 } from './contenido.ts'

test('el contenido es coherente', () => {
  const ids = unidad1.flatMap((l) => l.tarjetas.map((t) => t.id))
  assert.equal(new Set(ids).size, ids.length, 'ids de tarjeta repetidos')
  assert.equal(Object.keys(todasLasTarjetas).length, ids.length)
  for (const l of unidad1) {
    for (const e of l.ejercicios) {
      if (e.tipo === 'opcion') assert.ok(e.correcta >= 0 && e.correcta < e.opciones.length, e.pregunta)
      if (e.tipo === 'completar') {
        assert.ok(e.pregunta.includes('___'), e.pregunta)
        assert.ok(e.respuestas.every((r) => r === normalizar(r)), `respuesta sin normalizar: ${e.pregunta}`)
      }
      if (e.tipo === 'emparejar') assert.equal(new Set(e.pares.map((p) => p[1])).size, e.pares.length, e.pregunta)
      if (e.tipo === 'ordenar') assert.ok(e.pasos.length >= 3, e.pregunta)
    }
  }
})

test('normalizar ignora tildes, mayúsculas y espacios', () => {
  assert.equal(normalizar('  Núcleo '), 'nucleo')
})
