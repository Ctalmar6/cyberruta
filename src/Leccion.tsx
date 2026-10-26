import { useState } from 'react'
import type { Leccion as L } from './contenido'
import { Ejercicio, respuestaCorrecta } from './Ejercicio'

type Props = { leccion: L; onSalir: () => void; onTerminar: (errores: number) => void }

export function Leccion({ leccion, onSalir, onTerminar }: Props) {
  const [concepto, setConcepto] = useState(0)
  // Cola de índices de ejercicios: el que fallas vuelve al final, como en Duolingo.
  const [cola, setCola] = useState(() => leccion.ejercicios.map((_, i) => i))
  const [intento, setIntento] = useState(0)
  const [resultado, setResultado] = useState<boolean | null>(null)
  const [errores, setErrores] = useState(0)

  const enConceptos = concepto < leccion.conceptos.length
  const total = leccion.conceptos.length + leccion.ejercicios.length
  const avance = enConceptos ? concepto : leccion.conceptos.length + leccion.ejercicios.length - cola.length
  const actual = leccion.ejercicios[cola[0]]

  const responder = (correcto: boolean) => {
    setResultado(correcto)
    if (!correcto) setErrores(errores + 1)
  }
  const continuar = () => {
    const resto = cola.slice(1)
    const nueva = resultado ? resto : [...resto, cola[0]]
    if (nueva.length === 0) return onTerminar(errores)
    setCola(nueva)
    setResultado(null)
    setIntento(intento + 1)
  }

  return (
    <main className="app pantalla">
      <header className="barra-leccion">
        <button className="cerrar" onClick={onSalir} aria-label="Salir de la lección">✕</button>
        <div className="progreso" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={avance}>
          <div style={{ width: `${(avance / total) * 100}%` }} />
        </div>
      </header>

      {enConceptos ? (
        <section className="concepto">
          <small>{leccion.titulo} · {concepto + 1}/{leccion.conceptos.length}</small>
          <h2>{leccion.conceptos[concepto].titulo}</h2>
          <p>{leccion.conceptos[concepto].texto}</p>
          <button className="principal" onClick={() => setConcepto(concepto + 1)}>
            {concepto + 1 < leccion.conceptos.length ? 'Siguiente' : '¡A practicar!'}
          </button>
        </section>
      ) : (
        <Ejercicio key={intento} ejercicio={actual} bloqueado={resultado !== null} onResponder={responder} />
      )}

      {resultado !== null && (
        <div className={`feedback ${resultado ? 'ok' : 'mal'}`} role="status">
          <strong>{resultado ? '¡Correcto!' : 'No exactamente'}</strong>
          {!resultado && <p>Respuesta: {respuestaCorrecta(actual)}</p>}
          <p>{actual.explicacion}</p>
          <button className="principal" onClick={continuar} autoFocus>
            {resultado ? 'Continuar' : 'Entendido, la repito al final'}
          </button>
        </div>
      )}
    </main>
  )
}
