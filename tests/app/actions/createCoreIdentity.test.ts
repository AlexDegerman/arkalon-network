import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCoreIdentityAction } from '@/app/actions/createCoreIdentity'

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn()
  })),
  headers: vi.fn(() => ({
    get: vi.fn((name: string) => {
      if (name === 'x-forwarded-for') return '127.0.0.1'
      return null
    })
  }))
}))

vi.mock('@/lib/identity/cookie', () => ({
  getCoreIdCookie: vi.fn(),
  setCoreIdCookie: vi.fn(),
  setSessionCookie: vi.fn()
}))

vi.mock('@/lib/identity/coreId', () => ({
  createCoreIdentity: vi.fn(),
  findIdentityById: vi.fn(),
  updateLastSeen: vi.fn()
}))

vi.mock('@/lib/identity/recoveryCode', () => ({
  generateRecoveryCode: vi.fn(() => 'TEST-CODE-1234'),
  signSessionToken: vi.fn(() => 'signed-token'),
  hashSessionToken: vi.fn(() => 'hashed-token')
}))

vi.mock('@/lib/identity/nicknames', () => ({
  generateNickname: vi.fn(() => 'TestNickname'),
  generateShortId: vi.fn(() => 'Short123')
}))

vi.mock('@/lib/identity/rateLimit', () => ({
  checkRateLimit: vi.fn(() => true)
}))

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn(() => ({ rows: [] }))
  }
}))

import {
  getCoreIdCookie,
  setCoreIdCookie,
  setSessionCookie
} from '@/lib/identity/cookie'
import {
  createCoreIdentity,
  findIdentityById,
  updateLastSeen
} from '@/lib/identity/coreId'
import { checkRateLimit } from '@/lib/identity/rateLimit'

describe('createCoreIdentityAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Ensure rate limit is allowed by default for these tests
    vi.mocked(checkRateLimit).mockReturnValue(true)
  })

  it('returns existing identity when valid coreId cookie is present', async () => {
    // Use a valid UUID format so z.string().uuid() passes
    const validUuid = '123e4567-e89b-12d3-a456-426614174000'
    const mockIdentity = {
      id: validUuid,
      short_id: 'Short123',
      nickname: 'TestNickname',
      recovery_code: 'TEST-CODE-1234'
    }

    vi.mocked(getCoreIdCookie).mockResolvedValue(validUuid)
    vi.mocked(findIdentityById).mockResolvedValue(mockIdentity as any)

    const result = await createCoreIdentityAction()

    expect(result.status).toBe('existing')
    expect(updateLastSeen).toHaveBeenCalledWith(validUuid)
    expect(result).toMatchObject({
      coreId: validUuid,
      shortId: 'Short123',
      nickname: 'TestNickname',
      recoveryCode: 'TEST-CODE-1234'
    })
  })

  it('creates new identity when no cookie exists', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(undefined)
    vi.mocked(createCoreIdentity).mockResolvedValue('new-uuid')

    const result = await createCoreIdentityAction()

    expect(result.status).toBe('created')
    expect(createCoreIdentity).toHaveBeenCalledWith(
      'TEST-CODE-1234',
      'TestNickname',
      'Short123'
    )
    expect(setCoreIdCookie).toHaveBeenCalledWith('new-uuid')
    expect(setSessionCookie).toHaveBeenCalledWith('signed-token')
    expect(result).toMatchObject({
      coreId: 'new-uuid',
      shortId: 'Short123',
      nickname: 'TestNickname',
      recoveryCode: 'TEST-CODE-1234'
    })
  })

  it('returns rate_limited when IP exceeds creation limit', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(undefined)
    vi.mocked(checkRateLimit).mockReturnValue(false)

    const result = await createCoreIdentityAction()

    expect(result.status).toBe('rate_limited')
    expect(createCoreIdentity).not.toHaveBeenCalled()
  })

  it('returns error when identity creation fails', async () => {
    vi.mocked(getCoreIdCookie).mockResolvedValue(undefined)
    vi.mocked(checkRateLimit).mockReturnValue(true) // Explicitly allow rate limit
    vi.mocked(createCoreIdentity).mockRejectedValue(new Error('DB fail'))

    const result = await createCoreIdentityAction()

    expect(result.status).toBe('error')
    expect(result).toHaveProperty('message')
  })
})
