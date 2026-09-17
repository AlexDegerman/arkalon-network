import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('@/lib/db', () => ({
  default: {
    query: vi.fn()
  }
}))

import pool from '@/lib/db'
import {
  createCoreIdentity,
  findIdentityById,
  findIdentityByRecoveryCode,
  updateLastSeen
} from '@/lib/identity/coreId'

describe('coreId database operations', () => {
  const mockCoreId = '123e4567-e89b-12d3-a456-426614174000'
  const mockHash = 'mock-recovery-hash'
  const mockNickname = 'TestNickname'
  const mockShortId = 'Short123'
  const mockIdentity = {
    id: mockCoreId,
    short_id: mockShortId,
    nickname: mockNickname,
    recovery_code: mockHash,
    created_at: new Date(),
    last_seen_at: new Date()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCoreIdentity', () => {
    it('inserts a new identity and returns the generated id', async () => {
      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ id: mockCoreId }]
      } as any)

      const result = await createCoreIdentity(
        mockHash,
        mockNickname,
        mockShortId
      )

      expect(result).toBe(mockCoreId)
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO core_identities'),
        [mockShortId, mockNickname, mockHash]
      )
    })
  })

  describe('findIdentityById', () => {
    it('returns the identity when found', async () => {
      vi.mocked(pool.query).mockResolvedValue({
        rows: [mockIdentity]
      } as any)

      const result = await findIdentityById(mockCoreId)

      expect(result).toEqual(mockIdentity)
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id = $1'),
        [mockCoreId]
      )
    })

    it('returns null when identity is not found', async () => {
      vi.mocked(pool.query).mockResolvedValue({
        rows: []
      } as any)

      const result = await findIdentityById(mockCoreId)

      expect(result).toBeNull()
    })
  })

  describe('findIdentityByRecoveryCode', () => {
    it('returns the identity when recovery hash matches', async () => {
      vi.mocked(pool.query).mockResolvedValue({
        rows: [mockIdentity]
      } as any)

      const result = await findIdentityByRecoveryCode(mockHash)

      expect(result).toEqual(mockIdentity)
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE recovery_code = $1'),
        [mockHash]
      )
    })

    it('returns null when no matching recovery hash exists', async () => {
      vi.mocked(pool.query).mockResolvedValue({
        rows: []
      } as any)

      const result = await findIdentityByRecoveryCode(mockHash)

      expect(result).toBeNull()
    })
  })

  describe('updateLastSeen', () => {
    it('updates the last_seen_at timestamp for the given coreId', async () => {
      vi.mocked(pool.query).mockResolvedValue({
        rows: []
      } as any)

      await updateLastSeen(mockCoreId)

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining(
          'UPDATE core_identities SET last_seen_at = now()'
        ),
        [mockCoreId]
      )
    })
  })
})
