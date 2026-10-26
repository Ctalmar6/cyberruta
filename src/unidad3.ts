import type { Leccion } from './contenido'

const VF = ['Verdadero', 'Falso']

export const unidad3: Leccion[] = [
  {
    id: 'u3-l1',
    titulo: 'El handshake TCP',
    conceptos: [
      {
        titulo: 'Antes de hablar, un saludo',
        texto: 'TCP no envía datos de inmediato: primero los dos equipos acuerdan la conexión con un saludo de 3 pasos, el "handshake".',
      },
      {
        titulo: 'SYN, SYN-ACK, ACK',
        texto: '1) El cliente envía SYN ("¿hablamos?"). 2) El servidor responde SYN-ACK ("sí, ¿me escuchas?"). 3) El cliente confirma con ACK ("te escucho"). Recién entonces viajan los datos. Para cerrar, cada lado envía FIN.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'En un ataque SYN flood, el atacante envía miles de SYN y nunca completa el saludo. El servidor queda esperando con conexiones a medio abrir hasta que no puede atender a nadie más: es una forma de denegación de servicio (DoS).',
      },
    ],
    ejercicios: [
      {
        tipo: 'ordenar',
        pregunta: 'Ordena los pasos del handshake TCP',
        pasos: ['El cliente envía SYN', 'El servidor responde SYN-ACK', 'El cliente confirma con ACK', 'Empiezan a viajar los datos'],
        explicacion: 'SYN → SYN-ACK → ACK. Si lo recuerdas como "¿hablamos? / sí / perfecto", no se te olvida.',
      },
      {
        tipo: 'completar',
        pregunta: 'El primer mensaje del handshake TCP se llama ___.',
        respuestas: ['syn'],
        explicacion: 'SYN viene de "synchronize": el cliente propone sincronizar la conexión.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué hace un ataque SYN flood?',
        opciones: [
          'Roba contraseñas del servidor',
          'Envía muchos SYN sin terminar el saludo y satura al servidor',
          'Cambia las respuestas del DNS',
          'Cifra los archivos del servidor',
        ],
        correcta: 1,
        explicacion: 'Busca agotar los recursos del servidor, no robar datos: es denegación de servicio.',
      },
      {
        tipo: 'opcion',
        pregunta: 'UDP también hace un handshake de 3 pasos antes de enviar datos.',
        opciones: VF,
        correcta: 1,
        explicacion: 'UDP envía directo, sin saludo ni confirmaciones. Por eso es más rápido que TCP.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada mensaje con lo que significa',
        pares: [
          ['SYN', '¿Hablamos?'],
          ['SYN-ACK', 'Sí, ¿me escuchas?'],
          ['ACK', 'Te escucho'],
          ['FIN', 'Terminé'],
        ],
        explicacion: 'Vas a ver estos nombres en herramientas como Wireshark cuando analices tráfico.',
      },
    ],
    tarjetas: [
      { id: 'u3-handshake', frente: 'Handshake TCP', reverso: 'SYN → SYN-ACK → ACK. Después viajan los datos.' },
      { id: 'u3-fin', frente: 'FIN', reverso: 'Mensaje TCP para cerrar la conexión.' },
      { id: 'u3-syn-flood', frente: 'SYN flood', reverso: 'Miles de SYN sin completar el saludo para saturar al servidor (DoS).' },
    ],
  },
  {
    id: 'u3-l2',
    titulo: 'HTTP: peticiones y respuestas',
    conceptos: [
      {
        titulo: 'El idioma de la web',
        texto: 'HTTP es el protocolo con que el navegador y el servidor web conversan. Siempre funciona igual: el navegador hace una petición y el servidor devuelve una respuesta.',
      },
      {
        titulo: 'Métodos',
        texto: 'Cada petición dice qué quiere hacer. GET pide algo (una página, una imagen). POST envía datos (un formulario, un login). También existen PUT para actualizar y DELETE para borrar.',
      },
      {
        titulo: 'Las partes de una URL',
        texto: 'En https://tienda.cl:443/productos?id=5 hay un protocolo (https), un dominio (tienda.cl), un puerto (443), una ruta (/productos) y parámetros (?id=5). Las cabeceras viajan aparte y llevan datos como el navegador que usas o tus cookies.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'Nunca pongas contraseñas ni datos sensibles en la URL: quedan guardadas en el historial, en los registros del servidor y en los enlaces que compartes. Por eso los formularios de login usan POST.',
      },
    ],
    ejercicios: [
      {
        tipo: 'emparejar',
        pregunta: 'Une cada método con lo que hace',
        pares: [
          ['GET', 'Pide un recurso'],
          ['POST', 'Envía datos'],
          ['PUT', 'Actualiza algo'],
          ['DELETE', 'Borra algo'],
        ],
        explicacion: 'GET y POST son, por lejos, los que más vas a ver.',
      },
      {
        tipo: 'opcion',
        pregunta: 'En https://tienda.cl/productos?id=5, ¿qué es "?id=5"?',
        opciones: ['El dominio', 'El puerto', 'Un parámetro', 'El protocolo'],
        correcta: 2,
        explicacion: 'Los parámetros van después del "?". Los atacantes suelen manipularlos para probar si la web es vulnerable.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué método usa normalmente un formulario de login?',
        opciones: ['GET', 'POST', 'DELETE', 'Ninguno'],
        correcta: 1,
        explicacion: 'POST envía los datos en el cuerpo de la petición y no en la URL.',
      },
      {
        tipo: 'completar',
        pregunta: 'El navegador envía una ___ y el servidor devuelve una respuesta.',
        respuestas: ['peticion', 'solicitud', 'request'],
        explicacion: 'Petición y respuesta: todo HTTP se resume en ese par.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Por qué no se deben poner contraseñas en la URL?',
        opciones: [
          'Porque la URL se vuelve muy larga',
          'Porque queda guardada en el historial y en los registros',
          'Porque HTTP no acepta números',
          'Porque el DNS la bloquea',
        ],
        correcta: 1,
        explicacion: 'Las URL se guardan y se comparten en muchos lugares. Lo sensible va en el cuerpo de un POST, y por HTTPS.',
      },
    ],
    tarjetas: [
      { id: 'u3-http', frente: 'HTTP', reverso: 'Protocolo de la web: el navegador pide y el servidor responde.' },
      { id: 'u3-get-post', frente: 'GET vs. POST', reverso: 'GET pide un recurso. POST envía datos (formularios, login).' },
      { id: 'u3-url', frente: 'Partes de una URL', reverso: 'Protocolo · dominio · puerto · ruta · parámetros (?id=5).' },
    ],
  },
  {
    id: 'u3-l3',
    titulo: 'Códigos de estado',
    conceptos: [
      {
        titulo: 'Cada respuesta trae un número',
        texto: 'El servidor siempre dice cómo le fue con un código de tres dígitos. El primer dígito ya te cuenta mucho: 2xx salió bien, 3xx redirección, 4xx error del cliente, 5xx error del servidor.',
      },
      {
        titulo: 'Los más comunes',
        texto: '200: OK. 301: la página se movió a otra dirección. 401: tienes que iniciar sesión. 403: prohibido, aunque hayas iniciado sesión. 404: no existe. 500: el servidor falló.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'Los analistas buscan patrones en los registros: cientos de 401 seguidos desde una IP sugieren fuerza bruta, y muchos 404 en rutas raras (/admin, /.env, /backup) suelen ser un escáner buscando archivos expuestos.',
      },
    ],
    ejercicios: [
      {
        tipo: 'emparejar',
        pregunta: 'Une cada código con su significado',
        pares: [
          ['200', 'OK'],
          ['301', 'Se movió'],
          ['404', 'No existe'],
          ['500', 'El servidor falló'],
        ],
        explicacion: '¿Has visto el famoso "Error 404"? Ahora sabes qué significa.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué indica un código que empieza con 5 (5xx)?',
        opciones: ['Que todo salió bien', 'Que el error es del servidor', 'Que la página se movió', 'Que escribiste mal la URL'],
        correcta: 1,
        explicacion: '4xx = el problema está en la petición; 5xx = el problema está en el servidor.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Cuál es la diferencia entre 401 y 403?',
        opciones: [
          'Son lo mismo',
          '401: falta iniciar sesión · 403: aunque la inicies, no tienes permiso',
          '401: no existe · 403: se movió',
          '401: error del servidor · 403: error del cliente',
        ],
        correcta: 1,
        explicacion: '401 pregunta "¿quién eres?"; 403 dice "sé quién eres, y no puedes".',
      },
      {
        tipo: 'completar',
        pregunta: 'Cuando una página no existe, el servidor responde con el código ___.',
        respuestas: ['404'],
        explicacion: '404 Not Found.',
      },
      {
        tipo: 'opcion',
        pregunta: 'En un registro ves cientos de 404 desde una IP pidiendo /admin, /.env y /backup.zip. ¿Qué es lo más probable?',
        opciones: ['Un usuario perdido', 'Un escáner buscando archivos expuestos', 'Una actualización del servidor', 'Un error del DNS'],
        correcta: 1,
        explicacion: 'Pedir rutas típicas de configuración y respaldos es la firma de un escaneo automatizado.',
      },
    ],
    tarjetas: [
      { id: 'u3-familias', frente: 'Códigos 2xx · 3xx · 4xx · 5xx', reverso: 'Éxito · redirección · error del cliente · error del servidor.' },
      { id: 'u3-401-403', frente: '401 vs. 403', reverso: '401: falta iniciar sesión. 403: no tienes permiso aunque la inicies.' },
      { id: 'u3-404', frente: 'Muchos 404 en rutas como /admin o /.env', reverso: 'Señal de un escáner buscando archivos expuestos.' },
    ],
  },
  {
    id: 'u3-l4',
    titulo: 'Cookies y sesiones',
    conceptos: [
      {
        titulo: 'HTTP no tiene memoria',
        texto: 'Para HTTP, cada petición es independiente: el servidor no recuerda la anterior. Entonces, ¿cómo sabe que ya iniciaste sesión? Con cookies.',
      },
      {
        titulo: 'Las cookies',
        texto: 'Una cookie es un dato pequeño que el servidor le pide guardar al navegador. Después, el navegador la envía en cada petición. Al iniciar sesión recibes una cookie de sesión: tu "pase" mientras navegas.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'Quien roba tu cookie de sesión puede entrar como tú sin saber tu contraseña: eso es secuestro de sesión. Para dificultarlo existen dos opciones: HttpOnly (JavaScript no puede leerla) y Secure (solo viaja por HTTPS).',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Por qué la web necesita cookies para mantener tu sesión?',
        opciones: [
          'Porque HTTP no recuerda las peticiones anteriores',
          'Porque el DNS las exige',
          'Porque aceleran la conexión',
          'Porque cifran la página',
        ],
        correcta: 0,
        explicacion: 'HTTP no guarda estado; la cookie le recuerda al servidor quién eres en cada petición.',
      },
      {
        tipo: 'completar',
        pregunta: 'Robar la cookie de sesión para entrar como otra persona se llama secuestro de ___.',
        respuestas: ['sesion'],
        explicacion: 'En inglés, session hijacking.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada opción de cookie con lo que hace',
        pares: [
          ['HttpOnly', 'JavaScript no puede leerla'],
          ['Secure', 'Solo viaja por HTTPS'],
          ['Cookie de sesión', 'Tu pase mientras navegas'],
        ],
        explicacion: 'Una cookie de sesión bien configurada lleva HttpOnly y Secure.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Si alguien roba tu cookie de sesión, ¿necesita tu contraseña para entrar a tu cuenta?',
        opciones: ['Sí, siempre', 'No, la cookie basta mientras la sesión siga activa', 'Solo si usa otro navegador', 'Solo en HTTP'],
        correcta: 1,
        explicacion: 'Por eso cerrar sesión al terminar, sobre todo en equipos compartidos, invalida esa cookie.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Cerrar sesión en un computador compartido es una buena práctica.',
        opciones: VF,
        correcta: 0,
        explicacion: 'Al cerrar sesión, el servidor invalida tu cookie y nadie puede reutilizarla.',
      },
    ],
    tarjetas: [
      { id: 'u3-cookie', frente: 'Cookie', reverso: 'Dato que el navegador guarda y envía en cada petición. Mantiene tu sesión.' },
      { id: 'u3-secuestro', frente: 'Secuestro de sesión', reverso: 'Usar la cookie robada de otra persona para entrar como ella.' },
      { id: 'u3-httponly-secure', frente: 'HttpOnly · Secure', reverso: 'JavaScript no puede leerla · solo viaja por HTTPS.' },
    ],
  },
  {
    id: 'u3-l5',
    titulo: 'HTTPS y certificados',
    conceptos: [
      {
        titulo: 'HTTP + cifrado',
        texto: 'HTTPS es HTTP dentro de un túnel cifrado con TLS. Si alguien intercepta el tráfico (por ejemplo, en un wifi público), solo ve datos ilegibles. Usa el puerto 443.',
      },
      {
        titulo: 'Certificados',
        texto: 'Para saber que hablas con el sitio real, el servidor muestra un certificado firmado por una autoridad de certificación en la que confía tu navegador. Si no calza, el navegador te muestra una advertencia.',
      },
      {
        titulo: 'Lo que HTTPS no promete',
        texto: 'El candado significa que la conexión va cifrada con ese dominio, no que el sitio sea honesto. Una página de phishing en banco-seguro-login.com también puede tener candado. Revisa siempre el dominio.',
      },
      {
        titulo: 'Dato de seguridad',
        texto: 'En un ataque de intermediario (man-in-the-middle), alguien se pone entre tú y el sitio para leer o cambiar el tráfico. HTTPS lo frena, salvo que ignores la advertencia del certificado. Nunca la ignores.',
      },
    ],
    ejercicios: [
      {
        tipo: 'opcion',
        pregunta: '¿Qué agrega HTTPS a HTTP?',
        opciones: ['Más velocidad', 'Cifrado y verificación del sitio', 'Más puertos', 'Cookies'],
        correcta: 1,
        explicacion: 'TLS cifra el tráfico, y el certificado permite comprobar con quién hablas.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Si una página tiene candado, es segura y legítima.',
        opciones: VF,
        correcta: 1,
        explicacion: 'El candado solo garantiza que la conexión va cifrada. Los sitios de phishing también pueden tenerlo.',
      },
      {
        tipo: 'completar',
        pregunta: 'El protocolo que cifra HTTPS se llama ___.',
        respuestas: ['tls'],
        explicacion: 'TLS (antes llamado SSL). Por eso a veces escucharás "certificado SSL".',
      },
      {
        tipo: 'opcion',
        pregunta: 'El navegador muestra una advertencia de certificado inválido en el sitio de tu banco. ¿Qué haces?',
        opciones: ['Continúo igual', 'No sigo y reviso la conexión o la dirección', 'Desactivo el antivirus', 'Recargo hasta que funcione'],
        correcta: 1,
        explicacion: 'Esa advertencia puede ser justo un ataque de intermediario en curso.',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada concepto con lo que es',
        pares: [
          ['TLS', 'Cifra la conexión'],
          ['Certificado', 'Prueba la identidad del sitio'],
          ['Man-in-the-middle', 'Alguien intercepta el tráfico'],
          ['Phishing', 'Sitio falso que imita a uno real'],
        ],
        explicacion: 'HTTPS frena al intermediario; contra el phishing, lo que te protege es mirar bien el dominio.',
      },
    ],
    tarjetas: [
      { id: 'u3-https', frente: 'HTTPS', reverso: 'HTTP cifrado con TLS (puerto 443). Verifica el sitio con un certificado.' },
      { id: 'u3-candado', frente: '¿Qué garantiza el candado?', reverso: 'Que la conexión va cifrada con ese dominio. No que el sitio sea honesto.' },
      { id: 'u3-mitm', frente: 'Man-in-the-middle', reverso: 'Alguien se pone entre tú y el sitio para leer o cambiar el tráfico.' },
    ],
  },
  {
    id: 'u3-l6',
    titulo: 'Todo junto: qué pasa al abrir una web',
    conceptos: [
      {
        titulo: 'Del Enter a la página',
        texto: 'Escribes https://ejemplo.com y presionas Enter. 1) El DNS traduce el nombre a una IP. 2) Handshake TCP con el puerto 443. 3) Handshake TLS: el servidor muestra su certificado y acuerdan las claves. 4) El navegador envía GET /. 5) El servidor responde 200 con el HTML.',
      },
      {
        titulo: 'Y luego, muchas peticiones más',
        texto: 'El HTML menciona imágenes, estilos y scripts, así que el navegador hace decenas de peticiones más para armar la página. Abre las herramientas del navegador (pestaña Red) y míralo en vivo.',
      },
      {
        titulo: 'Cada paso, un punto de ataque',
        texto: 'DNS falso, SYN flood, certificado falso, cookies robadas, rutas expuestas: ya conoces dónde puede atacar alguien en cada paso. Eso es pensar como un profesional de la seguridad.',
      },
    ],
    ejercicios: [
      {
        tipo: 'ordenar',
        pregunta: 'Ordena lo que pasa al abrir https://ejemplo.com',
        pasos: [
          'El DNS traduce el nombre a una IP',
          'Handshake TCP con el puerto 443',
          'Handshake TLS y verificación del certificado',
          'El navegador envía GET /',
          'El servidor responde 200 con la página',
        ],
        explicacion: 'Nombre → conexión → cifrado → petición → respuesta. ¡Ya entiendes cómo funciona la web por dentro!',
      },
      {
        tipo: 'emparejar',
        pregunta: 'Une cada paso con un ataque posible',
        pares: [
          ['DNS', 'Envenenamiento de DNS'],
          ['Handshake TCP', 'SYN flood'],
          ['TLS', 'Certificado falso'],
          ['Cookies', 'Secuestro de sesión'],
        ],
        explicacion: 'Conocer el camino es conocer los puntos débiles.',
      },
      {
        tipo: 'opcion',
        pregunta: '¿Qué pasa primero: el handshake TCP o el handshake TLS?',
        opciones: ['El handshake TLS', 'El handshake TCP', 'Ocurren al mismo tiempo', 'Ninguno, HTTPS no los usa'],
        correcta: 1,
        explicacion: 'TLS viaja sobre TCP, así que primero se abre la conexión TCP y después se negocia el cifrado.',
      },
      {
        tipo: 'opcion',
        pregunta: 'Al abrir una página, el navegador hace una sola petición HTTP.',
        opciones: VF,
        correcta: 1,
        explicacion: 'Hace una por cada imagen, estilo y script. Una página típica hace decenas.',
      },
      {
        tipo: 'completar',
        pregunta: 'Si todo sale bien, el servidor responde con el código ___.',
        respuestas: ['200'],
        explicacion: '200 OK. ¡Terminaste Redes II!',
      },
    ],
    tarjetas: [
      { id: 'u3-viaje-completo', frente: 'Al abrir una web HTTPS', reverso: 'DNS → handshake TCP → handshake TLS → GET → 200 con el HTML.' },
      { id: 'u3-tls-sobre-tcp', frente: '¿TCP o TLS primero?', reverso: 'TCP primero: TLS viaja sobre una conexión TCP ya abierta.' },
    ],
  },
]
