import 'server-only'

type RateLimitEntry = {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitEntry>()

type RateLimitKey = 'identity_creation' | 'recovery_entry'

let checksSinceCleanup = 0
const CLEANUP_INTERVAL = 100
// Stale entries older than this are removed during cleanup
const MAX_WINDOW_MS = 60 * 60 * 1000

function makeKey(ip: string, action: RateLimitKey): string {
  return `${action}:${ip}`
}

function cleanupStaleEntries(): void {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now - entry.windowStart >= MAX_WINDOW_MS) {
      store.delete(key)
    }
  }
}

export function checkRateLimit(
  ip: string,
  action: RateLimitKey,
  maxRequests: number,
  windowMs: number
): boolean {
  checksSinceCleanup++
  if (checksSinceCleanup >= CLEANUP_INTERVAL) {
    checksSinceCleanup = 0
    cleanupStaleEntries()
  }

  const key = makeKey(ip, action)
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  store.set(key, { count: entry.count + 1, windowStart: entry.windowStart })
  return true
}
