import { useState } from 'react'
import { todasLasTarjetas } from './contenido'

type Props = {
  ids: string[]
  onRepasar: (id: string, recordo: boolean) => void
  onSalir: () => void
  onTerminar: () => void
}

export function Repaso({ ids, onRepasar, onSalir, onTerminar }: Props) {
  // App solo abre el repaso con ids que existen en el contenido, así que la cola parte con algo.
  const [cola, setCola] = useState(ids)
  const [volteada, setVolteada] = useState(false)
  const [hechas, setHechas] = useState(0)
  const tarjeta = todasLasTarjetas[cola[0]]

  const responder = (recordo: boolean) => {
    onRepasar(cola[0], recordo)
    const resto = cola.slice(1)
    const nueva = recordo ? resto : [...resto, cola[0]]
    if (recordo) setHechas(hechas + 1)
    if (nueva.length === 0) return onTerminar()
    setCola(nueva)
    setVolteada(false)
  }

  return (
    <main className="app pantalla">
      <header className="barra-leccion">
        <button className="cerrar" onClick={onSalir} aria-label="Salir del repaso">✕</button>
        <span className="ayuda">Repaso · quedan {cola.length}</span>
        <span className="ayuda">✓ {hechas}</span>
      </header>
      <section className="tarjeta">
        <small>¿Recuerdas qué es…?</small>
        <h2>{tarjeta.frente}</h2>
        {volteada && <p>{tarjeta.reverso}</p>}
      </section>
      {volteada ? (
        <div className="dos-botones">
          <button className="secundario" onClick={() => responder(false)}>No me acordé</button>
          <button className="principal" onClick={() => responder(true)}>Me acordé</button>
        </div>
      ) : (
        <button className="principal" onClick={() => setVolteada(true)}>Mostrar respuesta</button>
      )}
    </main>
  )
}
