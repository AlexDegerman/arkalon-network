export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  source?: string
}

export type ArkalonQueryResult =
  | { status: 'success'; response: string; source: string }
  | { status: 'rate_limited' }
  | { status: 'error'; message: string }

export interface KnowledgeChunk {
  id: string
  appSlug: string
  title: string
  keywords: string[]
  content: string
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; error: 'RATE_LIMITED' }
