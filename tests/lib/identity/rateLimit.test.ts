import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('server-only', () => ({}))

import { checkRateLimit } from '@/lib/identity/rateLimit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Advance time to ensure we start fresh if needed,
    // though the tests below are designed to run sequentially safely.
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows the first request', () => {
    expect(checkRateLimit('10.0.0.1', 'test_action_1', 5, 60000)).toBe(true)
  })

  it('allows requests up to the max limit', () => {
    expect(checkRateLimit('10.0.0.2', 'test_action_2', 3, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.2', 'test_action_2', 3, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.2', 'test_action_2', 3, 60000)).toBe(true)
  })

  it('blocks requests exceeding the max limit', () => {
    expect(checkRateLimit('10.0.0.3', 'test_action_3', 2, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.3', 'test_action_3', 2, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.3', 'test_action_3', 2, 60000)).toBe(false)
  })

  it('resets the counter after the window expires', () => {
    expect(checkRateLimit('10.0.0.4', 'test_action_4', 1, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.4', 'test_action_4', 1, 60000)).toBe(false)

    vi.advanceTimersByTime(60001)
    expect(checkRateLimit('10.0.0.4', 'test_action_4', 1, 60000)).toBe(true)
  })

  it('tracks different IPs and actions independently', () => {
    expect(checkRateLimit('10.0.0.5', 'test_action_5', 1, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.5', 'test_action_5', 1, 60000)).toBe(false)

    expect(checkRateLimit('10.0.0.6', 'test_action_5', 1, 60000)).toBe(true)
    expect(checkRateLimit('10.0.0.5', 'test_action_6', 1, 60000)).toBe(true)
  })
})
