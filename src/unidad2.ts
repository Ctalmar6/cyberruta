import type { Leccion } from './contenido'

const VF = ['Verdadero', 'Falso']

export const unidad2: Leccion[] = [
  {
    id: 'u2-l1',
    titulo: '¿Qué es una red?',
    conceptos: [
      {
        titulo: 'Computadores conversando',
        texto: 'Una red es un grupo de dispositivos conectados que intercambian datos. Tu casa tiene una red local (LAN), e internet es una red de redes que conecta millones de ellas en todo el mundo.',
      },
      {
        titulo: 'Paquetes',
        texto: 'La información no viaja de una sola vez: se divide en trozos pequeños llamados paquetes. Cada paquete lleva la dirección de origen y la de destino, como una carta.',
      },
      {
        titulo: 'El router',
        texto: 'El router conecta tu red local con internet y decide por dónde enviar cada paquete. Por eso es una pieza clave… y un objetivo favorito de los atacantes.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué es internet?',
        opciones: ['Un programa de Google', 'Una red de redes conectadas en todo el mundo', 'Un solo computador gigante', 'El wifi de tu casa'],
        correcta: 1,
        explicacion: 'Internet une millones de redes: la de tu casa, la de tu universidad, las de las empresas…',
      },
      {
        tipo: 'completar',
        pregunta: 'Los datos viajan por la red divididos en ___.',
        respuestas: ['paquetes', 'paquete'],
        explicacion: 'Cada paquete viaja por su cuenta y el destino los vuelve a armar.',
      },
      {
        tipo: 'opcion',
        pregunta: 'La red de tu casa es una LAN (red local).',
        opciones: VF,
        correcta: 0,
        explicacion: 'LAN = Local Area Network: una red en un espacio acotado, como una casa u oficina.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada concepto con su significado',
        pares: [
          ['LAN', 'Red de tu casa u oficina'],
          ['Internet', 'Red de redes mundial'],
          ['Router', 'Conecta tu red con internet'],
          ['Paquete', 'Trozo de información'],
        ],
        explicacion: 'Con estas cuatro piezas ya puedes imaginar cómo viaja un mensaje.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Por qué el router es un objetivo atractivo para un atacante?',
        opciones: ['Porque tiene mucha RAM', 'Porque todo el tráfico de la red pasa por él', 'Porque es caro', 'Porque no tiene sistema operativo'],
        correcta: 1,
        explicacion: 'Quien controla el router puede ver o desviar todo lo que entra y sale de la red.',
      },
    ],
    tarjetas: [
      { id: 'u2-lan', frente: 'LAN', reverso: 'Red local: la de tu casa u oficina.' },
      { id: 'u2-paquete', frente: 'Paquete', reverso: 'Trozo de información que viaja por la red con origen y destino.' },
      { id: 'u2-router', frente: 'Router', reverso: 'Conecta tu red local con internet y dirige los paquetes.' },
    ],
  },
  {
    id: 'u2-l2',
    titulo: 'Direcciones IP',
    conceptos: [
      {
        titulo: 'La dirección de cada equipo',
        texto: 'Cada dispositivo de una red tiene una dirección IP, que indica a dónde enviar los paquetes. Una IPv4 se ve así: 192.168.1.10. Son cuatro números del 0 al 255 separados por puntos.',
      },
      {
        titulo: 'Privadas y públicas',
        texto: 'Dentro de tu casa los equipos usan IP privadas (como 192.168.x.x o 10.x.x.x), que no se ven desde internet. Hacia afuera, tu router usa una sola IP pública para todos; esa traducción se llama NAT. Y 127.0.0.1 (localhost) siempre apunta a tu propio equipo.',
      },
      {
        titulo: 'IPv6',
        texto: 'Las direcciones IPv4 se están agotando, así que existe IPv6, con direcciones mucho más largas, como 2001:db8::1.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'En los registros de un ataque, lo primero que mira un analista es la IP de origen: de dónde vino la conexión. Ya lo hiciste en el laboratorio con auth.log.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Cuál es una dirección IPv4 válida?',
        opciones: ['192.168.1.300', '10.0.0.25', '192.168.1', '256.1.1.1'],
        correcta: 1,
        explicacion: 'Debe tener cuatro números y cada uno ir de 0 a 255. 300 y 256 se pasan.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Cuál de estas IP es privada?',
        opciones: ['8.8.8.8', '192.168.0.15', '1.1.1.1', '200.27.4.1'],
        correcta: 1,
        explicacion: 'Las que empiezan con 192.168 son privadas: solo existen dentro de una red local.',
      },
      {
        tipo: 'completar',
        pregunta: 'Cada número de una IPv4 va de 0 a ___.',
        respuestas: ['255'],
        explicacion: 'Cada número ocupa 8 bits, y con 8 bits se puede contar de 0 a 255.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Desde internet se puede ver la IP privada de tu notebook.',
        opciones: VF,
        correcta: 1,
        explicacion: 'Internet solo ve la IP pública de tu router, que traduce las conexiones con NAT.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada dirección con su tipo',
        pares: [
          ['192.168.1.10', 'IP privada'],
          ['8.8.8.8', 'IP pública'],
          ['2001:db8::1', 'IPv6'],
          ['127.0.0.1', 'Tu propio equipo'],
        ],
        explicacion: '127.0.0.1 se llama localhost: sirve para que un equipo se hable a sí mismo.',
      },
    ],
    tarjetas: [
      { id: 'u2-ip', frente: 'Dirección IP', reverso: 'Identifica a un equipo en la red. IPv4: cuatro números del 0 al 255.' },
      { id: 'u2-ip-privada', frente: 'IP privada', reverso: '192.168.x.x o 10.x.x.x: solo existe dentro de una red local.' },
      { id: 'u2-nat', frente: 'NAT', reverso: 'El router traduce tus IP privadas a una sola IP pública.' },
      { id: 'u2-localhost', frente: '127.0.0.1', reverso: 'localhost: tu propio equipo.' },
    ],
  },
  {
    id: 'u2-l3',
    titulo: 'Puertos',
    conceptos: [
      {
        titulo: 'Una IP, muchos servicios',
        texto: 'Un servidor puede ofrecer varios servicios a la vez: una web, correo, acceso remoto. El puerto indica a qué servicio va cada paquete. Si la IP es la dirección del edificio, el puerto es el número del departamento.',
      },
      {
        titulo: 'Puertos conocidos',
        texto: 'Hay 65.535 puertos, y algunos son estándar: 80 para HTTP (web), 443 para HTTPS (web cifrada), 22 para SSH (acceso remoto) y 53 para DNS.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'Cada puerto abierto es una puerta de entrada. Lo primero que hace un atacante es escanear qué puertos tiene abiertos un servidor, con herramientas como nmap. La defensa: cerrar todo lo que no se usa.',
      },
    ],
    ejercicios: [
      {
        tipo: 'emparejar',
        pregunta: 'Une cada puerto con su servicio',
        pares: [
          ['80', 'HTTP (web)'],
          ['443', 'HTTPS (web cifrada)'],
          ['22', 'SSH (acceso remoto)'],
          ['53', 'DNS'],
        ],
        explicacion: 'Estos cuatro aparecen en casi todos los análisis de red. Vale la pena memorizarlos.',
      },
      {
        tipo: 'completar',
        pregunta: 'La web cifrada (HTTPS) usa el puerto ___.',
        respuestas: ['443'],
        explicacion: '443 para HTTPS, 80 para HTTP sin cifrar.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Si la IP es la dirección de un edificio, el puerto es…',
        opciones: ['El nombre del dueño', 'El número del departamento', 'La ciudad', 'El ascensor'],
        correcta: 1,
        explicacion: 'La IP te lleva al equipo; el puerto, al servicio exacto dentro de él.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Para qué hace un atacante un escaneo de puertos?',
        opciones: [
          'Para acelerar la red',
          'Para descubrir qué servicios están abiertos y atacarlos',
          'Para borrar los registros',
          'Para cambiar la IP del servidor',
        ],
        correcta: 1,
        explicacion: 'Saber qué está abierto es el primer paso de casi cualquier ataque. Los defensores escanean sus propios equipos por lo mismo.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué conviene hacer con los puertos que no usas?',
        opciones: ['Dejarlos abiertos por si acaso', 'Cerrarlos', 'Cambiarles el número', 'Duplicarlos'],
        correcta: 1,
        explicacion: 'Menos puertos abiertos = menos superficie de ataque.',
      },
    ],
    tarjetas: [
      { id: 'u2-puerto', frente: 'Puerto', reverso: 'Número que indica a qué servicio de un equipo va la conexión.' },
      { id: 'u2-puertos-comunes', frente: 'Puertos 80 · 443 · 22 · 53', reverso: 'HTTP · HTTPS · SSH · DNS.' },
      { id: 'u2-escaneo', frente: 'Escaneo de puertos', reverso: 'Descubrir qué servicios tiene abiertos un equipo (por ejemplo, con nmap).' },
    ],
  },
  {
    id: 'u2-l4',
    titulo: 'El modelo TCP/IP',
    conceptos: [
      {
        titulo: 'Capas',
        texto: 'Para que dos equipos se entiendan, la comunicación se organiza en capas. Cada una hace una tarea y se apoya en la de abajo. El modelo TCP/IP tiene cuatro: Aplicación, Transporte, Internet y Acceso a la red.',
      },
      {
        titulo: 'Qué hace cada capa',
        texto: 'Aplicación: los programas que usas (web, correo). Transporte: TCP o UDP, que entregan los datos al puerto correcto. Internet: IP, que lleva los paquetes de una red a otra. Acceso a la red: el cable, el wifi y la tarjeta de red.',
      },
      {
        titulo: 'TCP vs. UDP',
        texto: 'TCP confirma que cada dato llegue completo y en orden; lo usan la web y el correo. UDP es más rápido pero no confirma nada; lo usan las videollamadas y los juegos, donde un retraso molesta más que perder un trozo.',
      },
      {
        titulo: 'Y el modelo OSI',
        texto: 'También vas a escuchar del modelo OSI, que divide lo mismo en 7 capas. Se usa mucho para explicar y conversar; TCP/IP es el que funciona en internet.',
      },
    ],
    ejercicios: [
      {
        tipo: 'ordenar',
        pregunta: 'Ordena las capas de TCP/IP, de la más alta a la más baja',
        pasos: ['Aplicación', 'Transporte', 'Internet', 'Acceso a la red'],
        explicacion: 'Arriba lo que ves (la aplicación), abajo lo físico (cables y wifi).',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada ejemplo con su capa',
        pares: [
          ['HTTP', 'Aplicación'],
          ['TCP', 'Transporte'],
          ['IP', 'Internet'],
          ['Wifi', 'Acceso a la red'],
        ],
        explicacion: 'Cuando cargas una página, las cuatro capas trabajan al mismo tiempo.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Para una videollamada, donde importa más la rapidez que no perder nada, conviene usar…',
        opciones: ['TCP', 'UDP', 'HTTP', 'DNS'],
        correcta: 1,
        explicacion: 'UDP no espera confirmaciones, así que hay menos retraso.',
      },
      {
        tipo: 'opcion',
        pregunta: 'TCP confirma que los datos lleguen completos y en orden.',
        opciones: VF,
        correcta: 0,
        explicacion: 'Si un paquete se pierde, TCP lo vuelve a pedir. Eso lo hace confiable, pero más lento que UDP.',
      },
      {
        tipo: 'completar',
        pregunta: 'El modelo que divide la red en 7 capas se llama modelo ___.',
        respuestas: ['osi'],
        explicacion: 'OSI tiene 7 capas; TCP/IP agrupa las mismas tareas en 4.',
      },
    ],
    tarjetas: [
      { id: 'u2-capas', frente: 'Capas de TCP/IP', reverso: 'Aplicación · Transporte · Internet · Acceso a la red.' },
      { id: 'u2-tcp', frente: 'TCP', reverso: 'Confirma que los datos lleguen completos y en orden. Lo usan la web y el correo.' },
      { id: 'u2-udp', frente: 'UDP', reverso: 'Rápido, sin confirmaciones. Lo usan videollamadas y juegos.' },
      { id: 'u2-osi', frente: 'Modelo OSI', reverso: 'Modelo de 7 capas que se usa para explicar las redes.' },
    ],
  },
  {
    id: 'u2-l5',
    titulo: 'DNS: la guía telefónica de internet',
    conceptos: [
      {
        titulo: 'Nombres para personas, números para máquinas',
        texto: 'Los equipos se encuentran por IP, pero las personas recordamos nombres como google.com. El DNS (Sistema de Nombres de Dominio) traduce nombres de dominio a direcciones IP.',
      },
      {
        titulo: 'Cómo funciona',
        texto: 'Cuando escribes una dirección, tu equipo le pregunta a un servidor DNS: "¿cuál es la IP de este nombre?". Recibe la respuesta, la guarda un rato en caché y recién ahí se conecta.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'Si un atacante logra falsificar las respuestas DNS, puede mandarte a una página falsa aunque escribas bien la dirección. Esto se llama envenenamiento de DNS (DNS spoofing). HTTPS ayuda: el certificado del sitio falso no coincide y el navegador te avisa.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué hace el DNS?',
        opciones: ['Cifra tus contraseñas', 'Traduce nombres de dominio a direcciones IP', 'Acelera el wifi', 'Bloquea virus'],
        correcta: 1,
        explicacion: 'Sin DNS tendrías que memorizar la IP de cada sitio que visitas.',
      },
      {
        tipo: 'ordenar',
        pregunta: 'Ordena lo que pasa al escribir ejemplo.com en el navegador',
        pasos: [
          'Escribes ejemplo.com',
          'Tu equipo le pregunta al servidor DNS',
          'El DNS responde con la IP',
          'El navegador se conecta a esa IP',
        ],
        explicacion: 'Todo esto pasa en milisegundos, antes de que la página empiece a cargar.',
      },
      {
        tipo: 'completar',
        pregunta: 'El DNS usa normalmente el puerto ___.',
        respuestas: ['53'],
        explicacion: 'Lo viste en la lección de puertos: 53 es DNS.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué logra un atacante con envenenamiento de DNS?',
        opciones: [
          'Ver tu pantalla',
          'Enviarte a una página falsa aunque escribas bien la dirección',
          'Apagar tu router',
          'Aumentar tu velocidad de internet',
        ],
        correcta: 1,
        explicacion: 'Es peligroso justamente porque la dirección se ve correcta.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada concepto con lo que hace',
        pares: [
          ['DNS', 'Traduce nombres a IP'],
          ['Caché DNS', 'Guarda respuestas recientes'],
          ['DNS spoofing', 'Respuestas falsas que te desvían'],
          ['HTTPS', 'Verifica la identidad del sitio'],
        ],
        explicacion: 'Si el navegador avisa que el certificado no es válido, no sigas.',
      },
    ],
    tarjetas: [
      { id: 'u2-dns', frente: 'DNS', reverso: 'Traduce nombres de dominio (google.com) a direcciones IP.' },
      { id: 'u2-dns-cache', frente: 'Caché DNS', reverso: 'Respuestas DNS guardadas un tiempo para no volver a preguntar.' },
      { id: 'u2-dns-spoofing', frente: 'Envenenamiento de DNS', reverso: 'Respuestas DNS falsas que te llevan a un sitio impostor.' },
    ],
  },
  {
    id: 'u2-l6',
    titulo: 'Todo junto: un viaje por la red',
    conceptos: [
      {
        titulo: 'Un clic, muchos pasos',
        texto: 'Cuando abres https://ejemplo.com: el DNS traduce el nombre a una IP, tu equipo abre una conexión TCP al puerto 443 de esa IP, los paquetes salen por tu router hacia internet y el servidor responde por el mismo camino.',
      },
      {
        titulo: 'Dónde mira un analista',
        texto: 'Tres preguntas para cualquier conexión: ¿de dónde viene? (IP de origen), ¿qué servicio busca? (puerto de destino) y ¿cómo viaja? (protocolo, TCP o UDP). Con eso ya puedes leer buena parte de un registro de red.',
      },
    ],
    ejercicios: [
      {
        tipo: 'ordenar',
        pregunta: 'Ordena el viaje al abrir https://ejemplo.com',
        pasos: [
          'El DNS traduce ejemplo.com a una IP',
          'Tu equipo abre una conexión TCP al puerto 443',
          'Los paquetes salen por tu router hacia internet',
          'El servidor responde con la página',
        ],
        explicacion: 'Nombre → IP → puerto → viaje → respuesta. ¡Ya entiendes cómo funciona la web!',
      },
      {
        tipo: 'opcion',
        pregunta: 'En un registro ves conexiones desde una misma IP a los puertos 1, 2, 3… hasta el 1000, una tras otra. ¿Qué está pasando?',
        opciones: ['Una actualización', 'Un escaneo de puertos', 'Un respaldo', 'Un error del DNS'],
        correcta: 1,
        explicacion: 'Probar puerto por puerto es la firma típica de un escaneo.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Llega una conexión al puerto 22 de tu servidor. ¿Qué servicio intenta usar?',
        opciones: ['La web', 'SSH (acceso remoto)', 'DNS', 'El correo'],
        correcta: 1,
        explicacion: 'Puerto 22 = SSH. Fue el que atacaron en el reto del registro del laboratorio.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada dato con la pregunta que responde',
        pares: [
          ['IP de origen', '¿De dónde viene?'],
          ['Puerto de destino', '¿Qué servicio busca?'],
          ['Protocolo', '¿TCP o UDP?'],
        ],
        explicacion: '¡Terminaste Redes I! Con esto ya puedes leer tus primeros registros de red.',
      },
      {
        tipo: 'completar',
        pregunta: 'Hacia internet, tu router usa una sola IP ___ para todos tus equipos.',
        respuestas: ['publica'],
        explicacion: 'Gracias a NAT, todos tus equipos comparten una IP pública.',
      },
    ],
    tarjetas: [
      { id: 'u2-analista', frente: 'Las 3 preguntas de un analista de red', reverso: 'IP de origen · puerto de destino · protocolo.' },
      { id: 'u2-viaje', frente: 'Viaje al abrir una web', reverso: 'DNS → conexión TCP al puerto 443 → router → servidor responde.' },
    ],
  },
]
