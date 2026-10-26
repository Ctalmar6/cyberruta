// Utilidades del servidor. Vercel no publica como ruta lo que está en carpetas que empiezan con "_".
import { createECDH, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { get, put } from '@vercel/blob'

// Las claves (sesiones y notificaciones) se derivan de la credencial del almacenamiento,
// así no hay que crear ni copiar otros secretos. Si esa credencial cambia, las sesiones caducan.
function secreto(etiqueta: string): Buffer {
  const base = process.env.BLOB_READ_WRITE_TOKEN
  if (!base) throw new Error('Falta BLOB_READ_WRITE_TOKEN')
  return createHmac('sha256', base).update(`cyberruta:${etiqueta}`).digest()
}

export function clavesVapid() {
  const ecdh = createECDH('prime256v1')
  ecdh.setPrivateKey(secreto('vapid'))
  return { publica: ecdh.getPublicKey().toString('base64url'), privada: ecdh.getPrivateKey().toString('base64url') }
}

// ── Usuarios y contraseñas ────────────────────────────────────────────────
export const RE_USUARIO = /^[a-z0-9_.]{3,30}$/

export function errorCredenciales(usuario: unknown, contrasena: unknown): string | null {
  if (typeof usuario !== 'string' || !RE_USUARIO.test(usuario)) return 'El usuario debe tener de 3 a 30 caracteres: letras minúsculas, números, punto o guion bajo.'
  if (typeof contrasena !== 'string' || contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (contrasena.length > 200) return 'La contraseña es demasiado larga.'
  return null
}

export type Clave = { sal: string; hash: string }

const derivar = (contrasena: string, sal: Buffer) =>
  new Promise<Buffer>((ok, mal) => scrypt(contrasena.normalize('NFC'), sal, 64, (e, k) => (e ? mal(e) : ok(k))))

export async function hashContrasena(contrasena: string): Promise<Clave> {
  const sal = randomBytes(16)
  return { sal: sal.toString('base64'), hash: (await derivar(contrasena, sal)).toString('base64') }
}

export async function verificarContrasena(contrasena: string, clave: Clave): Promise<boolean> {
  const esperado = Buffer.from(clave.hash, 'base64')
  const calculado = await derivar(contrasena, Buffer.from(clave.sal, 'base64'))
  return esperado.length === calculado.length && timingSafeEqual(esperado, calculado)
}

// ── Sesiones: token firmado "datos.firma", sin guardar nada en el servidor ──
const DIAS_SESION = 180
const firmar = (datos: string) => createHmac('sha256', secreto('sesion')).update(datos).digest('base64url')

export function crearToken(usuario: string, ahora = Date.now()): string {
  const datos = Buffer.from(JSON.stringify({ u: usuario, exp: ahora + DIAS_SESION * 864e5 })).toString('base64url')
  return `${datos}.${firmar(datos)}`
}

export function verificarToken(token: string, ahora = Date.now()): string | null {
  const [datos, firma, ...resto] = token.split('.')
  if (!datos || !firma || resto.length) return null
  const a = Buffer.from(firma)
  const b = Buffer.from(firmar(datos))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const { u, exp } = JSON.parse(Buffer.from(datos, 'base64url').toString())
    return typeof u === 'string' && RE_USUARIO.test(u) && typeof exp === 'number' && exp > ahora ? u : null
  } catch {
    return null
  }
}

// ── Suscripciones push: solo servicios conocidos, para no enviar datos a cualquier URL ──
const HOSTS_PUSH = [/^fcm\.googleapis\.com$/, /\.push\.apple\.com$/, /^updates\.push\.services\.mozilla\.com$/, /\.notify\.windows\.com$/]

export type Suscripcion = { endpoint: string; keys: { p256dh: string; auth: string } }

export function validarSuscripcion(x: unknown): Suscripcion | null {
  const s = x as Suscripcion
  if (typeof s?.endpoint !== 'string' || s.endpoint.length > 1000) return null
  let url: URL
  try {
    url = new URL(s.endpoint)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' || !HOSTS_PUSH.some((h) => h.test(url.hostname))) return null
  const { p256dh, auth } = s.keys ?? {}
  if (typeof p256dh !== 'string' || typeof auth !== 'string' || p256dh.length > 200 || auth.length > 100) return null
  return { endpoint: s.endpoint, keys: { p256dh, auth } }
}

// Fecha de hoy en Chile, igual que la calcula el teléfono del usuario.
export const hoyEnChile = (ahora = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(ahora)

// ── HTTP ──────────────────────────────────────────────────────────────────
export function json(status: number, cuerpo: unknown): Response {
  return new Response(JSON.stringify(cuerpo), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
}

export function usuarioDe(req: Request): string | null {
  const auth = req.headers.get('authorization') ?? ''
  return auth.startsWith('Bearer ') ? verificarToken(auth.slice(7)) : null
}

export async function leerCuerpo(req: Request, maxBytes: number): Promise<unknown> {
  const texto = await req.text()
  if (texto.length > maxBytes) throw new ErrorHttp(413, 'Datos demasiado grandes.')
  try {
    return JSON.parse(texto)
  } catch {
    throw new ErrorHttp(400, 'JSON inválido.')
  }
}

export class ErrorHttp extends Error {
  status: number
  constructor(status: number, mensaje: string) {
    super(mensaje)
    this.status = status
  }
}

// Envuelve un handler: errores conocidos → su código; el resto → 500 sin detalles.
export function manejar(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await fn(req)
    } catch (e) {
      if (e instanceof ErrorHttp) return json(e.status, { error: e.message })
      console.error(e)
      return json(500, { error: 'Error del servidor. Intenta de nuevo.' })
    }
  }
}

// ── Almacenamiento (Vercel Blob privado) ──────────────────────────────────
export async function leer<T>(ruta: string): Promise<{ datos: T; etag: string } | null> {
  const r = await get(ruta, { access: 'private', useCache: false })
  if (!r || r.statusCode !== 200) return null
  return { datos: JSON.parse(await new Response(r.stream).text()) as T, etag: r.blob.etag }
}

export async function crear(ruta: string, datos: unknown): Promise<boolean> {
  try {
    await put(ruta, JSON.stringify(datos), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: false })
    return true
  } catch (e) {
    if (await leer(ruta)) return false // ya existía
    throw e
  }
}

// Leer → cambiar → escribir solo si nadie lo modificó entremedio (ETag). Reintenta si hubo choque.
export async function actualizar<T>(ruta: string, inicial: T, cambio: (actual: T) => T): Promise<T> {
  for (let intento = 0; intento < 4; intento++) {
    const actual = await leer<T>(ruta)
    const nuevo = cambio(actual?.datos ?? inicial)
    try {
      await put(ruta, JSON.stringify(nuevo), {
        access: 'private', contentType: 'application/json', addRandomSuffix: false,
        ...(actual ? { ifMatch: actual.etag } : { allowOverwrite: false }),
      })
      return nuevo
    } catch (e) {
      if (intento === 3) throw e
    }
  }
  throw new Error('inalcanzable')
}
