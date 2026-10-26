// Se carga dentro del service worker (ver workbox.importScripts en vite.config.ts).
self.addEventListener('push', (evento) => {
  let datos = {}
  try {
    datos = evento.data ? evento.data.json() : {}
  } catch {
    // Aviso sin JSON: se muestra el texto por defecto.
  }
  evento.waitUntil(
    self.registration.showNotification(datos.titulo || 'CyberRuta', {
      body: datos.cuerpo || 'Es hora de estudiar un poco.',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'recordatorio-diario',
    }),
  )
})

self.addEventListener('notificationclick', (evento) => {
  evento.notification.close()
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
      const abierta = ventanas.find((v) => 'focus' in v)
      return abierta ? abierta.focus() : self.clients.openWindow(self.registration.scope)
    }),
  )
})
