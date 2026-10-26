// GET /api/recordatorio: lo llama el cron de Vercel una vez al día (ver vercel.json).
// Avisa a quien todavía no estudia hoy. Es seguro que otro lo llame: cada usuario recibe a lo más un aviso por día.
import { list } from '@vercel/blob'
import webpush from 'web-push'
import type { Progreso } from '../src/progreso.js'
import { actualizar, clavesVapid, hoyEnChile, json, leer, manejar } from './_lib/servidor.js'
import type { Suscripciones } from './suscripcion.js'

export const GET = manejar(async () => {
  const hoy = hoyEnChile()
  const { publica, privada } = clavesVapid()
  const vapid = { subject: 'https://cyberruta.vercel.app', publicKey: publica, privateKey: privada }
  const { blobs } = await list({ prefix: 'suscripciones/' })
  let enviados = 0

  for (const b of blobs) {
    const s = await leer<Suscripciones>(b.pathname)
    if (!s || s.datos.ultimoAviso === hoy || !s.datos.lista.length) continue
    const progreso = await leer<Progreso>(`progreso/${s.datos.usuario}.json`)
    if ((progreso?.datos.xpPorDia?.[hoy] ?? 0) > 0) continue // ya estudió hoy

    const aviso = JSON.stringify({ titulo: '🔥 ¡No pierdas tu racha!', cuerpo: 'Unos minutos de CyberRuta hoy y sigues avanzando.' })
    const vencidas = new Set<string>()
    for (const sub of s.datos.lista) {
      try {
        await webpush.sendNotification(sub, aviso, { vapidDetails: vapid, TTL: 6 * 3600 })
        enviados++
      } catch (e) {
        const codigo = (e as { statusCode?: number }).statusCode
        if (codigo === 404 || codigo === 410) vencidas.add(sub.endpoint) // el equipo canceló la suscripción
        else console.error('push falló', codigo)
      }
    }
    await actualizar<Suscripciones>(b.pathname, s.datos, (x) => ({
      ...x, lista: x.lista.filter((sub) => !vencidas.has(sub.endpoint)), ultimoAviso: hoy,
    }))
  }
  return json(200, { hoy, enviados })
})
