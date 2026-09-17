import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitAppInterestAction } from '@/app/actions/submitAppInterest'

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

describe('submitAppInterestAction', () => {
  const mockAppSlug = 'test-app'
  const mockCoreId = '123e4567-e89b-12d3-a456-426614174000'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when ownership validation fails', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: false,
      reason: 'no_cookie'
    })

    const result = await submitAppInterestAction(mockAppSlug, 'hyped')

    expect(result.status).toBe('error')
    expect(result.message).toBe('Unauthorized')
    expect(pool.query).not.toHaveBeenCalled()
  })

  it('deletes existing vote when vote is null', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

    const result = await submitAppInterestAction(mockAppSlug, null)

    expect(result.status).toBe('success')
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM app_interest_votes'),
      [mockCoreId, mockAppSlug]
    )
  })

  it('upserts new hyped vote when no previous record exists', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

    const result = await submitAppInterestAction(mockAppSlug, 'hyped')

    expect(result.status).toBe('success')
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO app_interest_votes'),
      [mockCoreId, mockAppSlug, 'hyped']
    )
  })

  it('updates existing vote when switching from hyped to not_interested', async () => {
    vi.mocked(validateOwnership).mockResolvedValue({
      valid: true,
      coreId: mockCoreId
    })
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

    const result = await submitAppInterestAction(mockAppSlug, 'not_interested')

    expect(result.status).toBe('success')
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('ON CONFLICT (core_id, app_slug)'),
      [mockCoreId, mockAppSlug, 'not_interested']
    )
  })

  it('returns error and logs when database query fails', async () => {
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

    const result = await submitAppInterestAction(mockAppSlug, 'hyped')

    expect(result.status).toBe('error')
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[submitAppInterestAction]',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })
})
