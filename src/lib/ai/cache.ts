import 'server-only'

const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

interface CacheEntry {
  response: string
  source: string
  timestamp: number
}

const queryCache = new Map<string, CacheEntry>()

export function getCached(
  key: string
): { response: string; source: string } | null {
  const entry = queryCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    queryCache.delete(key)
    return null
  }
  return { response: entry.response, source: entry.source }
}

export function setCache(key: string, response: string, source: string): void {
  queryCache.set(key, { response, source, timestamp: Date.now() })
}

export function pruneCache(): void {
  const now = Date.now()
  for (const [key, value] of queryCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) queryCache.delete(key)
  }
}

if (process.env.NODE_ENV !== 'test') {
  setInterval(pruneCache, 1000 * 60 * 60) // Prune every hour
}
