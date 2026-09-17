import { describe, it, expect, vi, beforeEach } from 'vitest'
import { restoreCoreIdentityAction } from '@/app/actions/restoreCoreIdentity'

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: vi.fn((name: string) => {
      if (name === 'x-forwarded-for') return '192.168.1.100'
      return null
    })
  }))
}))

vi.mock('@/lib/identity/cookie', () => ({
  setCoreIdCookie: vi.fn(),
  setSessionCookie: vi.fn()
}))

vi.mock('@/lib/identity/coreId', () => ({
  findIdentityByRecoveryCode: vi.fn()
}))

vi.mock('@/lib/identity/recoveryCode', () => ({
  signSessionToken: vi.fn(() => 'mock-session-token'),
  hashSessionToken: vi.fn(() => 'mock-token-hash')
}))

vi.mock('@/lib/identity/rateLimit', () => ({
  checkRateLimit: vi.fn()
}))

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

import { setCoreIdCookie, setSessionCookie } from '@/lib/identity/cookie'
import { findIdentityByRecoveryCode } from '@/lib/identity/coreId'
import { checkRateLimit } from '@/lib/identity/rateLimit'
import pool from '@/lib/db'

describe('restoreCoreIdentityAction', () => {
  const mockValidCode = 'swift-falcon-4821'
  const mockCoreId = '123e4567-e89b-12d3-a456-426614174000'
  const mockIdentity = {
    id: mockCoreId,
    short_id: 'Short123',
    nickname: 'SwiftFalcon',
    recovery_code: mockValidCode,
    created_at: new Date(),
    last_seen_at: new Date()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimit).mockReturnValue(true)
  })

  it('returns rate_limited when IP exceeds recovery entry limit', async () => {
    vi.mocked(checkRateLimit).mockReturnValue(false)

    const result = await restoreCoreIdentityAction(mockValidCode)

    expect(result.status).toBe('rate_limited')
    expect(findIdentityByRecoveryCode).not.toHaveBeenCalled()
  })

  it('returns not_found for invalid code format', async () => {
    const invalidCode = 'bad-format-no-digits'

    const result = await restoreCoreIdentityAction(invalidCode)

    expect(result.status).toBe('not_found')
    expect(findIdentityByRecoveryCode).not.toHaveBeenCalled()
  })

  it('returns not_found when identity does not exist to prevent enumeration', async () => {
    vi.mocked(findIdentityByRecoveryCode).mockResolvedValue(null)

    const result = await restoreCoreIdentityAction(mockValidCode)

    expect(result.status).toBe('not_found')
    expect(pool.query).not.toHaveBeenCalled()
  })

  it('returns restored and sets cookies when valid code matches identity', async () => {
    vi.mocked(findIdentityByRecoveryCode).mockResolvedValue(mockIdentity)
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

    const result = await restoreCoreIdentityAction(mockValidCode)

    expect(result.status).toBe('restored')
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO validated_sessions'),
      [mockCoreId, 'mock-token-hash', expect.any(Date)]
    )
    expect(setCoreIdCookie).toHaveBeenCalledWith(mockCoreId)
    expect(setSessionCookie).toHaveBeenCalledWith('mock-session-token')
  })

  it('returns error when database insertion fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    vi.mocked(findIdentityByRecoveryCode).mockResolvedValue(mockIdentity)
    vi.mocked(pool.query).mockRejectedValue(
      new Error('DB constraint violation')
    )

    const result = await restoreCoreIdentityAction(mockValidCode)

    expect(result.status).toBe('error')
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[restoreCoreIdentityAction]',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })
})
