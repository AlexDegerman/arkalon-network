import 'server-only'
import { createHash, createHmac } from 'crypto'
import { WORD_BANK } from './wordbank'

// Generates WORD-WORD-DIGITS format, e.g. SWIFT-CRYSTAL-8214
export function generateRecoveryCode(): string {
  const buf = new Uint32Array(3)
  crypto.getRandomValues(buf)

  const word1 = WORD_BANK[buf[0] % 256]
  const word2 = WORD_BANK[buf[1] % 256]
  const digits = String(buf[2] % 10_000).padStart(4, '0')

  return `${word1}-${word2}-${digits}`
}

// Hashes recovery codes before storage; plaintext codes are never persisted
export function hashRecoveryCode(code: string): string {
  return createHash('sha256').update(code.toUpperCase().trim()).digest('hex')
}

// Creates a signed session token using the server secret
export function signSessionToken(coreId: string): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')
  const payload = `${coreId}:${Date.now()}`
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return `${Buffer.from(payload).toString('base64url')}.${sig}`
}

export function verifySessionToken(token: string): { coreId: string } | null {
  const secret = process.env.SESSION_SECRET
  if (!secret) return null

  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return null

  const payloadB64 = token.slice(0, dotIndex)
  const sig = token.slice(dotIndex + 1)

  const expectedSig = createHmac('sha256', secret)
    .update(Buffer.from(payloadB64, 'base64url').toString())
    .digest('hex')

  // Constant-time comparison
  if (sig.length !== expectedSig.length) return null
  let diff = 0
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i)
  }
  if (diff !== 0) return null

  const payload = Buffer.from(payloadB64, 'base64url').toString()
  const [coreId] = payload.split(':')
  if (!coreId) return null

  return { coreId }
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
