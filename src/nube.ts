// Cliente de la API: perfil, progreso en la nube y recordatorio.
import type { Progreso } from './progreso'
import { validar } from './sincronizar'

export type Sesion = { usuario: string; token: string }

const CLAVE_SESION = 'cyberruta:sesion'

export function sesionGuardada(): Sesion | null {
  try {
    const s = JSON.parse(localStorage.getItem(CLAVE_SESION) ?? 'null')
    return typeof s?.usuario === 'string' && typeof s?.token === 'string' ? s : null
  } catch {
    return null
  }
}

export function guardarSesion(s: Sesion | null): void {
  try {
    if (s) localStorage.setItem(CLAVE_SESION, JSON.stringify(s))
    else localStorage.removeItem(CLAVE_SESION)
  } catch {
    // Almacenamiento bloqueado: la sesión dura solo mientras la app esté abierta.
  }
}

export class ErrorApi extends Error {
  status: number
  constructor(status: number, mensaje: string) {
    super(mensaje)
    this.status = status
  }
}

// Las rutas son relativas al origen: en GitHub Pages no hay API y fallan con un error claro.
async function api<T>(ruta: string, opciones: { metodo?: string; token?: string; cuerpo?: unknown } = {}): Promise<T> {
  let r: Response
  try {
    r = await fetch(`/api/${ruta}`, {
      method: opciones.metodo ?? 'GET',
      headers: {
        ...(opciones.cuerpo !== undefined && { 'content-type': 'application/json' }),
        ...(opciones.token && { authorization: `Bearer ${opciones.token}` }),
      },
      body: opciones.cuerpo !== undefined ? JSON.stringify(opciones.cuerpo) : undefined,
    })
  } catch {
    throw new ErrorApi(0, 'Sin conexión. Tu progreso se guarda en este equipo y se sincroniza cuando vuelva internet.')
  }
  const datos = await r.json().catch(() => ({}))
  if (!r.ok) throw new ErrorApi(r.status, datos.error ?? 'Algo salió mal. Intenta de nuevo.')
  return datos as T
}

export const cuenta = (accion: 'registrar' | 'entrar', usuario: string, contrasena: string) =>
  api<Sesion>('cuenta', { metodo: 'POST', cuerpo: { accion, usuario: usuario.trim().toLowerCase(), contrasena } })

async function conValidacion(promesa: Promise<unknown>): Promise<Progreso> {
  const p = validar(await promesa)
  if (!p) throw new ErrorApi(500, 'El servidor devolvió un progreso inválido.')
  return p
}

export const traerProgreso = (token: string) => conValidacion(api('progreso', { token }))
export const subirProgreso = (token: string, p: Progreso) => conValidacion(api('progreso', { metodo: 'PUT', token, cuerpo: p }))

// ── Recordatorio (Web Push) ──
export const pushDisponible = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window

const aUint8 = (b64: string) => Uint8Array.from(atob(b64.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))

export async function suscripcionActual(): Promise<PushSubscription | null> {
  if (!pushDisponible()) return null
  const reg = await navigator.serviceWorker.getRegistration()
  return (await reg?.pushManager.getSubscription()) ?? null
}

export async function activarRecordatorio(token: string): Promise<void> {
  if ((await Notification.requestPermission()) !== 'granted') {
    throw new ErrorApi(0, 'Las notificaciones están bloqueadas. Actívalas en los ajustes del sistema para CyberRuta.')
  }
  const reg = await navigator.serviceWorker.ready
  const { clavePublica } = await api<{ clavePublica: string }>('suscripcion')
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: aUint8(clavePublica) })
  await api('suscripcion', { metodo: 'POST', token, cuerpo: sub.toJSON() })
}

export async function desactivarRecordatorio(token: string): Promise<void> {
  const sub = await suscripcionActual()
  if (!sub) return
  await api('suscripcion', { metodo: 'DELETE', token, cuerpo: { endpoint: sub.endpoint } }).catch(() => {})
  await sub.unsubscribe()
}
