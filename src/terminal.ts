// Linux simulado: un sistema de archivos de solo lectura y los comandos de los retos.
export type Archivo = { tipo: 'archivo'; contenido: string; permisos: string; dueno: string }
export type Dir = { tipo: 'dir'; hijos: Record<string, Nodo>; permisos: string; dueno: string }
export type Nodo = Archivo | Dir
export type Maquina = { raiz: Dir; procesos?: string[] }

export const USUARIO = 'alumno'
export const HOME = '/home/alumno'

// Rutas → contenido. Una ruta que termina en "/" es una carpeta vacía.
export type EspecArchivos = Record<string, string | Partial<Omit<Archivo, 'tipo'>> | Partial<Omit<Dir, 'tipo' | 'hijos'>>>

const dir = (): Dir => ({ tipo: 'dir', hijos: {}, permisos: 'rwxr-xr-x', dueno: USUARIO })

export function crearFS(espec: EspecArchivos): Dir {
  const raiz = dir()
  for (const [ruta, valor] of Object.entries(espec)) {
    const partes = ruta.split('/').filter(Boolean)
    const esDir = ruta.endsWith('/')
    let actual = raiz
    const ultimas = esDir ? partes : partes.slice(0, -1)
    for (const p of ultimas) {
      const sig = actual.hijos[p]
      actual = sig?.tipo === 'dir' ? sig : (actual.hijos[p] = dir())
    }
    if (esDir) {
      if (typeof valor === 'object') Object.assign(actual, valor)
    } else {
      const meta = typeof valor === 'string' ? { contenido: valor } : valor
      actual.hijos[partes[partes.length - 1]] = { tipo: 'archivo', contenido: '', permisos: 'rw-r--r--', dueno: USUARIO, ...meta } as Archivo
    }
  }
  return raiz
}

// Ruta absoluta normalizada como lista de partes.
export function resolver(cwd: string, ruta: string): string[] {
  const base = ruta.startsWith('/') ? '' : ruta === '~' || ruta.startsWith('~/') ? HOME : cwd
  const resto = ruta.startsWith('~') ? ruta.slice(1) : ruta
  const partes: string[] = []
  for (const p of `${base}/${resto}`.split('/')) {
    if (p === '' || p === '.') continue
    if (p === '..') partes.pop()
    else partes.push(p)
  }
  return partes
}

function buscar(raiz: Dir, partes: string[]): Nodo | undefined {
  let n: Nodo = raiz
  for (const p of partes) {
    if (n.tipo !== 'dir') return undefined
    n = n.hijos[p]
    if (!n) return undefined
  }
  return n
}

// shortcut: ignora el grupo; solo distingue dueño y "otros", basta para los retos.
const permiso = (n: Nodo, bit: 0 | 1 | 2) => n.permisos[(n.dueno === USUARIO ? 0 : 6) + bit] !== '-'
const puedeLeer = (n: Nodo) => permiso(n, 0)
const puedeEntrar = (n: Nodo) => permiso(n, 2)

export const rutaTexto = (partes: string[]) => '/' + partes.join('/')
export function promptRuta(cwd: string): string {
  return cwd === HOME ? '~' : cwd.startsWith(HOME + '/') ? '~' + cwd.slice(HOME.length) : cwd
}

// Separa por espacios respetando comillas simples y dobles.
export function separar(linea: string): string[] {
  const args: string[] = []
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g
  for (const m of linea.matchAll(re)) args.push(m[1] ?? m[2] ?? m[3])
  return args
}

function patronAGlob(patron: string): RegExp {
  const escapado = patron.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')
  return new RegExp(`^${escapado}$`)
}

const NO_EXISTE = 'No existe el archivo o el directorio'

export const AYUDA = [
  'Comandos disponibles:',
  '  pwd                       muestra en qué carpeta estás',
  '  ls [-a] [-l] [ruta]       lista archivos (-a ocultos, -l detalles)',
  '  cd [ruta]                 entra a una carpeta (cd .. sube, cd ~ vuelve a casa)',
  '  cat archivo               muestra el contenido de un archivo',
  '  grep [-i] texto archivo   muestra las líneas que contienen el texto',
  '  find ruta -name patrón    busca archivos por nombre (* = cualquier texto)',
  '  ps aux                    lista los procesos en ejecución',
  '  whoami                    muestra tu usuario',
  '  clear                     limpia la pantalla',
  '  enviar CR{...}            entrega la flag del reto',
]

