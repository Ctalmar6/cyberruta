import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lecciones, normalizar, todasLasTarjetas, unidades } from './contenido.ts'
import { retos } from './laboratorio.ts'
import { ruta } from './ruta.ts'

test('el contenido es coherente', () => {
  const ids = [...lecciones, ...retos].flatMap((l) => l.tarjetas.map((t) => t.id))
  assert.equal(new Set(ids).size, ids.length, 'ids de tarjeta repetidos')
  assert.equal(Object.keys(todasLasTarjetas).length, ids.length)
  // Lecciones y retos comparten leccionesHechas en el progreso.
  const idsLecciones = [...lecciones, ...retos].map((l) => l.id)
  assert.equal(new Set(idsLecciones).size, idsLecciones.length, 'ids de lección o reto repetidos')
  assert.ok(unidades.length <= ruta[0].unidades.length, 'hay más unidades que en la ruta')
  for (const l of lecciones) {
    for (const e of l.ejercicios) {
      if (e.tipo === 'opcion') assert.ok(e.correcta >= 0 && e.correcta < e.opciones.length, e.pregunta)
      if (e.tipo === 'completar') {
        assert.ok(e.pregunta.includes('___'), e.pregunta)
        assert.ok(e.respuestas.every((r) => r === normalizar(r)), `respuesta sin normalizar: ${e.pregunta}`)
      }
      if (e.tipo === 'emparejar') {
        assert.equal(new Set(e.pares.map((p) => p[0])).size, e.pares.length, e.pregunta)
        assert.equal(new Set(e.pares.map((p) => p[1])).size, e.pares.length, e.pregunta)
      }
      if (e.tipo === 'ordenar') {
        assert.ok(e.pasos.length >= 3, e.pregunta)
        assert.equal(new Set(e.pasos).size, e.pasos.length, e.pregunta)
      }
    }
  }
})

test('normalizar ignora tildes, mayúsculas y espacios', () => {
  assert.equal(normalizar('  Núcleo '), 'nucleo')
})
