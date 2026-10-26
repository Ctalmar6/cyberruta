import { retos } from './laboratorio.ts'
import { unidad2 } from './unidad2.ts'
import { unidad3 } from './unidad3.ts'

export type Ejercicio =
  | { tipo: 'opcion'; pregunta: string; opciones: string[]; correcta: number; explicacion: string }
  | { tipo: 'completar'; pregunta: string; respuestas: string[]; explicacion: string }
  | { tipo: 'emparejar'; pregunta: string; pares: [string, string][]; explicacion: string }
  | { tipo: 'ordenar'; pregunta: string; pasos: string[]; explicacion: string }

export type Tarjeta = { id: string; frente: string; reverso: string }

export type Leccion = {
  id: string
  titulo: string
  conceptos: { titulo: string; texto: string }[]
  ejercicios: Ejercicio[]
  tarjetas: Tarjeta[]
}

const VF = ['Verdadero', 'Falso']

export const unidad1: Leccion[] = [
  {
    id: 'u1-l1',
    titulo: '¿Qué es un computador?',
    conceptos: [
      {
        titulo: 'Una máquina que procesa información',
        texto: 'Un computador recibe datos (entrada), los procesa siguiendo instrucciones y entrega un resultado (salida). Tu celular, un servidor web y hasta el router de tu casa son computadores.',
      },
      {
        titulo: 'Hardware y software',
        texto: 'El hardware es la parte física: procesador, memoria, disco y pantalla. El software son las instrucciones: el sistema operativo y los programas. Sin software, el hardware no sabe qué hacer.',
      },
      {
        titulo: '¿Por qué empezar aquí?',
        texto: 'Para atacar o defender un sistema tienes que entender cómo funciona por dentro. Casi todo ataque abusa de alguna pieza que vas a conocer en esta unidad.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Cuál de estos es software?',
        opciones: ['Procesador', 'Teclado', 'Navegador web', 'Disco duro'],
        correcta: 2,
        explicacion: 'El navegador es un programa: son instrucciones, no algo que puedas tocar.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Un router es un computador.',
        opciones: VF,
        correcta: 0,
        explicacion: 'Tiene procesador, memoria y su propio sistema operativo. Por eso también se puede hackear.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada componente con su función',
        pares: [
          ['Teclado', 'Entrada'],
          ['Pantalla', 'Salida'],
          ['Procesador', 'Procesamiento'],
          ['Disco', 'Almacenamiento'],
        ],
        explicacion: 'Entrada, procesamiento, almacenamiento y salida: las cuatro tareas básicas de todo computador.',
      },
      {
        tipo: 'ordenar',
        pregunta: 'Ordena lo que pasa cuando escribes una letra',
        pasos: [
          'Presionas una tecla',
          'El procesador recibe la señal',
          'El programa decide qué mostrar',
          'La letra aparece en la pantalla',
        ],
        explicacion: 'Es el ciclo entrada → procesamiento → salida, que ocurre en milisegundos.',
      },
      {
        tipo: 'completar',
        pregunta: 'La parte física de un computador se llama ___.',
        respuestas: ['hardware'],
        explicacion: 'Hardware es lo físico; software son las instrucciones.',
      },
    ],
    tarjetas: [
      { id: 'u1-hardware', frente: 'Hardware', reverso: 'La parte física del computador: procesador, memoria, disco, pantalla.' },
      { id: 'u1-software', frente: 'Software', reverso: 'Las instrucciones: el sistema operativo y los programas.' },
      { id: 'u1-ciclo', frente: 'Ciclo básico de un computador', reverso: 'Entrada → procesamiento → salida (y almacenamiento).' },
    ],
  },
  {
    id: 'u1-l2',
    titulo: 'CPU y memoria',
    conceptos: [
      {
        titulo: 'La CPU, el cerebro',
        texto: 'La CPU (procesador) ejecuta instrucciones una tras otra, miles de millones por segundo. Dentro tiene una memoria pequeñísima y ultrarrápida llamada caché.',
      },
      {
        titulo: 'RAM, la memoria de trabajo',
        texto: 'La RAM guarda lo que estás usando ahora: los programas abiertos y sus datos. Es muy rápida, pero volátil: se borra al apagar el equipo.',
      },
      {
        titulo: 'Almacenamiento, lo que perdura',
        texto: 'El disco (SSD o HDD) guarda tus archivos de forma permanente. Es más lento que la RAM, pero no se borra al apagar. Un SSD es mucho más rápido que un HDD.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'Como la RAM contiene lo que está en uso, puede tener contraseñas o claves de cifrado. Por eso los analistas forenses capturan la RAM antes de apagar un equipo comprometido.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué se pierde al apagar el computador?',
        opciones: ['Lo guardado en el SSD', 'Lo que está en la RAM', 'Los archivos del escritorio', 'El sistema operativo instalado'],
        correcta: 1,
        explicacion: 'La RAM es volátil: sin energía, su contenido desaparece.',
      },
      {
        tipo: 'completar',
        pregunta: 'La memoria que se borra al apagar el equipo se llama ___.',
        respuestas: ['ram', 'memoria ram', 'la ram'],
        explicacion: 'RAM = memoria de acceso aleatorio. Rápida pero volátil.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada pieza con lo que hace',
        pares: [
          ['CPU', 'Ejecuta instrucciones'],
          ['RAM', 'Guarda lo que está en uso'],
          ['SSD', 'Guarda archivos para siempre'],
        ],
        explicacion: 'La CPU trabaja con lo que hay en la RAM, y la RAM se llena desde el disco.',
      },
      {
        tipo: 'ordenar',
        pregunta: 'Ordena de la memoria más rápida a la más lenta',
        pasos: ['Caché de la CPU', 'RAM', 'SSD', 'Disco duro (HDD)'],
        explicacion: 'Mientras más cerca de la CPU, más rápida y más pequeña es la memoria.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Por qué un analista forense captura la RAM antes de apagar un equipo atacado?',
        opciones: [
          'Para que el equipo funcione más rápido',
          'Porque ahí hay evidencia que desaparece al apagar',
          'Porque el disco se borra al apagar',
          'Para instalar un antivirus',
        ],
        correcta: 1,
        explicacion: 'Procesos maliciosos, conexiones y claves viven en la RAM. Si apagas, se pierden.',
      },
    ],
    tarjetas: [
      { id: 'u1-cpu', frente: 'CPU', reverso: 'El procesador: ejecuta las instrucciones de los programas.' },
      { id: 'u1-ram', frente: 'RAM', reverso: 'Memoria de trabajo, rápida y volátil: se borra al apagar.' },
      { id: 'u1-disco', frente: 'SSD / HDD', reverso: 'Almacenamiento permanente. El SSD es mucho más rápido que el HDD.' },
      { id: 'u1-forense-ram', frente: '¿Por qué capturar la RAM en un incidente?', reverso: 'Contiene evidencia (procesos, conexiones, claves) que se pierde al apagar.' },
    ],
  },
  {
    id: 'u1-l3',
    titulo: 'El sistema operativo',
    conceptos: [
      {
        titulo: 'El administrador del equipo',
        texto: 'El sistema operativo (SO) administra el hardware y permite que los programas lo usen sin pelearse entre ellos. Ejemplos: Windows, macOS, Linux, Android e iOS.',
      },
      {
        titulo: 'El kernel',
        texto: 'El corazón del SO es el kernel. Controla la memoria, los procesos y los dispositivos. Los programas no tocan el hardware directamente: le piden al kernel que lo haga mediante llamadas al sistema.',
      },
      {
        titulo: 'Usuarios y privilegios',
        texto: 'El SO separa a los usuarios normales de los administradores (en Linux, el administrador se llama root). El administrador puede cambiarlo todo; por eso los atacantes intentan "escalar privilegios" hasta ese nivel.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Cuál NO es un sistema operativo?',
        opciones: ['Linux', 'Windows', 'Microsoft Word', 'iOS'],
        correcta: 2,
        explicacion: 'Word es un programa que funciona sobre un sistema operativo.',
      },
      {
        tipo: 'completar',
        pregunta: 'El corazón del sistema operativo se llama ___.',
        respuestas: ['kernel', 'el kernel', 'nucleo', 'el nucleo'],
        explicacion: 'El kernel (núcleo) es la parte del SO que controla directamente el hardware.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Un programa necesita leer un archivo del disco. ¿Qué hace?',
        opciones: ['Lee el disco directamente', 'Le pide al kernel que lo lea', 'Le pide permiso a la pantalla', 'Copia el disco entero a la RAM'],
        correcta: 1,
        explicacion: 'Usa una llamada al sistema: el kernel revisa los permisos y hace la lectura.',
      },
      {
        tipo: 'completar',
        pregunta: 'En Linux, el usuario administrador se llama ___.',
        respuestas: ['root'],
        explicacion: 'root puede hacer cualquier cosa en el sistema, por eso es el objetivo favorito de un atacante.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué significa "escalar privilegios"?',
        opciones: [
          'Instalar más programas',
          'Conseguir más permisos de los que tenías',
          'Aumentar la memoria RAM',
          'Actualizar el sistema',
        ],
        correcta: 1,
        explicacion: 'Por ejemplo, pasar de un usuario normal a root aprovechando una falla.',
      },
    ],
    tarjetas: [
      { id: 'u1-so', frente: 'Sistema operativo', reverso: 'Software que administra el hardware y lo comparte entre los programas.' },
      { id: 'u1-kernel', frente: 'Kernel', reverso: 'El núcleo del SO: controla memoria, procesos y dispositivos.' },
      { id: 'u1-root', frente: 'root', reverso: 'El usuario administrador en Linux. Puede hacerlo todo.' },
      { id: 'u1-escalada', frente: 'Escalada de privilegios', reverso: 'Conseguir más permisos de los que te corresponden, idealmente hasta administrador.' },
    ],
  },
  {
    id: 'u1-l4',
    titulo: 'Programas y procesos',
    conceptos: [
      {
        titulo: 'Programa vs. proceso',
        texto: 'Un programa es un archivo con instrucciones guardado en el disco. Cuando lo abres, el SO lo carga en la RAM y se convierte en un proceso: un programa en ejecución.',
      },
      {
        titulo: 'Cada proceso tiene un número',
        texto: 'El SO identifica cada proceso con un número llamado PID. Si abres el mismo programa dos veces, tendrás dos procesos con PID distintos.',
      },
      {
        titulo: 'Multitarea',
        texto: 'La CPU alterna entre procesos tan rápido que parece que todos corren a la vez. Puedes verlos en el Administrador de tareas (Windows), el Monitor de Actividad (macOS) o con el comando ps en Linux.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'El malware, cuando se ejecuta, también es un proceso. Revisar procesos extraños es una de las primeras cosas que hace un analista.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: 'Un programa en ejecución se llama…',
        opciones: ['Archivo', 'Proceso', 'Kernel', 'Caché'],
        correcta: 1,
        explicacion: 'El programa está en el disco; el proceso es ese programa cargado en la RAM y ejecutándose.',
      },
      {
        tipo: 'completar',
        pregunta: 'El número que identifica a cada proceso se llama ___.',
        respuestas: ['pid'],
        explicacion: 'PID = Process ID, el identificador del proceso.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Si abres el navegador dos veces, ambos procesos tienen el mismo PID.',
        opciones: VF,
        correcta: 1,
        explicacion: 'Cada proceso recibe su propio PID, aunque venga del mismo programa.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada sistema con la forma de ver sus procesos',
        pares: [
          ['Windows', 'Administrador de tareas'],
          ['macOS', 'Monitor de Actividad'],
          ['Linux', 'Comando ps'],
        ],
        explicacion: 'Pruébalo ahora en tu computador: vas a ver decenas de procesos.',
      },
      {
        tipo: 'ordenar',
        pregunta: 'Ordena lo que pasa al abrir un programa',
        pasos: [
          'Haces doble clic en el programa',
          'El SO lee el archivo desde el disco',
          'El SO lo carga en la RAM y le asigna un PID',
          'La CPU ejecuta sus instrucciones',
        ],
        explicacion: 'Del disco a la RAM, y de la RAM a la CPU: así nace un proceso.',
      },
    ],
    tarjetas: [
      { id: 'u1-proceso', frente: 'Programa vs. proceso', reverso: 'Programa: archivo en el disco. Proceso: ese programa ejecutándose en la RAM.' },
      { id: 'u1-pid', frente: 'PID', reverso: 'Process ID: el número único con que el SO identifica a cada proceso.' },
      { id: 'u1-ps', frente: 'Comando ps', reverso: 'Muestra los procesos en ejecución en Linux.' },
      { id: 'u1-malware-proceso', frente: '¿Por qué revisar procesos en un incidente?', reverso: 'El malware en ejecución es un proceso: un proceso extraño es una pista.' },
    ],
  },
  {
    id: 'u1-l5',
    titulo: 'Todo junto: ¿por qué importa?',
    conceptos: [
      {
        titulo: 'Cada pieza es un objetivo',
        texto: 'La RAM puede guardar contraseñas en uso. Un SO desactualizado tiene fallas conocidas. Los privilegios se pueden escalar. Y el malware corre como un proceso más. Ya sabes dónde mirar.',
      },
      {
        titulo: 'El principio de menor privilegio',
        texto: 'Usa una cuenta normal para el día a día y la de administrador solo cuando la necesites. Así, si algo te infecta, el malware queda con pocos permisos.',
      },
      {
        titulo: 'Actualiza',
        texto: 'Las actualizaciones corrigen fallas de seguridad que los atacantes ya conocen. Un sistema sin actualizar es una puerta que dejaste abierta.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Por qué conviene usar una cuenta normal en vez de administrador para el día a día?',
        opciones: [
          'Porque es más rápida',
          'Porque si te infectan, el malware tiene menos permisos',
          'Porque gasta menos RAM',
          'No hay ninguna diferencia',
        ],
        correcta: 1,
        explicacion: 'Es el principio de menor privilegio: cada uno con los permisos justos y necesarios.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Por qué son importantes las actualizaciones del sistema?',
        opciones: [
          'Solo cambian el diseño',
          'Corrigen fallas de seguridad que los atacantes ya conocen',
          'Aceleran el disco',
          'Borran todo el malware automáticamente',
        ],
        correcta: 1,
        explicacion: 'Cuando se publica una falla, los atacantes la aprovechan en los equipos que no se actualizaron.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada concepto con lo que aprendiste',
        pares: [
          ['RAM', 'Puede contener contraseñas en uso'],
          ['Kernel', 'Controla el hardware'],
          ['Proceso', 'Programa en ejecución'],
          ['root', 'Administrador en Linux'],
        ],
        explicacion: '¡Terminaste la Unidad 1! Ya tienes la base para entender las redes.',
      },
      {
        tipo: 'completar',
        pregunta: 'Usar solo los permisos necesarios es el principio de menor ___.',
        respuestas: ['privilegio'],
        explicacion: 'Es uno de los principios más importantes de toda la ciberseguridad.',
      },
      {
        tipo: 'ordenar',
        pregunta: 'Ordena las capas, desde la más baja hasta la más alta',
        pasos: ['Hardware', 'Kernel', 'Resto del sistema operativo', 'Tus programas'],
        explicacion: 'Cada capa usa la de abajo. Tus programas nunca tocan el hardware directamente.',
      },
    ],
    tarjetas: [
      { id: 'u1-menor-privilegio', frente: 'Principio de menor privilegio', reverso: 'Usar solo los permisos necesarios para cada tarea.' },
      { id: 'u1-actualizar', frente: '¿Por qué actualizar el sistema?', reverso: 'Las actualizaciones corrigen fallas que los atacantes ya conocen.' },
    ],
  },
]

// En el orden de la ruta: la unidad i corresponde a ruta[0].unidades[i].
export const unidades: Leccion[][] = [unidad1, unidad2, unidad3]
export const lecciones = unidades.flat()

export const todasLasTarjetas: Record<string, Tarjeta> = Object.fromEntries(
  [...lecciones, ...retos].flatMap((l) => l.tarjetas).map((t) => [t.id, t]),
)

// Minúsculas y sin tildes, para no castigar "núcleo" vs "nucleo".
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
}
