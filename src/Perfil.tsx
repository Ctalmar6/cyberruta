import { useEffect, useState } from 'react'
import {
  activarRecordatorio, cuenta, desactivarRecordatorio, ErrorApi, pushDisponible, suscripcionActual, type Sesion,
} from './nube'

type Props = {
  sesion: Sesion | null
  estadoNube: string
  onSesion: (s: Sesion) => void
  onCerrarSesion: () => void
  onSalir: () => void
}

const mensaje = (e: unknown) => (e instanceof ErrorApi ? e.message : 'Algo salió mal. Intenta de nuevo.')

export function Perfil({ sesion, estadoNube, onSesion, onCerrarSesion, onSalir }: Props) {
  return (
    <main className="app pantalla">
      <header className="barra-leccion">
        <button className="cerrar" onClick={onSalir} aria-label="Volver al inicio">✕</button>
        <span className="marca">👤 Perfil</span>
        <span />
      </header>
      {sesion ? (
        <>
          <section className="concepto">
            <small>Tu perfil</small>
            <h2>{sesion.usuario}</h2>
            <p className="ayuda">{estadoNube || 'Sincronizando…'}</p>
            <p className="ayuda">Entra con este usuario en tu otro dispositivo y verás el mismo progreso.</p>
          </section>
          <Recordatorio token={sesion.token} />
          <button className="secundario" onClick={onCerrarSesion}>Cerrar sesión en este equipo</button>
        </>
      ) : (
        <Acceso onSesion={onSesion} />
      )}
    </main>
  )
}

function Acceso({ onSesion }: { onSesion: (s: Sesion) => void }) {
  const [modo, setModo] = useState<'registrar' | 'entrar'>('registrar')
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      onSesion(await cuenta(modo, usuario, contrasena))
    } catch (err) {
      setError(mensaje(err))
    } finally {
      setCargando(false)
    }
  }

  const nuevo = modo === 'registrar'
  return (
    <section className="concepto">
      <div className="pestanas" role="tablist">
        <button role="tab" aria-selected={nuevo} className={nuevo ? 'activa' : ''} onClick={() => setModo('registrar')}>Crear perfil</button>
        <button role="tab" aria-selected={!nuevo} className={!nuevo ? 'activa' : ''} onClick={() => setModo('entrar')}>Ya tengo perfil</button>
      </div>
      <p className="ayuda">
        {nuevo
          ? 'Guarda tu progreso en la nube y úsalo en el iPhone y en el Mac. Lo que ya estudiaste en este equipo se suma a tu perfil.'
          : 'Entra con tu usuario y contraseña. Tu progreso de este equipo se junta con el de tu perfil.'}
      </p>
      <form className="formulario" onSubmit={enviar}>
        <label>
          Usuario
          <input
            className="campo"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            minLength={3}
            maxLength={30}
          />
        </label>
        <label>
          Contraseña
          <input
            className="campo"
            type="password"
            name="password"
            autoComplete={nuevo ? 'new-password' : 'current-password'}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            minLength={8}
          />
        </label>
        {nuevo && <p className="ayuda">Mínimo 8 caracteres. No hay forma de recuperarla, así que deja que el llavero de iCloud la guarde.</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="principal" type="submit" disabled={cargando}>
          {cargando ? 'Un momento…' : nuevo ? 'Crear perfil' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}

function Recordatorio({ token }: { token: string }) {
  const [activo, setActivo] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const disponible = pushDisponible()

  useEffect(() => {
    suscripcionActual().then((s) => setActivo(!!s), () => setActivo(false))
  }, [])

  const cambiar = async () => {
    setError('')
    setCargando(true)
    try {
      if (activo) await desactivarRecordatorio(token)
      else await activarRecordatorio(token)
      setActivo(!activo)
    } catch (e) {
      setError(mensaje(e))
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="concepto">
      <small>Recordatorio diario</small>
      <h2>🔔 {activo ? 'Activado en este equipo' : 'Recordatorio'}</h2>
      <p className="ayuda">Cerca de las 20:00 te avisamos si ese día todavía no estudiaste. Si ya estudiaste, no te molestamos.</p>
      {disponible ? (
        <button className={activo ? 'secundario' : 'principal'} onClick={cambiar} disabled={cargando || activo === null}>
          {cargando ? 'Un momento…' : activo ? 'Desactivar en este equipo' : 'Activar recordatorio'}
        </button>
      ) : (
        <p className="ayuda">
          En el iPhone, primero agrega CyberRuta a la pantalla de inicio (Compartir → Agregar a pantalla de inicio) y ábrela desde ese ícono. Ahí aparecerá este botón.
        </p>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  )
}
