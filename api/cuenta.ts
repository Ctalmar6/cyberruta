// POST /api/cuenta { accion: 'registrar' | 'entrar', usuario, contrasena } → { usuario, token }
import {
  actualizar, crear, crearToken, errorCredenciales, ErrorHttp, hashContrasena, json, leer, leerCuerpo, manejar,
  verificarContrasena, type Clave,
} from './_lib/servidor.js'

type Usuario = { usuario: string; clave: Clave; creado: string; fallos: number; bloqueadoHasta: number }

const MAX_FALLOS = 5
const BLOQUEO_MS = 15 * 60 * 1000
const INCORRECTO = 'Usuario o contraseña incorrectos.'

export const POST = manejar(async (req) => {
  const cuerpo = (await leerCuerpo(req, 2000)) as { accion?: string; usuario?: unknown; contrasena?: unknown }
  const usuario = typeof cuerpo.usuario === 'string' ? cuerpo.usuario.trim().toLowerCase() : cuerpo.usuario
  const error = errorCredenciales(usuario, cuerpo.contrasena)
  if (error) throw new ErrorHttp(400, error)
  const u = usuario as string
  const contrasena = cuerpo.contrasena as string
  const ruta = `usuarios/${u}.json`

  if (cuerpo.accion === 'registrar') {
    const nuevo: Usuario = { usuario: u, clave: await hashContrasena(contrasena), creado: new Date().toISOString(), fallos: 0, bloqueadoHasta: 0 }
    if (!(await crear(ruta, nuevo))) throw new ErrorHttp(409, 'Ese usuario ya existe. Elige otro o entra con tu contraseña.')
    return json(201, { usuario: u, token: crearToken(u) })
  }

  if (cuerpo.accion === 'entrar') {
    const guardado = await leer<Usuario>(ruta)
    if (!guardado) {
      await hashContrasena(contrasena) // mismo tiempo de respuesta que con un usuario real
      throw new ErrorHttp(401, INCORRECTO)
    }
    if (guardado.datos.bloqueadoHasta > Date.now()) throw new ErrorHttp(429, 'Demasiados intentos fallidos. Prueba de nuevo en 15 minutos.')
    const ok = await verificarContrasena(contrasena, guardado.datos.clave)
    if (!ok || guardado.datos.fallos > 0) {
      await actualizar<Usuario>(ruta, guardado.datos, (x) => {
        if (ok) return { ...x, fallos: 0 }
        const fallos = x.fallos + 1
        return fallos >= MAX_FALLOS ? { ...x, fallos: 0, bloqueadoHasta: Date.now() + BLOQUEO_MS } : { ...x, fallos }
      })
    }
    if (!ok) throw new ErrorHttp(401, INCORRECTO)
    return json(200, { usuario: u, token: crearToken(u) })
  }

  throw new ErrorHttp(400, 'Acción desconocida.')
})
