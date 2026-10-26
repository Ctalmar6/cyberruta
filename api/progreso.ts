// GET /api/progreso → progreso guardado · PUT /api/progreso (progreso) → progreso fusionado
import type { Progreso } from '../src/progreso.js'
import { fusionar, MAX_BYTES, validar } from '../src/sincronizar.js'
import { actualizar, ErrorHttp, json, leer, leerCuerpo, manejar, usuarioDe } from './_lib/servidor.js'

const VACIO: Progreso = { leccionesHechas: [], xpPorDia: {}, tarjetas: {} }
const ruta = (usuario: string) => `progreso/${usuario}.json`

function autenticado(req: Request): string {
  const u = usuarioDe(req)
  if (!u) throw new ErrorHttp(401, 'Tu sesión expiró. Vuelve a entrar.')
  return u
}

export const GET = manejar(async (req) => {
  const guardado = await leer<unknown>(ruta(autenticado(req)))
  return json(200, (guardado && validar(guardado.datos)) ?? VACIO)
})

export const PUT = manejar(async (req) => {
  const u = autenticado(req)
  const recibido = validar(await leerCuerpo(req, MAX_BYTES))
  if (!recibido) throw new ErrorHttp(400, 'Progreso con formato inválido.')
  // La fusión ocurre en el servidor, así dos equipos que guardan a la vez no se pisan.
  const fusionado = await actualizar<unknown>(ruta(u), VACIO, (actual) => fusionar(validar(actual) ?? VACIO, recibido))
  return json(200, fusionado)
})
