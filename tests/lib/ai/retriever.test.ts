import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { retrieveRelevantChunks } from '@/lib/ai/rag/retriever'

describe('retrieveRelevantChunks (RAG Retriever)', () => {
  it('retrieves RPS League knowledge chunks for RPS gameplay queries', () => {
    const query = 'How do relics and world bosses work in RPS League?'
    const hits = retrieveRelevantChunks(query, 3)

    expect(hits.length).toBeGreaterThan(0)
    const appSlugs = hits.map((h) => h.appSlug)
    expect(appSlugs).toContain('rps')

    const ids = hits.map((h) => h.id)
    expect(
      ids.some((id) => id.includes('relics') || id.includes('world-bosses'))
    ).toBe(true)
  })

  it('retrieves Network Identity chunks for account and recovery queries', () => {
    const query = 'How do recovery codes and cookies work on this network?'
    const hits = retrieveRelevantChunks(query, 3)

    expect(hits.length).toBeGreaterThan(0)
    const ids = hits.map((h) => h.id)
    expect(ids).toContain('network:identity')
  })

  it('retrieves Roadmap and Ecosystem chunks when asked about development priorities', () => {
    const query = 'What game is the developer prioritizing next?'
    const hits = retrieveRelevantChunks(query, 3)

    expect(hits.length).toBeGreaterThan(0)
    const ids = hits.map((h) => h.id)
    expect(
      ids.some((id) => id === 'network:faq' || id === 'network:ecosystem')
    ).toBe(true)
  })

  it('defaults to ecosystem overview and FAQ when query has no matching keywords', () => {
    const query = 'zzzjkl qwertyuiop 998877'
    const hits = retrieveRelevantChunks(query, 2)

    expect(hits.length).toBe(2)
    const ids = hits.map((h) => h.id)
    expect(ids).toContain('network:ecosystem')
    expect(ids).toContain('network:faq')
  })

  it('respects the maxResults limiter', () => {
    const query = 'relics bosses events'
    const hits = retrieveRelevantChunks(query, 2)
    expect(hits.length).toBe(2)
  })
})
