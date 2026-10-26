// La ruta completa de 0 a 100. Las lecciones se agregan en la Fase 1.
export type Unidad = { titulo: string; temas: string }
export type Nivel = { numero: number; titulo: string; emoji: string; unidades: Unidad[] }

export const ruta: Nivel[] = [
  {
    numero: 1,
    titulo: 'Fundamentos',
    emoji: '🧱',
    unidades: [
      { titulo: 'Cómo funciona un computador', temas: 'CPU, memoria, sistema operativo, procesos' },
      { titulo: 'Redes I', temas: 'IP, puertos, modelo TCP/IP, DNS' },
      { titulo: 'Redes II', temas: 'HTTP/HTTPS, handshake TCP, qué pasa al abrir una web' },
      { titulo: 'Linux I', temas: 'Terminal, carpetas, archivos y permisos' },
      { titulo: 'Linux II', temas: 'Usuarios, procesos, grep y find' },
      { titulo: 'Primeros conceptos de seguridad', temas: 'Tríada CIA, amenazas, contraseñas' },
    ],
  },
  { numero: 2, titulo: 'Redes y sistemas a fondo', emoji: '🌐', unidades: [] },
  { numero: 3, titulo: 'Scripting: Bash y Python', emoji: '🐍', unidades: [] },
  { numero: 4, titulo: 'Seguridad: blue team y red team', emoji: '🛡️', unidades: [] },
  { numero: 5, titulo: 'Seguridad web (OWASP)', emoji: '🕸️', unidades: [] },
  { numero: 6, titulo: 'Especialización y certificaciones', emoji: '🏆', unidades: [] },
]
