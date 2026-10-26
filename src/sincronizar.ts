import type { CardInput } from 'ts-fsrs'
import type { Progreso } from './progreso.ts'

// Código de 32 caracteres hex (128 bits): quien lo tiene puede leer y escribir tu progreso.
export const RE_CODIGO = /^[0-9a-f]{32}$/
export const MAX_BYTES = 200_000

export function nuevoCodigo(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
}

const masReciente = (a: CardInput, b: CardInput) => {
  if (a.reps !== b.reps) return a.reps > b.reps ? a : b
  return new Date(a.last_review ?? 0) >= new Date(b.last_review ?? 0) ? a : b
}

// Fusión conmutativa e idempotente: estudiar en dos equipos sin conexión no pierde nada.
// El XP de cada día es acumulativo en cada equipo, así que el máximo es el total correcto.
export function fusionar(a: Progreso, b: Progreso): Progreso {
  const xpPorDia = { ...a.xpPorDia }
  for (const [dia, xp] of Object.entries(b.xpPorDia)) xpPorDia[dia] = Math.max(xpPorDia[dia] ?? 0, xp)
  const tarjetas = { ...a.tarjetas }
  for (const [id, c] of Object.entries(b.tarjetas)) tarjetas[id] = tarjetas[id] ? masReciente(tarjetas[id], c) : c
  return { leccionesHechas: [...new Set([...a.leccionesHechas, ...b.leccionesHechas])].sort(), xpPorDia, tarjetas }
}

const esObjeto = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const ID = /^[\w-]{1,60}$/
const DIA = /^\d{4}-\d{2}-\d{2}$/

// Valida datos que vienen de afuera (red o almacenamiento). Devuelve null si algo no calza.
export function validar(x: unknown): Progreso | null {
  if (!esObjeto(x) || !Array.isArray(x.leccionesHechas) || !esObjeto(x.xpPorDia) || !esObjeto(x.tarjetas)) return null
  if (!x.leccionesHechas.every((l) => typeof l === 'string' && ID.test(l))) return null
  const xp = Object.entries(x.xpPorDia)
  if (!xp.every(([d, v]) => DIA.test(d) && Number.isInteger(v) && (v as number) >= 0 && (v as number) < 100_000)) return null
  const tarjetas = Object.entries(x.tarjetas)
  const tarjetaOk = (c: unknown) =>
    esObjeto(c) && typeof c.reps === 'number' && typeof c.stability === 'number' && typeof c.difficulty === 'number' &&
    !Number.isNaN(new Date(c.due as string).getTime())
  if (!tarjetas.every(([id, c]) => ID.test(id) && tarjetaOk(c))) return null
  return { leccionesHechas: x.leccionesHechas as string[], xpPorDia: x.xpPorDia as Progreso['xpPorDia'], tarjetas: x.tarjetas as Progreso['tarjetas'] }
}
