import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

const mockSet = vi.fn()
const mockGet = vi.fn()

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: mockGet,
    set: mockSet
  }))
}))

import {
  getCoreIdCookie,
  getSessionCookie,
  setCoreIdCookie,
  setSessionCookie
} from '@/lib/identity/cookie'

describe('cookie utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCoreIdCookie', () => {
    it('returns the coreId value when cookie exists', async () => {
      mockGet.mockReturnValue({ value: 'mock-core-id-123' })

      const result = await getCoreIdCookie()

      expect(result).toBe('mock-core-id-123')
    })

    it('returns undefined when cookie does not exist', async () => {
      mockGet.mockReturnValue(undefined)

      const result = await getCoreIdCookie()

      expect(result).toBeUndefined()
    })
  })

  describe('getSessionCookie', () => {
    it('returns the session token when cookie exists', async () => {
      mockGet.mockReturnValue({ value: 'mock-session-token' })

      const result = await getSessionCookie()

      expect(result).toBe('mock-session-token')
    })

    it('returns undefined when cookie does not exist', async () => {
      mockGet.mockReturnValue(undefined)

      const result = await getSessionCookie()

      expect(result).toBeUndefined()
    })
  })

  describe('setCoreIdCookie', () => {
    it('sets the cookie with correct security options', async () => {
      await setCoreIdCookie('new-core-id')

      expect(mockSet).toHaveBeenCalledWith('arkalon_core_id', 'new-core-id', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        domain: '.rpsleague.fi'
      })
    })
  })

  describe('setSessionCookie', () => {
    it('sets the session cookie with correct security options', async () => {
      await setSessionCookie('new-session-token')

      expect(mockSet).toHaveBeenCalledWith(
        'arkalon_session',
        'new-session-token',
        {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
          domain: '.rpsleague.fi'
        }
      )
    })
  })
})
