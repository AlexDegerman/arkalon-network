import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn()
  }))
}))

vi.mock('@/lib/identity/cookie', () => ({
  getCoreIdCookie: vi.fn(),
  getSessionCookie: vi.fn()
}))

vi.mock('@/lib/identity/recoveryCode', () => ({
  verifySessionToken: vi.fn(),
  hashSessionToken: vi.fn(() => 'mock-token-hash')
}))

vi.mock('@/lib/identity/coreId', () => ({
  findIdentityById: vi.fn()
}))

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

import { validateOwnership } from '@/lib/identity/validateOwnership'
import { getCoreIdCookie, getSessionCookie } from '@/lib/identity/cookie'
import { verifySessionToken } from '@/lib/identity/recoveryCode'
import { findIdentityById } from '@/lib/identity/coreId'
import pool from '@/lib/db'

describe('validateOwnership', () => {
  const mockCoreId = '123e4567-e89b-12d3-a456-426614174000'
  const mockToken = 'mock-session-token'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns invalid when coreId cookie is missing', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(undefined)

    const result = await validateOwnership()

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toBe('no_cookie')
    }
  })

  it('returns invalid when session token cookie is missing', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(mockCoreId)
    vi.mocked(getSessionCookie).mockResolvedValue(undefined)

    const result = await validateOwnership()

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toBe('no_cookie')
    }
  })

  it('returns invalid when session token verification fails', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(mockCoreId)
    vi.mocked(getSessionCookie).mockResolvedValue(mockToken)
    vi.mocked(verifySessionToken).mockReturnValue(null)

    const result = await validateOwnership()

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toBe('invalid_token')
    }
    expect(verifySessionToken).toHaveBeenCalledWith(mockToken)
  })

  it('returns invalid when token coreId does not match cookie coreId', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(mockCoreId)
    vi.mocked(getSessionCookie).mockResolvedValue(mockToken)
    vi.mocked(verifySessionToken).mockReturnValue({ coreId: 'different-uuid' })

    const result = await validateOwnership()

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toBe('invalid_token')
    }
  })

  it('returns invalid when identity is not found in database', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(mockCoreId)
    vi.mocked(getSessionCookie).mockResolvedValue(mockToken)
    vi.mocked(verifySessionToken).mockReturnValue({ coreId: mockCoreId })
    vi.mocked(findIdentityById).mockResolvedValue(null)
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

    const result = await validateOwnership()

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toBe('not_found')
    }
  })

  it('returns valid ownership when all checks pass', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(mockCoreId)
    vi.mocked(getSessionCookie).mockResolvedValue(mockToken)
    vi.mocked(verifySessionToken).mockReturnValue({ coreId: mockCoreId })
    vi.mocked(findIdentityById).mockResolvedValue({ id: mockCoreId } as any)
    vi.mocked(pool.query).mockResolvedValue({
      rows: [
        { core_id: mockCoreId, expires_at: new Date(Date.now() + 86400000) }
      ]
    } as any)

    const result = await validateOwnership()

    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.coreId).toBe(mockCoreId)
    }
  })

  it('returns invalid when session is expired in database', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(mockCoreId)
    vi.mocked(getSessionCookie).mockResolvedValue(mockToken)
    vi.mocked(verifySessionToken).mockReturnValue({ coreId: mockCoreId })
    vi.mocked(findIdentityById).mockResolvedValue({ id: mockCoreId } as any)
    vi.mocked(pool.query).mockResolvedValue({
      rows: [
        { core_id: mockCoreId, expires_at: new Date(Date.now() - 86400000) }
      ]
    } as any)

    const result = await validateOwnership()

    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.reason).toBe('expired')
    }
  })
})
