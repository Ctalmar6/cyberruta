import { createEmptyCard, fsrs, Rating, type CardInput } from 'ts-fsrs'

export const META_DIARIA_XP = 20
export const XP_LECCION = 10
export const XP_LECCION_PERFECTA = 5
export const XP_REPASO = 2

export type Progreso = {
  leccionesHechas: string[]
  xpPorDia: Record<string, number> // 'YYYY-MM-DD' en hora local → XP ganado ese día
  tarjetas: Record<string, CardInput>
}

const VACIO: Progreso = { leccionesHechas: [], xpPorDia: {}, tarjetas: {} }
const CLAVE = 'cyberruta:v1'
const DIA_MS = 24 * 60 * 60 * 1000
const planificador = fsrs()

// Hora local, no UTC: en Chile a las 22:00 UTC ya sería "mañana".
export function fechaLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function xpHoy(p: Progreso, ahora: Date): number {
  return p.xpPorDia[fechaLocal(ahora)] ?? 0
}

// Días seguidos con XP. Si hoy aún no estudias, la racha de ayer sigue viva.
export function racha(p: Progreso, ahora: Date): number {
  const dia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  if (!p.xpPorDia[fechaLocal(dia)]) dia.setDate(dia.getDate() - 1)
  let n = 0
  while (p.xpPorDia[fechaLocal(dia)]) {
    n++
    dia.setDate(dia.getDate() - 1)
  }
  return n
}

function sumarXP(p: Progreso, xp: number, ahora: Date): Progreso {
  const hoy = fechaLocal(ahora)
  return { ...p, xpPorDia: { ...p.xpPorDia, [hoy]: (p.xpPorDia[hoy] ?? 0) + xp } }
}

export function completarLeccion(
  p: Progreso, leccionId: string, tarjetaIds: string[], errores: number, ahora: Date,
): Progreso {
  const tarjetas = { ...p.tarjetas }
  // El primer repaso es mañana: hoy ya lo acabas de ver en la lección.
  const manana = new Date(ahora.getTime() + DIA_MS)
  for (const id of tarjetaIds) tarjetas[id] ??= { ...createEmptyCard(manana) }
  const leccionesHechas = p.leccionesHechas.includes(leccionId)
    ? p.leccionesHechas
    : [...p.leccionesHechas, leccionId]
  const xp = XP_LECCION + (errores === 0 ? XP_LECCION_PERFECTA : 0)
  return sumarXP({ ...p, leccionesHechas, tarjetas }, xp, ahora)
}

export function tarjetasPendientes(p: Progreso, ahora: Date): string[] {
  return Object.entries(p.tarjetas)
    .filter(([, c]) => new Date(c.due) <= ahora)
    .map(([id]) => id)
}

// Solo da XP si te acordaste, para que fallar a propósito no sume.
export function repasar(p: Progreso, id: string, recordo: boolean, ahora: Date): Progreso {
  const tarjeta = p.tarjetas[id]
  if (!tarjeta) return p
  const { card } = planificador.next(tarjeta, ahora, recordo ? Rating.Good : Rating.Again)
  const siguiente = { ...p, tarjetas: { ...p.tarjetas, [id]: card } }
  return recordo ? sumarXP(siguiente, XP_REPASO, ahora) : siguiente
}

export function cargar(): Progreso {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE) ?? 'null')
    if (p && Array.isArray(p.leccionesHechas) && typeof p.xpPorDia === 'object' && typeof p.tarjetas === 'object') {
      return p
    }
  } catch {
    // Datos corruptos o almacenamiento bloqueado: se parte de cero.
  }
  return VACIO
}

export function guardar(p: Progreso): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p))
  } catch {
    // shortcut: si Safari bloquea el almacenamiento se pierde el progreso; la Fase 3 sincroniza en la nube.
  }
}
