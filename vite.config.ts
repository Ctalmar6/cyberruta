import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Vercel (define VERCEL=1 al compilar) sirve en la raíz; GitHub Pages en /cyberruta/.
  base: process.env.VERCEL ? '/' : '/cyberruta/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        importScripts: ['push-sw.js'], // notificaciones del recordatorio diario
        navigateFallbackDenylist: [/^\/api\//], // la API nunca sale del caché
      },
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'CyberRuta',
        short_name: 'CyberRuta',
        description: 'Aprende ciberseguridad desde cero, un poco cada día.',
        lang: 'es',
        theme_color: '#0b0f14',
        background_color: '#0b0f14',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
