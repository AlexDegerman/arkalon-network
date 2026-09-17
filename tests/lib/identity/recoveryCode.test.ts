import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import {
  generateRecoveryCode,
  hashRecoveryCode,
  signSessionToken,
  verifySessionToken,
  hashSessionToken
} from '@/lib/identity/recoveryCode'

vi.mock('server-only', () => ({}))

describe('recoveryCode', () => {
  const originalSecret = process.env.SESSION_SECRET

  beforeAll(() => {
    process.env.SESSION_SECRET = 'test-secret-key-123'
  })

  afterAll(() => {
    process.env.SESSION_SECRET = originalSecret
  })

  describe('generateRecoveryCode', () => {
    it('generates a code in WORD-WORD-DIGITS format', () => {
      vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
        const typedArray = arr as Uint32Array
        typedArray[0] = 10
        typedArray[1] = 20
        typedArray[2] = 1234
        return typedArray
      })

      const code = generateRecoveryCode()
      expect(code).toMatch(/^[A-Z]+-[A-Z]+-\d{4}$/)

      vi.restoreAllMocks()
    })
  })

  describe('hashRecoveryCode', () => {
    it('returns a 64-character hex string', () => {
      const hash = hashRecoveryCode('swift-falcon-4821')
      expect(hash).toHaveLength(64)
      expect(hash).toMatch(/^[a-f0-9]+$/)
    })

    it('is case-insensitive and trims whitespace', () => {
      const hash1 = hashRecoveryCode(' SWIFT-FALCON-4821 ')
      const hash2 = hashRecoveryCode('swift-falcon-4821')
      expect(hash1).toBe(hash2)
    })
  })

  describe('signSessionToken and verifySessionToken', () => {
    const mockCoreId = '123e4567-e89b-12d3-a456-426614174000'

    it('signs a token that can be verified to extract the coreId', () => {
      const token = signSessionToken(mockCoreId)
      expect(token).toContain('.')

      const result = verifySessionToken(token)
      expect(result).toEqual({ coreId: mockCoreId })
    })

    it('returns null for a tampered signature', () => {
      const token = signSessionToken(mockCoreId)
      const tamperedToken = token + 'tampered'

      const result = verifySessionToken(tamperedToken)
      expect(result).toBeNull()
    })

    it('returns null when SESSION_SECRET is missing', () => {
      process.env.SESSION_SECRET = ''
      const result = verifySessionToken('dummy.token')
      expect(result).toBeNull()
      process.env.SESSION_SECRET = 'test-secret-key-123'
    })
  })

  describe('hashSessionToken', () => {
    it('returns a 64-character hex string', () => {
      const hash = hashSessionToken('some-token')
      expect(hash).toHaveLength(64)
      expect(hash).toMatch(/^[a-f0-9]+$/)
    })

    it('produces different hashes for different tokens', () => {
      const hash1 = hashSessionToken('token-a')
      const hash2 = hashSessionToken('token-b')
      expect(hash1).not.toBe(hash2)
    })
  })
})
