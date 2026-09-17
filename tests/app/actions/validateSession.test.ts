import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateSessionAction } from '@/app/actions/validateSession'

vi.mock('@/lib/identity/validateOwnership', () => ({
  validateOwnership: vi.fn()
}))

vi.mock('@/lib/identity/coreId', () => ({
  findIdentityById: vi.fn(),
  updateLastSeen: vi.fn()
}))

import { validateOwnership } from '@/lib/identity/validateOwnership'
import { findIdentityById, updateLastSeen } from '@/lib/identity/coreId'

describe('validateSessionAction', () => {
  const mockCoreId = '123e4567-e89b-12d3-a456-426614174000'
  const mockIdentity = {
    id: mockCoreId,
    short_id: 'Short123',
    nickname: 'TestNickname',
    recovery_code: 'TEST-CODE-1234',
    created_at: new Date(),
    last_seen_at: new Date()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns valid false when ownership validation fails', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: false,
      reason: 'no_cookie'
    })

    const result = await validateSessionAction()

    expect(result).toEqual({ valid: false })
    expect(updateLastSeen).not.toHaveBeenCalled()
    expect(findIdentityById).not.toHaveBeenCalled()
  })

  it('returns valid false when identity is not found after ownership validation', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(findIdentityById).mockResolvedValue(null)

    const result = await validateSessionAction()

    expect(result).toEqual({ valid: false })
    expect(updateLastSeen).toHaveBeenCalledWith(mockCoreId)
  })

  it('returns valid session data and updates last seen when ownership is valid', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(findIdentityById).mockResolvedValue(mockIdentity)

    const result = await validateSessionAction()

    expect(result).toEqual({
      valid: true,
      coreId: mockCoreId,
      shortId: 'Short123',
      nickname: 'TestNickname',
      recoveryCode: 'TEST-CODE-1234'
    })
    expect(updateLastSeen).toHaveBeenCalledWith(mockCoreId)
  })

  it('returns valid false and logs error when an exception occurs', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    vi.mocked(validateOwnership).mockRejectedValue(
      new Error('Database timeout')
    )

    const result = await validateSessionAction()

    expect(result).toEqual({ valid: false })
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[validateSessionAction]',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })
})
