import 'server-only'
import { KNOWLEDGE_REGISTRY } from './knowledgeStore'
import { KnowledgeChunk } from '@/types/ai'

const APP_TRIGGERS: Record<string, string[]> = {
  rps: [
    'rps',
    'rock',
    'paper',
    'scissors',
    'predict',
    'bet',
    'relic',
    'boss',
    'festival',
    'flash event',
    'streak',
    'lap',
    'ascend',
    'neon paradise'
  ],
  network: [
    'network',
    'core',
    'account',
    'identity',
    'recovery',
    'code',
    'nickname',
    'reroll',
    'sso',
    'cookie',
    'restore',
    'portal',
    'ecosystem',
    'hub'
  ],
  daily: ['daily', 'puzzle', 'challenge', 'seed', 'attempt'],
  labs: ['labs', 'idle', 'facility', 'research', 'passive'],
  'tower-defense': ['tower', 'defense', 'td', 'path', 'turret'],
  realms: ['realms', 'roguelike', 'rpg', 'dungeon', 'realtime'],
  'chaos-racing': ['racing', 'chaos', 'physics', 'stunt', 'car'],
  market: ['market', 'economy', 'trading', 'commodity'],
  dungeons: ['dungeons', 'dungeon crawler', 'permadeath'],
  nexus: ['nexus', 'stats', 'analytics', 'telemetry hub'],
  arena: ['arena', '1v1', 'duel', 'grid'],
  raids: ['raids', 'boss raid', 'co-op combat'],
  auction: ['auction', 'bidding', 'lots', 'valuation'],
  dispatch: ['dispatch', 'squad', 'expedition', 'injury'],
  party: ['party', 'minigame', 'physics party'],
  colony: ['colony', 'city builder', 'settlement']
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'are',
  'you',
  'can',
  'how',
  'what',
  'with',
  'this',
  'that',
  'from',
  'have',
  'your',
  'about',
  'there',
  'does'
])

export function retrieveRelevantChunks(
  query: string,
  maxResults = 3
): KnowledgeChunk[] {
  const q = query.toLowerCase()
  const words = q.split(/\W+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w))

  const detectedApps = new Set<string>()
  for (const [appSlug, triggers] of Object.entries(APP_TRIGGERS)) {
    if (triggers.some((trigger) => q.includes(trigger))) {
      detectedApps.add(appSlug)
    }
  }

  const scored = KNOWLEDGE_REGISTRY.map((chunk) => {
    let score = 0

    if (detectedApps.has(chunk.appSlug)) {
      score += 15
    }

    if (q.includes(chunk.title.toLowerCase())) {
      score += 20
    }

    for (const kw of chunk.keywords) {
      if (q.includes(kw)) {
        score += 8
      }
    }

    for (const word of words) {
      if (chunk.content.toLowerCase().includes(word)) {
        score += 1
      }
    }

    return { chunk, score }
  })

  scored.sort((a, b) => b.score - a.score)

  const topHits = scored.filter((item) => item.score > 0)
  if (topHits.length === 0) {
    return KNOWLEDGE_REGISTRY.filter(
      (c) => c.id === 'network:ecosystem' || c.id === 'network:faq'
    ).slice(0, maxResults)
  }

  return topHits.slice(0, maxResults).map((item) => item.chunk)
}