export function ejecutar(m: Maquina, cwd: string, linea: string): { cwd: string; salida: string[] } {
  if (linea.includes('|')) return { cwd, salida: ['Las tuberías (|) llegan en un próximo nivel. Por ahora, un comando a la vez.'] }
  const [cmd, ...args] = separar(linea)
  const salida: string[] = []
  const nodoDe = (ruta: string) => buscar(m.raiz, resolver(cwd, ruta))

  switch (cmd) {
    case undefined:
      break
    case 'help':
      salida.push(...AYUDA)
      break
    case 'pwd':
      salida.push(cwd)
      break
    case 'whoami':
      salida.push(USUARIO)
      break
    case 'echo':
      salida.push(args.join(' '))
      break
    case 'cd': {
      const ruta = args[0] ?? '~'
      const n = nodoDe(ruta)
      if (!n) salida.push(`cd: ${ruta}: ${NO_EXISTE}`)
      else if (n.tipo !== 'dir') salida.push(`cd: ${ruta}: No es un directorio`)
      else if (!puedeEntrar(n)) salida.push(`cd: ${ruta}: Permiso denegado`)
      else return { cwd: rutaTexto(resolver(cwd, ruta)), salida }
      break
    }
    case 'ls': {
      const opciones = args.filter((a) => a.startsWith('-')).join('')
      const rutas = args.filter((a) => !a.startsWith('-'))
      const todos = opciones.includes('a')
      const largo = opciones.includes('l')
      const ruta = rutas[0] ?? '.'
      const n = nodoDe(ruta)
      const fila = (nombre: string, x: Nodo) => {
        if (!largo) return nombre
        const tam = x.tipo === 'archivo' ? x.contenido.length : 4096
        return `${x.tipo === 'dir' ? 'd' : '-'}${x.permisos} ${x.dueno.padEnd(8)} ${String(tam).padStart(5)} ${nombre}`
      }
      if (!n) salida.push(`ls: no se puede acceder a '${ruta}': ${NO_EXISTE}`)
      else if (n.tipo === 'archivo') salida.push(fila(ruta, n))
      else if (!puedeLeer(n)) salida.push(`ls: no se puede abrir el directorio '${ruta}': Permiso denegado`)
      else {
        const nombres = Object.keys(n.hijos).filter((k) => todos || !k.startsWith('.')).sort()
        const filas = [...(todos ? [fila('.', n), fila('..', n)] : []), ...nombres.map((k) => fila(k, n.hijos[k]))]
        if (largo) salida.push(...filas)
        else if (filas.length) salida.push(filas.join('  '))
      }
      break
    }
    case 'cat': {
      if (!args.length) salida.push('cat: falta el nombre del archivo. Ejemplo: cat notas.txt')
      for (const ruta of args) {
        const n = nodoDe(ruta)
        if (!n) salida.push(`cat: ${ruta}: ${NO_EXISTE}`)
        else if (n.tipo === 'dir') salida.push(`cat: ${ruta}: Es un directorio`)
        else if (!puedeLeer(n)) salida.push(`cat: ${ruta}: Permiso denegado`)
        else salida.push(...n.contenido.split('\n'))
      }
      break
    }
    case 'grep': {
      const sinMayus = args.includes('-i')
      const [texto, ruta] = args.filter((a) => a !== '-i')
      if (!texto || !ruta) {
        salida.push('Uso: grep texto archivo. Ejemplo: grep error registro.log')
        break
      }
      const n = nodoDe(ruta)
      if (!n) salida.push(`grep: ${ruta}: ${NO_EXISTE}`)
      else if (n.tipo === 'dir') salida.push(`grep: ${ruta}: Es un directorio`)
      else if (!puedeLeer(n)) salida.push(`grep: ${ruta}: Permiso denegado`)
      else {
        const busca = sinMayus ? texto.toLowerCase() : texto
        salida.push(...n.contenido.split('\n').filter((l) => (sinMayus ? l.toLowerCase() : l).includes(busca)))
      }
      break
    }
    case 'find': {
      const iName = args.indexOf('-name')
      const ruta = iName === 0 || !args.length ? '.' : args[0]
      const patron = iName >= 0 ? args[iName + 1] : undefined
      if (iName >= 0 && !patron) {
        salida.push("find: falta el patrón después de -name. Ejemplo: find . -name 'notas*'")
        break
      }
      const re = patron ? patronAGlob(patron) : null
      const inicio = nodoDe(ruta)
      if (!inicio) {
        salida.push(`find: '${ruta}': ${NO_EXISTE}`)
        break
      }
      const recorrer = (n: Nodo, mostrado: string, nombre: string) => {
        if (!re || re.test(nombre)) salida.push(mostrado)
        if (n.tipo !== 'dir') return
        if (!puedeLeer(n)) return salida.push(`find: '${mostrado}': Permiso denegado`)
        for (const k of Object.keys(n.hijos).sort()) recorrer(n.hijos[k], mostrado === '/' ? `/${k}` : `${mostrado}/${k}`, k)
      }
      recorrer(inicio, ruta, resolver(cwd, ruta).at(-1) ?? '/')
      break
    }
    case 'ps':
      salida.push(...(m.procesos ?? ['USUARIO   PID  %CPU  COMANDO', 'alumno   1520   0.0  -bash', 'alumno   2301   0.0  ps']))
      break
    default:
      salida.push(`${cmd}: comando no encontrado. Escribe "help" para ver los comandos.`)
  }
  return { cwd, salida }
}
