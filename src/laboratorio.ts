import type { Tarjeta } from './contenido'
import type { EspecArchivos } from './terminal'

export type Reto = {
  id: string
  titulo: string
  historia: string
  explicacion?: string
  comandos: { cmd: string; desc: string }[]
  pistas: string[]
  archivos: EspecArchivos
  procesos?: string[]
  cwd?: string
  flag: string
  solucion: string[] // comandos que revelan la flag; lo verifican las pruebas
  tarjetas: Tarjeta[]
}

const BINARIO = { contenido: '(datos comprimidos)', permisos: 'rw-------' }

const intentosFallidos = (desde: number, hasta: number) =>
  Array.from({ length: hasta - desde }, (_, i) => {
    const s = String((desde + i) % 60).padStart(2, '0')
    return `Oct 26 03:14:${s} servidor sshd[${4100 + desde + i}]: Failed password for root from 198.51.100.7 port ${50000 + (desde + i) * 7} ssh2`
  })

const authLog = [
  'Oct 26 02:58:11 servidor sshd[3988]: Accepted publickey for admin from 192.0.2.10 port 41022 ssh2',
  'Oct 26 03:01:45 servidor sshd[3990]: Disconnected from user admin 192.0.2.10 port 41022',
  ...intentosFallidos(0, 24),
  'Oct 26 03:14:31 servidor sshd[4131]: Failed password for soporte from 198.51.100.7 port 52107 ssh2',
  'Oct 26 03:14:33 servidor sshd[4132]: Accepted password for soporte from 198.51.100.7 port 52114 ssh2 sesion=CR{grep_lo_encuentra}',
  ...intentosFallidos(34, 40),
].join('\n')

