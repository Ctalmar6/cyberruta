// GET → clave pública para suscribirse · POST (suscripción) → guarda · DELETE { endpoint } → borra
import { actualizar, clavesVapid, ErrorHttp, json, leerCuerpo, manejar, usuarioDe, validarSuscripcion, type Suscripcion } from './_lib/servidor.js'

export type Suscripciones = { usuario: string; lista: Suscripcion[]; ultimoAviso?: string }

const MAX_EQUIPOS = 5

function autenticado(req: Request): string {
  const u = usuarioDe(req)
  if (!u) throw new ErrorHttp(401, 'Tu sesión expiró. Vuelve a entrar.')
  return u
}

export const GET = manejar(async () => json(200, { clavePublica: clavesVapid().publica }))

export const POST = manejar(async (req) => {
  const u = autenticado(req)
  const sub = validarSuscripcion(await leerCuerpo(req, 3000))
  if (!sub) throw new ErrorHttp(400, 'Suscripción inválida.')
  await actualizar<Suscripciones>(`suscripciones/${u}.json`, { usuario: u, lista: [] }, (s) => ({
    ...s,
    lista: [...s.lista.filter((x) => x.endpoint !== sub.endpoint), sub].slice(-MAX_EQUIPOS),
  }))
  return json(200, { ok: true })
})

export const DELETE = manejar(async (req) => {
  const u = autenticado(req)
  const { endpoint } = (await leerCuerpo(req, 3000)) as { endpoint?: unknown }
  if (typeof endpoint !== 'string') throw new ErrorHttp(400, 'Falta el endpoint.')
  await actualizar<Suscripciones>(`suscripciones/${u}.json`, { usuario: u, lista: [] }, (s) => ({
    ...s,
    lista: s.lista.filter((x) => x.endpoint !== endpoint),
  }))
  return json(200, { ok: true })
})
