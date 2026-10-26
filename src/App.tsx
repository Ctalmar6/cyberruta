import { useEffect, useState } from 'react'
import { lecciones, todasLasTarjetas, unidades } from './contenido'
import { retos } from './laboratorio'
import { ListaRetos, Reto } from './Retos'
import { Leccion } from './Leccion'
import {
  cargar, completarLeccion, guardar, META_DIARIA_XP, racha, repasar, tarjetasPendientes, xpHoy, type Progreso,
} from './progreso'
import { Repaso } from './Repaso'
import { ruta } from './ruta'

type Pantalla =
  | { tipo: 'inicio' }
  | { tipo: 'leccion'; id: string; antes: Antes }
  | { tipo: 'repaso'; ids: string[]; antes: Antes }
  | { tipo: 'resultado'; antes: Antes }
  | { tipo: 'laboratorio' }
  | { tipo: 'reto'; id: string; antes: Antes }

// XP y racha al abrir la lección o el repaso, para mostrar cuánto ganaste.
type Antes = { xp: number; racha: number }

export default function App() {
  const [progreso, setProgreso] = useState<Progreso>(cargar)
  const [pantalla, setPantalla] = useState<Pantalla>({ tipo: 'inicio' })
  useEffect(() => guardar(progreso), [progreso])

  const ahora = new Date()
  const xp = xpHoy(progreso, ahora)
  const dias = racha(progreso, ahora)
  const pendientes = tarjetasPendientes(progreso, ahora).filter((id) => todasLasTarjetas[id])
  const siguiente = lecciones.find((l) => !progreso.leccionesHechas.includes(l.id))
  const antes = { xp, racha: dias }
  const retosHechos = retos.filter((r) => progreso.leccionesHechas.includes(r.id)).length

  if (pantalla.tipo === 'leccion') {
    const leccion = lecciones.find((l) => l.id === pantalla.id)!
    return (
      <Leccion
        leccion={leccion}
        onSalir={() => setPantalla({ tipo: 'inicio' })}
        onTerminar={(errores) => {
          setProgreso(completarLeccion(progreso, leccion.id, leccion.tarjetas.map((t) => t.id), errores, new Date()))
          setPantalla({ tipo: 'resultado', antes: pantalla.antes })
        }}
      />
    )
  }

  if (pantalla.tipo === 'repaso') {
    return (
      <Repaso
        ids={pantalla.ids}
        onRepasar={(id, recordo) => setProgreso((p) => repasar(p, id, recordo, new Date()))}
        onSalir={() => setPantalla({ tipo: 'inicio' })}
        onTerminar={() => setPantalla({ tipo: 'resultado', antes: pantalla.antes })}
      />
    )
  }

  if (pantalla.tipo === 'laboratorio') {
    return (
      <ListaRetos
        hechos={progreso.leccionesHechas}
        onAbrir={(id) => setPantalla({ tipo: 'reto', id, antes })}
        onSalir={() => setPantalla({ tipo: 'inicio' })}
      />
    )
  }

  if (pantalla.tipo === 'reto') {
    const reto = retos.find((r) => r.id === pantalla.id)!
    return (
      <Reto
        reto={reto}
        onSalir={() => setPantalla({ tipo: 'laboratorio' })}
        onTerminar={(pistas) => {
          setProgreso(completarLeccion(progreso, reto.id, reto.tarjetas.map((t) => t.id), pistas, new Date()))
          setPantalla({ tipo: 'resultado', antes: pantalla.antes })
        }}
      />
    )
  }

  if (pantalla.tipo === 'resultado') {
    const ganado = xp - pantalla.antes.xp
    const metaRecienCumplida = pantalla.antes.xp < META_DIARIA_XP && xp >= META_DIARIA_XP
    return (
      <main className="app pantalla resultado">
        <div className="celebra" aria-hidden>{metaRecienCumplida ? '🏆' : '🎉'}</div>
        <h1>{metaRecienCumplida ? '¡Meta diaria cumplida!' : '¡Bien hecho!'}</h1>
        <p className="xp-ganado">+{ganado} XP</p>
        <p className="racha">🔥 {dias} {dias === 1 ? 'día' : 'días'} de racha{dias > pantalla.antes.racha ? ' · ¡sumaste un día!' : ''}</p>
        <button className="principal" onClick={() => setPantalla({ tipo: 'inicio' })} autoFocus>Continuar</button>
      </main>
    )
  }

  const progresoMeta = Math.min(xp / META_DIARIA_XP, 1)
  const abrirLeccion = (id: string) => setPantalla({ tipo: 'leccion', id, antes })

  return (
    <main className="app">
      <header className="barra">
        <span className="marca">&gt;_ CyberRuta</span>
        <span className="racha" aria-label={`Racha de ${dias} días`}>🔥 {dias}</span>
      </header>

      <section className="hoy">
        <div className="anillo" style={{ '--p': progresoMeta } as React.CSSProperties} role="img" aria-label={`${xp} de ${META_DIARIA_XP} XP hoy`}>
          <span>{xp}<small>/{META_DIARIA_XP} XP</small></span>
        </div>
        <div className="hoy-texto">
          <h1>{xp >= META_DIARIA_XP ? '¡Meta cumplida! 🏆' : 'Tu meta de hoy'}</h1>
          <p>
            {dias === 0
              ? 'Tu racha empieza con tu primera lección.'
              : xp > 0 ? `Llevas ${dias} ${dias === 1 ? 'día seguido' : 'días seguidos'}. ¡Sigue así!` : `No pierdas tu racha de ${dias} ${dias === 1 ? 'día' : 'días'}: estudia hoy.`}
          </p>
          <div className="acciones">
            {pendientes.length > 0 && (
              <button className="principal" onClick={() => setPantalla({ tipo: 'repaso', ids: pendientes, antes })}>
                Repasar {pendientes.length} {pendientes.length === 1 ? 'tarjeta' : 'tarjetas'}
              </button>
            )}
            {siguiente ? (
              <button className={pendientes.length > 0 ? 'secundario' : 'principal'} onClick={() => abrirLeccion(siguiente.id)}>
                {progreso.leccionesHechas.length === 0 ? 'Comenzar' : 'Siguiente'}: {siguiente.titulo}
              </button>
            ) : (
              pendientes.length === 0 && <p className="ayuda">¡Completaste todas las lecciones! 🎉 Pronto llega más contenido.</p>
            )}
          </div>
        </div>
      </section>

      <button className="lab-acceso" onClick={() => setPantalla({ tipo: 'laboratorio' })}>
        <span className="emoji" aria-hidden>🧪</span>
        <span>
          <strong>Laboratorio de Linux</strong>
          <small>{retosHechos}/{retos.length} retos · practica comandos en una terminal simulada</small>
        </span>
        <span aria-hidden>›</span>
      </button>

      <h2>Tu ruta de 0 a 100</h2>
      <ol className="ruta">
        {ruta.map((nivel) => (
          <li key={nivel.numero} className={nivel.numero === 1 ? 'nivel actual' : 'nivel bloqueado'}>
            <div className="nivel-cabecera">
              <span className="emoji" aria-hidden>{nivel.emoji}</span>
              <div>
                <small>Nivel {nivel.numero}</small>
                <h3>{nivel.titulo}</h3>
              </div>
              {nivel.numero !== 1 && <span className="candado" aria-label="Bloqueado">🔒</span>}
            </div>
            {nivel.unidades.length > 0 && (
              <ul className="unidades">
                {nivel.unidades.map((u, i) => (
                  <li key={u.titulo}>
                    <span className="punto">{i + 1}</span>
                    <div className="unidad-cuerpo">
                      <strong>{u.titulo}</strong>
                      <p>{u.temas}</p>
                      {unidades[i] ? (
                        <ul className="lecciones">
                          {unidades[i].map((l) => {
                            const hecha = progreso.leccionesHechas.includes(l.id)
                            const disponible = hecha || l.id === siguiente?.id
                            return (
                              <li key={l.id}>
                                <button className={`leccion ${hecha ? 'hecha' : ''}`} disabled={!disponible} onClick={() => abrirLeccion(l.id)}>
                                  <span aria-hidden>{hecha ? '✓' : disponible ? '▶' : '🔒'}</span> {l.titulo}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      ) : u.titulo.startsWith('Linux') ? (
                        <button className="leccion" onClick={() => setPantalla({ tipo: 'laboratorio' })}>
                          <span aria-hidden>🧪</span> Practícalo en el Laboratorio
                        </button>
                      ) : (
                        <p className="ayuda">Próximamente</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </main>
  )
}