export const retos: Reto[] = [
  {
    id: 'lab-1',
    titulo: 'Primeros pasos en la terminal',
    historia: 'Estás conectado a un servidor Linux. Averigua en qué carpeta estás, mira qué archivos hay y lee el mensaje de bienvenida. Adentro está tu primera flag.',
    comandos: [
      { cmd: 'pwd', desc: 'Muestra en qué carpeta estás' },
      { cmd: 'ls', desc: 'Lista los archivos de la carpeta' },
      { cmd: 'cat ', desc: 'Muestra el contenido de un archivo' },
      { cmd: 'help', desc: 'Muestra todos los comandos' },
    ],
    pistas: [
      'Escribe pwd y presiona Enter para ver dónde estás.',
      'Escribe ls para ver los archivos. ¿Ves bienvenida.txt?',
      'Escribe cat bienvenida.txt para leerlo.',
    ],
    archivos: {
      'home/alumno/bienvenida.txt': '¡Bienvenido a tu primer servidor Linux!\nAquí todo se maneja escribiendo comandos.\n\nTu primera flag: CR{hola_terminal}\n\nPara entregarla escribe: enviar CR{hola_terminal}',
      'home/alumno/notas.txt': 'Recuerda: la terminal distingue mayúsculas de minúsculas. Notas.txt y notas.txt son archivos distintos.',
    },
    flag: 'CR{hola_terminal}',
    solucion: ['pwd', 'ls', 'cat bienvenida.txt'],
    tarjetas: [
      { id: 'lab-pwd', frente: 'pwd', reverso: 'Muestra la carpeta en la que estás (print working directory).' },
      { id: 'lab-ls', frente: 'ls', reverso: 'Lista los archivos y carpetas.' },
      { id: 'lab-cat', frente: 'cat archivo', reverso: 'Muestra el contenido de un archivo.' },
    ],
  },
  {
    id: 'lab-2',
    titulo: 'Moverse entre carpetas',
    historia: 'Un compañero dejó un archivo con la flag en alguna parte de su carpeta de documentos. Navega por las carpetas hasta encontrarlo.',
    explicacion: 'Una ruta absoluta empieza en la raíz "/" (por ejemplo /home/alumno). Una ruta relativa parte desde donde estás (por ejemplo documentos/clases).',
    comandos: [
      { cmd: 'cd ', desc: 'Entra a una carpeta' },
      { cmd: 'cd ..', desc: 'Sube a la carpeta anterior' },
      { cmd: 'cd ~', desc: 'Vuelve a tu carpeta personal' },
      { cmd: 'ls ', desc: 'Lista otra carpeta sin entrar' },
    ],
    pistas: [
      'Empieza con ls para ver las carpetas de tu carpeta personal.',
      'Entra con cd documentos y vuelve a listar. Repite en cada carpeta.',
      'La flag está en documentos/proyectos/secreto. Entra y usa cat LEEME.txt.',
    ],
    archivos: {
      'home/alumno/documentos/clases/apuntes.txt': 'Redes: TCP usa un handshake de 3 pasos.',
      'home/alumno/documentos/fotos/': '',
      'home/alumno/documentos/proyectos/web/index.html': '<h1>En construcción</h1>',
      'home/alumno/documentos/proyectos/secreto/LEEME.txt': 'Bien hecho, ya sabes moverte.\nFlag: CR{cd_es_tu_mapa}',
      'home/alumno/descargas/': '',
    },
    flag: 'CR{cd_es_tu_mapa}',
    solucion: ['cd documentos/proyectos/secreto', 'cat LEEME.txt'],
    tarjetas: [
      { id: 'lab-cd', frente: 'cd ruta · cd .. · cd ~', reverso: 'Entrar a una carpeta · subir una · volver a tu carpeta personal.' },
      { id: 'lab-rutas', frente: 'Ruta absoluta vs. relativa', reverso: 'Absoluta empieza en / (la raíz). Relativa parte desde la carpeta actual.' },
    ],
  },
  {
    id: 'lab-3',
    titulo: 'Archivos ocultos',
    historia: 'En Linux, los archivos cuyo nombre empieza con un punto están ocultos: ls no los muestra. Los atacantes a veces esconden cosas así. Encuentra lo que está oculto en tu carpeta.',
    comandos: [{ cmd: 'ls -a', desc: 'Muestra también los archivos ocultos' }],
    pistas: [
      'Prueba ls -a y compáralo con ls.',
      'Hay una carpeta llamada .secreto. Entra con cd .secreto',
      'Adentro también hay un archivo oculto: usa ls -a otra vez y luego cat.',
    ],
    archivos: {
      'home/alumno/tareas.txt': 'Nada interesante por aquí.',
      'home/alumno/.bashrc': "# Configuración de la terminal\nalias ll='ls -la'",
      'home/alumno/.secreto/.flag': 'Lo encontraste: CR{nada_se_esconde}',
    },
    flag: 'CR{nada_se_esconde}',
    solucion: ['ls -a', 'cd .secreto', 'ls -a', 'cat .flag'],
    tarjetas: [
      { id: 'lab-ls-a', frente: 'ls -a', reverso: 'Lista también los archivos ocultos (los que empiezan con punto).' },
    ],
  },
  {
    id: 'lab-4',
    titulo: 'Permisos',
    historia: 'Hay cuatro respaldos, pero no todos son tuyos. Usa ls -l para ver los permisos y el dueño de cada archivo. Solo uno lo puedes leer.',
    explicacion: 'Los permisos vienen en grupos de tres: dueño, grupo y otros. r = leer, w = escribir, x = ejecutar. Por ejemplo, -rw-r--r-- significa que el dueño lee y escribe, y el resto solo lee.',
    comandos: [{ cmd: 'ls -l', desc: 'Lista con detalles: permisos, dueño y tamaño' }],
    pistas: [
      'Escribe ls -l. La primera columna son los permisos y la segunda el dueño.',
      'Tú no eres el dueño de ninguno: fíjate en los últimos 3 caracteres (los permisos de "otros").',
      'Es respaldo_3.txt: cat respaldo_3.txt',
    ],
    cwd: '/home/alumno/respaldos',
    archivos: {
      'home/alumno/respaldos/respaldo_1.tar': { ...BINARIO, dueno: 'root' },
      'home/alumno/respaldos/respaldo_2.tar': { ...BINARIO, dueno: 'root' },
      'home/alumno/respaldos/respaldo_3.txt': { contenido: 'Respaldo de configuración\nFlag: CR{rwx_dominado}', permisos: 'rw-r--r--', dueno: 'admin' },
      'home/alumno/respaldos/respaldo_4.tar': { ...BINARIO, dueno: 'admin' },
    },
    flag: 'CR{rwx_dominado}',
    solucion: ['ls -l', 'cat respaldo_3.txt'],
    tarjetas: [
      { id: 'lab-rwx', frente: 'r · w · x', reverso: 'Leer · escribir · ejecutar.' },
      { id: 'lab-permisos', frente: '-rw-r--r--', reverso: 'El dueño lee y escribe; el grupo y los demás solo leen.' },
    ],
  },
  {
    id: 'lab-5',
    titulo: 'Investiga el registro',
    historia: 'Alguien inició sesión en este servidor sin permiso. Los registros de acceso están en /var/log/auth.log, pero son demasiadas líneas para leerlas una por una. Encuentra el inicio de sesión exitoso: la palabra clave es "Accepted".',
    explicacion: 'grep muestra solo las líneas que contienen un texto. Es una de las herramientas favoritas de los analistas. Fíjate también desde qué IP vienen los intentos fallidos.',
    comandos: [
      { cmd: 'grep ', desc: 'grep texto archivo: filtra líneas' },
      { cmd: 'grep -i ', desc: 'Igual, sin distinguir mayúsculas' },
    ],
    pistas: [
      'Prueba cat /var/log/auth.log para ver cuántas líneas tiene.',
      'Ahora filtra: grep Accepted /var/log/auth.log',
      'Hay dos inicios exitosos. El sospechoso viene de la misma IP que los intentos fallidos, y la flag está al final de esa línea.',
    ],
    archivos: { 'var/log/auth.log': authLog, 'home/alumno/': '' },
    flag: 'CR{grep_lo_encuentra}',
    solucion: ['grep Accepted /var/log/auth.log'],
    tarjetas: [
      { id: 'lab-grep', frente: 'grep texto archivo', reverso: 'Muestra solo las líneas que contienen ese texto.' },
      { id: 'lab-fuerza-bruta', frente: 'Muchos "Failed password" desde la misma IP', reverso: 'Señal de un ataque de fuerza bruta.' },
    ],
  },
  {
    id: 'lab-6',
    titulo: 'Buscar archivos',
    historia: 'El intruso dejó una llave escondida en alguna parte del sistema. Sabes que su nombre empieza con "llave", pero no dónde está. Revisar carpeta por carpeta tomaría horas: usa find.',
    explicacion: 'find ruta -name patrón busca archivos por nombre. El * reemplaza cualquier texto: llave* encuentra llave.txt, llavero, llave_vieja…',
    comandos: [{ cmd: 'find / -name ', desc: 'Busca por nombre en todo el sistema' }],
    pistas: [
      'Busca en todo el sistema empezando desde la raíz: find / -name …',
      "Usa el patrón con asterisco: find / -name 'llave*'",
      'Vas a ver varios resultados (y un "Permiso denegado"). Lee cada uno con cat.',
    ],
    archivos: {
      'etc/hosts': '127.0.0.1 localhost',
      'etc/ssh/sshd_config': 'PermitRootLogin no\nPasswordAuthentication yes',
      'usr/share/doc/LEEME': 'Documentación del sistema.',
      'home/alumno/llavero.txt': 'Lista de compras: pan, leche, café.',
      'root/': { permisos: 'rwx------', dueno: 'root' },
      'root/llave_root.txt': { contenido: 'No deberías poder leer esto.', permisos: 'rw-------', dueno: 'root' },
      'tmp/.cache/sistema/llave_maestra.txt': 'La encontraste: CR{find_lo_ve_todo}',
    },
    flag: 'CR{find_lo_ve_todo}',
    solucion: ["find / -name 'llave*'", 'cat /tmp/.cache/sistema/llave_maestra.txt'],
    tarjetas: [
      { id: 'lab-find', frente: "find / -name 'patrón'", reverso: 'Busca archivos por nombre en todo el sistema.' },
      { id: 'lab-tmp', frente: '/tmp', reverso: 'Carpeta temporal donde cualquiera puede escribir: un escondite típico.' },
    ],
  },
  {
    id: 'lab-7',
    titulo: 'Proceso sospechoso',
    historia: 'El servidor anda lentísimo. Puede haber un programa malicioso corriendo. Lista los procesos y encuentra el que no debería estar ahí.',
    explicacion: 'ps aux muestra todos los procesos: quién los ejecuta, su PID, cuánta CPU usan y el comando. Un minero de criptomonedas suele usar casi toda la CPU.',
    comandos: [{ cmd: 'ps aux', desc: 'Lista todos los procesos' }],
    pistas: [
      'Escribe ps aux.',
      'Mira la columna %CPU: ¿cuál usa casi el 100%?',
      'La flag está escrita en el comando de ese proceso.',
    ],
    archivos: { 'home/alumno/': '' },
    procesos: [
      'USUARIO    PID  %CPU  COMANDO',
      'root         1   0.0  /sbin/init',
      'root       412   0.1  /usr/sbin/sshd',
      'www-data   803   0.3  nginx: worker process',
      'alumno    1520   0.0  -bash',
      'soporte   2217  97.8  /tmp/.x/kworkerd --pool minar.example.net --wallet CR{ps_revela_todo}',
      'alumno    2301   0.0  ps aux',
    ],
    flag: 'CR{ps_revela_todo}',
    solucion: ['ps aux'],
    tarjetas: [
      { id: 'lab-ps', frente: 'ps aux', reverso: 'Lista todos los procesos en ejecución.' },
      { id: 'lab-minero', frente: 'Proceso desconocido con la CPU cerca del 100%', reverso: 'Posible minero de criptomonedas u otro malware.' },
    ],
  },
]
