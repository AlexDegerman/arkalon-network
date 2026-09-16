import 'server-only'

type RateLimitEntry = {
  count: number
  windowStart: number
}

// Single in-memory store - appropriate for single-container deployment
const store = new Map<string, RateLimitEntry>()

type RateLimitKey = 'identity_creation' | 'recovery_entry'

function makeKey(ip: string, action: RateLimitKey): string {
  return `${action}:${ip}`
}

// Returns true if the request is allowed, false if rate limited.
// windowMs is the sliding window duration in milliseconds.
export function checkRateLimit(
  ip: string,
  action: RateLimitKey,
  maxRequests: number,
  windowMs: number
): boolean {
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
