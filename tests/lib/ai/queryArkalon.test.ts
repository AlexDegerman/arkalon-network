import { describe, it, expect, vi, beforeEach } from 'vitest'
import { queryArkalonAction } from '@/lib/ai/queryArkalon'

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: vi.fn((name: string) => {
      if (name === 'x-forwarded-for') return '127.0.0.1'
      return null
    })
  }))
}))

vi.mock('@/lib/ai/rateLimiter', () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true }))
}))

vi.mock('@/lib/ai/contextBuilder', () => ({
  buildContext: vi.fn(async () => ({
    context: '<mock_context>telemetry</mock_context>',
    source: 'Arkalon Core'
  }))
}))

vi.mock('@/lib/ai/fallbackModel', () => ({
  generateWithFallback: vi.fn(async () => 'Arkalon calculated response.')
}))

vi.mock('@/lib/ai/cache', () => ({
  getCached: vi.fn(() => null),
  setCache: vi.fn()
}))

vi.mock('@/lib/ai/discordWebhook', () => ({
  logQueryToDiscord: vi.fn(async () => {})
}))

vi.mock('@/lib/identity/validateOwnership', () => ({
  validateOwnership: vi.fn(async () => ({ valid: false }))
}))

import { checkRateLimit } from '@/lib/ai/rateLimiter'
import { buildContext } from '@/lib/ai/contextBuilder'
import { generateWithFallback } from '@/lib/ai/fallbackModel'
import { getCached, setCache } from '@/lib/ai/cache'

describe('queryArkalonAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: true })
    vi.mocked(getCached).mockReturnValue(null)
  })

  it('successfully generates response for a valid query', async () => {
    const messages = [{ role: 'user' as const, content: 'What is Arkalon?' }]

    const result = await queryArkalonAction(messages)

    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.response).toBe('Arkalon calculated response.')
      expect(result.source).toBe('Arkalon Core')
    }

    expect(buildContext).toHaveBeenCalledWith('What is Arkalon?', 1)
    expect(generateWithFallback).toHaveBeenCalled()
    expect(setCache).toHaveBeenCalled()
  })

  it('triggers real-money override immediately without invoking AI models', async () => {
    const messages = [
      {
        role: 'user' as const,
        content: 'Can I cashout my points for real money?'
      }
    ]

    const result = await queryArkalonAction(messages)

    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.source).toBe('system_override')
      expect(result.response).toContain('strictly virtual telemetry metrics')
    }

    expect(generateWithFallback).not.toHaveBeenCalled()
  })

  it('returns rate_limited when IP rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockReturnValue({
      allowed: false,
      error: 'RATE_LIMITED'
    })

    const messages = [{ role: 'user' as const, content: 'What is RPS League?' }]
    const result = await queryArkalonAction(messages)

    expect(result.status).toBe('rate_limited')
    expect(generateWithFallback).not.toHaveBeenCalled()
  })

  it('returns cached response on first turn when available', async () => {
    vi.mocked(getCached).mockReturnValue({
      response: 'Cached prediction calculation.',
      source: 'Arkalon Core'
    })

    const messages = [{ role: 'user' as const, content: 'What is Arkalon?' }]
    const result = await queryArkalonAction(messages)

    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.response).toBe('Cached prediction calculation.')
      expect(result.source).toBe('Arkalon Core')
    }

    expect(generateWithFallback).not.toHaveBeenCalled()
  })

  it('passes turn count accurately for multi-turn conversations', async () => {
    const messages = [
      { role: 'user' as const, content: 'What games exist?' },
      { role: 'assistant' as const, content: 'RPS League and Daily.' },
      { role: 'user' as const, content: 'Tell me about Daily.' }
    ]

    const result = await queryArkalonAction(messages)

    expect(result.status).toBe('success')
    // Expect 2 user turns to be passed to buildContext
    expect(buildContext).toHaveBeenCalledWith('Tell me about Daily.', 2)
  })

  it('returns error when fallback model chain throws an unhandled error', async () => {
    vi.mocked(generateWithFallback).mockRejectedValue(
      new Error('All nodes down')
    )

    const messages = [{ role: 'user' as const, content: 'What is Arkalon?' }]
    const result = await queryArkalonAction(messages)

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.message).toContain('temporarily unreachable')
    }
  })
})
