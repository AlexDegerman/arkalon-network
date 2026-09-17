import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('server-only', () => ({}))

import { checkRateLimit } from '@/lib/identity/rateLimit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows the first request', () => {
    expect(checkRateLimit('10.0.0.1', 'identity_creation', 5, 60000)).toBe(true)
  })

  it('allows requests up to the max limit', () => {
    expect(checkRateLimit('10.0.0.2', 'identity_creation', 3, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.2', 'identity_creation', 3, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.2', 'identity_creation', 3, 60000)).toBe(true)
  })

  it('blocks requests exceeding the max limit', () => {
    expect(checkRateLimit('10.0.0.3', 'identity_creation', 2, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.3', 'identity_creation', 2, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.3', 'identity_creation', 2, 60000)).toBe(
      false
    )
  })

  it('resets the counter after the window expires', () => {
    expect(checkRateLimit('10.0.0.4', 'identity_creation', 1, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.4', 'identity_creation', 1, 60000)).toBe(
      false
    )

    vi.advanceTimersByTime(60001)
    expect(checkRateLimit('10.0.0.4', 'identity_creation', 1, 60000)).toBe(true)
  })

  it('tracks different IPs and actions independently', () => {
    expect(checkRateLimit('10.0.0.5', 'identity_creation', 1, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.5', 'identity_creation', 1, 60000)).toBe(
      false
    )

    expect(checkRateLimit('10.0.0.6', 'identity_creation', 1, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.5', 'recovery_entry', 1, 60000)).toBe(true)
  })
})
