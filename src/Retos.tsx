import { useEffect, useMemo, useRef, useState } from 'react'
import { retos, type Reto as R } from './laboratorio'
import { crearFS, ejecutar, HOME, promptRuta, USUARIO } from './terminal'

type ListaProps = { hechos: string[]; onAbrir: (id: string) => void; onSalir: () => void }

export function ListaRetos({ hechos, onAbrir, onSalir }: ListaProps) {
  const siguiente = retos.find((r) => !hechos.includes(r.id))
  return (
    <main className="app pantalla">
      <header className="barra-leccion">
        <button className="cerrar" onClick={onSalir} aria-label="Volver al inicio">✕</button>
        <span className="marca">🧪 Laboratorio</span>
        <span className="ayuda">{retos.filter((r) => hechos.includes(r.id)).length}/{retos.length}</span>
      </header>
      <p className="ayuda">Retos en un Linux simulado. Encuentra la flag <code>CR&#123;…&#125;</code> de cada uno y entrégala con <code>enviar</code>.</p>
      <ol className="lecciones">
        {retos.map((r, i) => {
          const hecho = hechos.includes(r.id)
          const disponible = hecho || r.id === siguiente?.id
          return (
            <li key={r.id}>
              <button className={`leccion ${hecho ? 'hecha' : ''}`} disabled={!disponible} onClick={() => onAbrir(r.id)}>
                <span aria-hidden>{hecho ? '✓' : disponible ? '▶' : '🔒'}</span> Reto {i + 1} · {r.titulo}
              </button>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

type Linea = { tipo: 'cmd' | 'out' | 'ok' | 'error'; texto: string }
type RetoProps = { reto: R; onSalir: () => void; onTerminar: (pistasUsadas: number) => void }

export function Reto({ reto, onSalir, onTerminar }: RetoProps) {
  const maquina = useMemo(() => ({ raiz: crearFS(reto.archivos), procesos: reto.procesos }), [reto])
  const [cwd, setCwd] = useState(reto.cwd ?? HOME)
  const [lineas, setLineas] = useState<Linea[]>([{ tipo: 'out', texto: 'Escribe help para ver los comandos.' }])
  const [entrada, setEntrada] = useState('')
  const [historial, setHistorial] = useState<string[]>([])
  const [posHist, setPosHist] = useState(-1)
  const [pistas, setPistas] = useState(0)
  const [resuelto, setResuelto] = useState(false)
  const pantalla = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    pantalla.current?.scrollTo({ top: pantalla.current.scrollHeight })
  }, [lineas])

  const prompt = `${USUARIO}@cyberruta:${promptRuta(cwd)}$`

  const enviarLinea = () => {
    const linea = entrada.trim()
    setEntrada('')
    setPosHist(-1)
    if (linea) setHistorial([linea, ...historial])
    const eco: Linea = { tipo: 'cmd', texto: `${prompt} ${linea}` }
    if (linea === 'clear') return setLineas([])
    if (linea === 'enviar' || linea.startsWith('enviar ')) {
      const flag = linea.slice(6).trim()
      const ok = flag === reto.flag
      if (ok) setResuelto(true)
      return setLineas([...lineas, eco, ok
        ? { tipo: 'ok', texto: '✔ ¡Flag correcta! Reto superado.' }
        : { tipo: 'error', texto: flag ? '✘ Esa no es la flag. Cópiala exacta, con CR{ y }.' : 'Uso: enviar CR{...}' }])
    }
    const r = ejecutar(maquina, cwd, linea)
    setCwd(r.cwd)
    setLineas([...lineas, eco, ...r.salida.map((texto): Linea => ({ tipo: 'out', texto }))])
  }

  const teclas = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const pos = Math.max(-1, Math.min(historial.length - 1, posHist + (e.key === 'ArrowUp' ? 1 : -1)))
    setPosHist(pos)
    setEntrada(pos === -1 ? '' : historial[pos])
  }

  const insertar = (cmd: string) => {
    setEntrada(cmd)
    campo.current?.focus()
  }

  return (
    <main className="app pantalla reto">
      <header className="barra-leccion">
        <button className="cerrar" onClick={onSalir} aria-label="Salir del reto">✕</button>
        <span className="marca">{reto.titulo}</span>
        <span />
      </header>

      <details className="mision" open>
        <summary>Misión</summary>
        <p>{reto.historia}</p>
        {reto.explicacion && <p className="ayuda">{reto.explicacion}</p>}
        <div className="chips">
          {reto.comandos.map((c) => (
            <button key={c.cmd} className="chip" onClick={() => insertar(c.cmd)} title={c.desc}>
              <code>{c.cmd.trim()}</code> <span>{c.desc}</span>
            </button>
          ))}
        </div>
        {reto.pistas.slice(0, pistas).map((p, i) => (
          <p key={i} className="pista">💡 {p}</p>
        ))}
        {pistas < reto.pistas.length && !resuelto && (
          <button className="secundario pequeno" onClick={() => setPistas(pistas + 1)}>
            Ver pista {pistas + 1}/{reto.pistas.length}{pistas === 0 ? ' (sin bono de reto perfecto)' : ''}
          </button>
        )}
      </details>

      <div className="terminal" ref={pantalla} onClick={() => window.getSelection()?.isCollapsed && campo.current?.focus()} role="log" aria-live="polite">
        {lineas.map((l, i) => (
          <pre key={i} className={l.tipo}>{l.texto || ' '}</pre>
        ))}
        {!resuelto && (
          <form className="linea-entrada" onSubmit={(e) => { e.preventDefault(); enviarLinea() }}>
            <label htmlFor="cmd" className="prompt">{prompt}</label>
            <input
              id="cmd"
              ref={campo}
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              onKeyDown={teclas}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="send"
              autoFocus
            />
          </form>
        )}
      </div>

      {resuelto && (
        <div className="feedback ok" role="status">
          <strong>¡Reto superado!</strong>
          <p>Los comandos que usaste se agregaron a tus tarjetas de repaso.</p>
          <button className="principal" onClick={() => onTerminar(pistas)} autoFocus>Continuar</button>
        </div>
      )}
    </main>
  )
}
