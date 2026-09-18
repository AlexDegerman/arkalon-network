'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createHash } from 'crypto'
import { checkRateLimit } from './rateLimiter'
import { buildContext } from './contextBuilder'
import { generateWithFallback } from './fallbackModel'
import { getCached, setCache } from './cache'
import { ArkalonQueryResult, ChatMessage } from '@/types/ai'

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000)
})

const ConversationSchema = z.array(MessageSchema).min(1)

const REAL_MONEY_TRIGGERS = [
  'cashout',
  'withdraw',
  'withdrawal',
  'paypal',
  'bank transfer',
  'payout',
  'redeem for cash',
  'convert to real money',
  'real money',
  'buy points',
  'purchase'
] as const

const REAL_MONEY_OVERRIDE =
  'Points are strictly virtual telemetry metrics with zero physical value. They exist only for leaderboard ranking and visual tier progression. No real-money transactions are supported in the Arkalon ecosystem.'

function hasRealMoneyIntent(query: string): boolean {
  const q = query.toLowerCase()
  return REAL_MONEY_TRIGGERS.some((trigger) => q.includes(trigger))
}

export async function queryArkalonAction(
  messages: ChatMessage[]
): Promise<ArkalonQueryResult> {
  try {
    const parsed = ConversationSchema.safeParse(messages)
    if (!parsed.success) {
      return { status: 'error', message: 'Invalid query format.' }
    }

    const latestMessage = parsed.data[parsed.data.length - 1].content.trim()

    if (hasRealMoneyIntent(latestMessage)) {
      return {
        status: 'success',
        response: REAL_MONEY_OVERRIDE,
        source: 'system_override'
      }
    }

    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    const rateResult = checkRateLimit(ip)
    if (!rateResult.allowed) {
      return { status: 'rate_limited' }
    }

    // Cache first-turn queries without conversation context
    const isFirstTurn = parsed.data.length === 1
    const cacheKey = createHash('sha256')
      .update(latestMessage.toLowerCase().trim())
      .digest('hex')

    if (isFirstTurn) {
      const cached = getCached(cacheKey)
      if (cached) {
        return {
          status: 'success',
          response: cached.response,
          source: cached.source
        }
      }
    }

    const userTurnCount = parsed.data.filter((m) => m.role === 'user').length

    const { context, source: fallbackSource } = await buildContext(
      latestMessage,
      userTurnCount
    )
    const rawResponse = await generateWithFallback(parsed.data, context)

    const sourceMatch = rawResponse.match(/\[SOURCE:\s*(.*?)\]/)
    const source = sourceMatch?.[1] ?? fallbackSource
    const response = rawResponse.replace(/\[SOURCE:.*?\]/, '').trim()

    if (isFirstTurn) {
      setCache(cacheKey, response, source)
    }

    return { status: 'success', response, source }
  } catch (err) {
    console.error('[queryArkalonAction]', err)
    return {
      status: 'error',
      message:
        'The Arkalon intelligence is temporarily unreachable. Please try again.'
    }
  }
}
