import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildSystemInstruction } from './prompt'
import { ChatMessage } from '@/types/ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Ordered fallback models used when a generation request fails
const MODEL_FALLBACK_CHAIN = [
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash'
] as const

export async function generateWithFallback(
  messages: ChatMessage[],
  contextString: string
): Promise<string> {
  const latestMessage = messages[messages.length - 1]?.content || ''
  const previousTurns = messages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }))

  let lastError: unknown = null

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: buildSystemInstruction(contextString)
      })

      const chat = model.startChat({
        history: previousTurns
      })

      const result = await chat.sendMessage(latestMessage)
      return result.response.text()
    } catch (err) {
      lastError = err
      const message = err instanceof Error ? err.message : String(err)
      console.warn(
        `[Arkalon AI] Node ${modelName} unavailable, falling back:`,
        message
      )

      // Retry with the next model for unavailable, rate-limited, or overloaded responses
      continue
    }
  }

  console.error('[Arkalon AI] All fallback nodes exhausted:', lastError)
  throw new Error('All Arkalon nodes are currently unresponsive.')
}
