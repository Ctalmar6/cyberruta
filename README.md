# CyberRuta

App personal para aprender ciberseguridad desde cero, un poco cada día: lecciones cortas, ejercicios y tarjetas de repaso con repetición espaciada (FSRS).

**Usar:** https://cyberruta.vercel.app (copia en https://ctalmar6.github.io/cyberruta/) — en el iPhone, ábrela en Safari → Compartir → "Agregar a pantalla de inicio".

## Desarrollo

```bash
npm install
npm run dev     # servidor local
npm test        # pruebas de la lógica y del contenido
npm run build   # compilación de producción
```

Cada push a `main` corre las pruebas y publica en GitHub Pages y en Vercel (si el repo está importado allí).

- Contenido de las lecciones: `src/contenido.ts`
- XP, racha y repasos: `src/progreso.ts`
