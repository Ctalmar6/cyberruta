import assert from 'node:assert/strict'
import { test } from 'node:test'

process.env.BLOB_READ_WRITE_TOKEN = 'token-de-prueba'
const s = await import('./servidor.ts')

test('contraseñas: hash con sal y verificación', async () => {
  const clave = await s.hashContrasena('una clave larga')
  assert.notEqual(clave.hash, 'una clave larga')
  assert.notEqual((await s.hashContrasena('una clave larga')).sal, clave.sal) // sal distinta cada vez
  assert.equal(await s.verificarContrasena('una clave larga', clave), true)
  assert.equal(await s.verificarContrasena('una clave larg', clave), false)
})

test('credenciales', () => {
  assert.equal(s.errorCredenciales('cristobal', '12345678'), null)
  assert.ok(s.errorCredenciales('Cristobal', '12345678')) // mayúsculas: el cliente las pasa a minúsculas
  assert.ok(s.errorCredenciales('ab', '12345678'))
  assert.ok(s.errorCredenciales('../root', '12345678')) // sin rutas raras en el almacenamiento
  assert.ok(s.errorCredenciales('cristobal', 'corta'))
  assert.ok(s.errorCredenciales(undefined, undefined))
})

test('tokens de sesión: válidos, vencidos y adulterados', () => {
  const ahora = Date.UTC(2026, 9, 26)
  const t = s.crearToken('cristobal', ahora)
  assert.equal(s.verificarToken(t, ahora), 'cristobal')
  assert.equal(s.verificarToken(t, ahora + 181 * 864e5), null)
  const [datos, firma] = t.split('.')
  const falso = Buffer.from(JSON.stringify({ u: 'otro', exp: ahora + 1e10 })).toString('base64url')
  assert.equal(s.verificarToken(`${falso}.${firma}`, ahora), null)
  assert.equal(s.verificarToken(`${datos}.x${firma.slice(1)}`, ahora), null)
  assert.equal(s.verificarToken('basura', ahora), null)
})

test('suscripciones push: solo servicios conocidos y https', () => {
  const keys = { p256dh: 'BPk', auth: 'aa' }
  assert.ok(s.validarSuscripcion({ endpoint: 'https://web.push.apple.com/abc', keys }))
  assert.ok(s.validarSuscripcion({ endpoint: 'https://fcm.googleapis.com/fcm/send/x', keys }))
  assert.equal(s.validarSuscripcion({ endpoint: 'https://atacante.example/x', keys }), null)
  assert.equal(s.validarSuscripcion({ endpoint: 'http://web.push.apple.com/abc', keys }), null)
  assert.equal(s.validarSuscripcion({ endpoint: 'https://push.apple.com.atacante.example/x', keys }), null)
  assert.equal(s.validarSuscripcion({ endpoint: 'https://web.push.apple.com/abc' }), null)
})

test('claves VAPID estables y fecha de Chile', () => {
  const a = s.clavesVapid()
  assert.deepEqual(s.clavesVapid(), a)
  assert.equal(Buffer.from(a.publica, 'base64url').length, 65)
  assert.equal(s.hoyEnChile(new Date('2026-10-27T02:00:00Z')), '2026-10-26') // 23:00 en Chile
})
