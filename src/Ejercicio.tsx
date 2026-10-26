import { useState } from 'react'
import { normalizar, type Ejercicio as E } from './contenido'

type Props = { ejercicio: E; bloqueado: boolean; onResponder: (correcto: boolean) => void }

export function barajar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function respuestaCorrecta(e: E): string {
  if (e.tipo === 'opcion') return e.opciones[e.correcta]
  if (e.tipo === 'completar') return e.respuestas[0]
  if (e.tipo === 'emparejar') return e.pares.map(([a, b]) => `${a} → ${b}`).join(' · ')
  return e.pasos.join(' → ')
}

export function Ejercicio({ ejercicio: e, ...props }: Props) {
  return (
    <div className="ejercicio">
      <h2>{e.pregunta}</h2>
      {e.tipo === 'opcion' && <Opcion e={e} {...props} />}
      {e.tipo === 'completar' && <Completar e={e} {...props} />}
      {e.tipo === 'emparejar' && <Emparejar e={e} {...props} />}
      {e.tipo === 'ordenar' && <Ordenar e={e} {...props} />}
    </div>
  )
}

type P<T extends E['tipo']> = Omit<Props, 'ejercicio'> & { e: Extract<E, { tipo: T }> }

function Opcion({ e, bloqueado, onResponder }: P<'opcion'>) {
  // Verdadero/Falso conserva su orden; el resto se baraja para no memorizar posiciones.
  const [orden] = useState(() => {
    const indices = e.opciones.map((_, i) => i)
    return e.opciones.length > 2 ? barajar(indices) : indices
  })
  const [elegida, setElegida] = useState<number | null>(null)
  return (
    <>
      <div className="opciones">
        {orden.map((i) => (
          <button
            key={i}
            className={`opcion ${elegida === i ? 'elegida' : ''}`}
            aria-pressed={elegida === i}
            disabled={bloqueado}
            onClick={() => setElegida(i)}
          >
            {e.opciones[i]}
          </button>
        ))}
      </div>
      <button className="principal" disabled={bloqueado || elegida === null} onClick={() => onResponder(elegida === e.correcta)}>
        Comprobar
      </button>
    </>
  )
}

function Completar({ e, bloqueado, onResponder }: P<'completar'>) {
  const [texto, setTexto] = useState('')
  const comprobar = () => onResponder(e.respuestas.includes(normalizar(texto)))
  return (
    <form onSubmit={(ev) => { ev.preventDefault(); if (texto.trim()) comprobar() }}>
      <input
        className="campo"
        value={texto}
        onChange={(ev) => setTexto(ev.target.value)}
        disabled={bloqueado}
        placeholder="Escribe tu respuesta"
        aria-label="Tu respuesta"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        autoFocus
      />
      <button className="principal" type="submit" disabled={bloqueado || !texto.trim()}>Comprobar</button>
    </form>
  )
}

function Emparejar({ e, bloqueado, onResponder }: P<'emparejar'>) {
  const [derecha] = useState(() => barajar(e.pares.map(([, b]) => b)))
  const [izq, setIzq] = useState<string | null>(null)
  const [hechos, setHechos] = useState<string[]>([])
  const [errores, setErrores] = useState(0)
  const [fallo, setFallo] = useState<string | null>(null)

  const elegirDerecha = (b: string) => {
    if (!izq) return
    if (e.pares.some(([a, bb]) => a === izq && bb === b)) {
      const nuevos = [...hechos, izq]
      setHechos(nuevos)
      setIzq(null)
      if (nuevos.length === e.pares.length) onResponder(errores === 0)
    } else {
      setErrores(errores + 1)
      setFallo(b)
      setTimeout(() => setFallo(null), 500)
    }
  }
  const parejaHecha = (b: string) => e.pares.some(([a, bb]) => bb === b && hechos.includes(a))

  return (
    <div className="emparejar">
      <div>
        {e.pares.map(([a]) => (
          <button
            key={a}
            className={`opcion ${izq === a ? 'elegida' : ''} ${hechos.includes(a) ? 'hecho' : ''}`}
            aria-pressed={izq === a}
            disabled={bloqueado || hechos.includes(a)}
            onClick={() => setIzq(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <div>
        {derecha.map((b) => (
          <button
            key={b}
            className={`opcion ${parejaHecha(b) ? 'hecho' : ''} ${fallo === b ? 'fallo' : ''}`}
            disabled={bloqueado || parejaHecha(b)}
            onClick={() => elegirDerecha(b)}
          >
            {b}
          </button>
        ))}
      </div>
      <p className="ayuda">{izq ? `Ahora elige la pareja de "${izq}"` : 'Toca un elemento de la izquierda'}</p>
    </div>
  )
}

function Ordenar({ e, bloqueado, onResponder }: P<'ordenar'>) {
  const [disponibles, setDisponibles] = useState(() => {
    let b = barajar(e.pasos)
    for (let i = 0; i < 5 && b.every((p, j) => p === e.pasos[j]); i++) b = barajar(e.pasos)
    return b
  })
  const [elegidos, setElegidos] = useState<string[]>([])
  const mover = (paso: string, aElegidos: boolean) => {
    if (aElegidos) {
      setDisponibles(disponibles.filter((p) => p !== paso))
      setElegidos([...elegidos, paso])
    } else {
      setElegidos(elegidos.filter((p) => p !== paso))
      setDisponibles([...disponibles, paso])
    }
  }
  return (
    <>
      <ol className="ordenados" aria-label="Tu orden">
        {elegidos.map((p) => (
          <li key={p}>
            <button className="opcion elegida" disabled={bloqueado} onClick={() => mover(p, false)}>{p}</button>
          </li>
        ))}
        {elegidos.length === 0 && <li className="ayuda">Toca los pasos en orden</li>}
      </ol>
      <div className="opciones">
        {disponibles.map((p) => (
          <button key={p} className="opcion" disabled={bloqueado} onClick={() => mover(p, true)}>{p}</button>
        ))}
      </div>
      <button
        className="principal"
        disabled={bloqueado || elegidos.length !== e.pasos.length}
        onClick={() => onResponder(elegidos.every((p, i) => p === e.pasos[i]))}
      >
        Comprobar
      </button>
    </>
  )
}
