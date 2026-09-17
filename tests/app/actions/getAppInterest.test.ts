import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAppInterestAction } from '@/app/actions/getAppInterest'

vi.mock('@/lib/identity/validateOwnership', () => ({
  validateOwnership: vi.fn()
}))

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

import { validateOwnership } from '@/lib/identity/validateOwnership'
import pool from '@/lib/db'

describe('getAppInterestAction', () => {
  const mockAppSlug = 'test-app'
  const mockCoreId = '123e4567-e89b-12d3-a456-426614174000'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null vote when ownership validation fails', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: false,
      reason: 'no_cookie'
    })

    const result = await getAppInterestAction(mockAppSlug)

    expect(result.status).toBe('success')
    expect(result.vote).toBeNull()
    expect(pool.query).not.toHaveBeenCalled()
  })

  it('returns existing hyped vote when record exists', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(pool.query).mockResolvedValue({
      rows: [{ vote: 'hyped' }]
    } as any)

    const result = await getAppInterestAction(mockAppSlug)

    expect(result.status).toBe('success')
    expect(result.vote).toBe('hyped')
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT vote FROM app_interest_votes'),
      [mockCoreId, mockAppSlug]
    )
  })

  it('returns existing not_interested vote when record exists', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(pool.query).mockResolvedValue({
      rows: [{ vote: 'not_interested' }]
    } as any)

    const result = await getAppInterestAction(mockAppSlug)

    expect(result.status).toBe('success')
    expect(result.vote).toBe('not_interested')
  })

  it('returns null vote when user has no record for the app', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

    const result = await getAppInterestAction(mockAppSlug)

    expect(result.status).toBe('success')
    expect(result.vote).toBeNull()
  })

  it('returns null vote and logs error when database query fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(pool.query).mockRejectedValue(
      new Error('Database connection lost')
    )

    const result = await getAppInterestAction(mockAppSlug)

    expect(result.status).toBe('success')
    expect(result.vote).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[getAppInterestAction]',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })
})
