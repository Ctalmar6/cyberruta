import assert from 'node:assert/strict'
import { test } from 'node:test'
import { retos } from './laboratorio.ts'
import { crearFS, ejecutar, HOME, promptRuta, resolver, separar, type Maquina } from './terminal.ts'

const m: Maquina = {
  raiz: crearFS({
    'home/alumno/a.txt': 'hola\nmundo\nHola otra vez',
    'home/alumno/.oculto': 'x',
    'home/alumno/sub/b.txt': 'b',
    'root/': { permisos: 'rwx------', dueno: 'root' },
    'root/c.txt': 'c',
    'etc/secreto': { contenido: 's', permisos: 'rw-------', dueno: 'root' },
  }),
}
const run = (linea: string, cwd = HOME) => ejecutar(m, cwd, linea)

test('rutas y separación de argumentos', () => {
  assert.deepEqual(resolver('/home/alumno', '../x/./y'), ['home', 'x', 'y'])
  assert.deepEqual(resolver('/etc', '~/sub'), ['home', 'alumno', 'sub'])
  assert.deepEqual(resolver('/', '..'), [])
  assert.deepEqual(separar(`find / -name 'llave*'  "con espacio"`), ['find', '/', '-name', 'llave*', 'con espacio'])
  assert.equal(promptRuta('/home/alumno/sub'), '~/sub')
  assert.equal(promptRuta('/etc'), '/etc')
})

test('ls, cd y cat', () => {
  assert.deepEqual(run('ls').salida, ['a.txt  sub'])
  assert.ok(run('ls -a').salida[0].includes('.oculto'))
  assert.match(run('ls -l').salida[0], /^-rw-r--r-- alumno\s+24 a\.txt$/)
  assert.equal(run('cd sub').cwd, '/home/alumno/sub')
  assert.equal(run('cd').cwd, HOME)
  assert.equal(run('cd ..', '/home/alumno/sub').cwd, HOME)
  assert.match(run('cd nada').salida[0], /No existe/)
  assert.match(run('cd a.txt').salida[0], /No es un directorio/)
  assert.deepEqual(run('cat a.txt').salida, ['hola', 'mundo', 'Hola otra vez'])
  assert.match(run('cat sub').salida[0], /Es un directorio/)
})

test('permisos: dueño vs. otros', () => {
  assert.match(run('cat /etc/secreto').salida[0], /Permiso denegado/)
  assert.match(run('cd /root').salida[0], /Permiso denegado/)
  assert.match(run('ls /root').salida[0], /Permiso denegado/)
})

test('grep y find', () => {
  assert.deepEqual(run('grep hola a.txt').salida, ['hola'])
  assert.deepEqual(run('grep -i hola a.txt').salida, ['hola', 'Hola otra vez'])
  assert.deepEqual(run("find / -name '*.txt'").salida, ['/home/alumno/a.txt', '/home/alumno/sub/b.txt', "find: '/root': Permiso denegado"])
  assert.deepEqual(run('find . -name b.txt').salida, ['./sub/b.txt'])
})

test('comandos desconocidos y tuberías', () => {
  assert.match(run('rm -rf /').salida[0], /comando no encontrado/)
  assert.match(run('ps aux | grep x').salida[0], /tuberías/)
})

test('cada reto: la solución revela la flag y el contenido es coherente', () => {
  const ids = new Set<string>()
  for (const r of retos) {
    assert.ok(!ids.has(r.id), `id repetido ${r.id}`)
    ids.add(r.id)
    assert.match(r.flag, /^CR\{[a-z_]+\}$/, r.id)
    assert.equal(r.pistas.length, 3, r.id)
    const maquina: Maquina = { raiz: crearFS(r.archivos), procesos: r.procesos }
    let cwd = r.cwd ?? HOME
    const vista: string[] = []
    for (const linea of r.solucion) {
      const res = ejecutar(maquina, cwd, linea)
      assert.ok(!res.salida.some((l) => /No existe|comando no encontrado|Permiso denegado: /.test(l)), `${r.id}: "${linea}" falló: ${res.salida}`)
      cwd = res.cwd
      vista.push(...res.salida)
    }
    assert.ok(vista.some((l) => l.includes(r.flag)), `${r.id}: la solución no muestra ${r.flag}`)
    // El cwd inicial debe existir, o el reto parte roto.
    assert.equal(ejecutar(maquina, '/', `cd ${r.cwd ?? HOME}`).salida.length, 0, r.id)
  }
})
