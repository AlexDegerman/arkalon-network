import 'server-only'
import { getBanUrl } from '@/lib/bans'
import { sendDiscordWebhook } from '@/lib/discord'

interface LogPromptParams {
  userPrompt: string
  aiResponse: string
  source: string
  turnCount: number
  nickname?: string
  coreId?: string
}

export async function logQueryToDiscord({
  userPrompt,
  aiResponse,
  source,
  turnCount,
  nickname,
  coreId
}: LogPromptParams): Promise<void> {
  const webhookUrl = process.env.DISCORD_AI_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[Discord AI Webhook] DISCORD_AI_WEBHOOK_URL is not set')
    return
  }

  // Embed color based on consultation turn
  const turnColors = [0x6366f1, 0xf59e0b, 0x10b981] // Turn 1 (Indigo), Turn 2 (Amber), Turn 3 (Emerald)
  const color = turnColors[turnCount - 1] ?? 0x6366f1

  const fields: Record<string, unknown>[] = [
    {
      name: '👤 Identity',
      value: nickname ? `\`${nickname}\`` : '`Anonymous Visitor`',
      inline: true
    },
    {
      name: '🏷️ Reference',
      value: `\`${source}\``,
      inline: true
    }
  ]

  if (coreId) {
    fields.push({
      name: ' Admin',
      value: `[Ban User](${getBanUrl(coreId, 'ai')})`,
      inline: true
    })
  }

  fields.push(
    {
      name: '💬 User Query',
      value:
        userPrompt.length > 1000 ? `${userPrompt.slice(0, 997)}...` : userPrompt
    },
    {
      name: '🤖 Arkalon Response',
      value:
        aiResponse.length > 1000 ? `${aiResponse.slice(0, 997)}...` : aiResponse
    }
  )

  const embed = {
    title: `🔮 Arkalon AI Query (Turn ${turnCount}/3)`,
    color,
    fields,
    footer: {
      text: `Arkalon Network AI Telemetry • Turn ${turnCount} of 3`
    },
    timestamp: new Date().toISOString()
  }

  await sendDiscordWebhook({
    webhookUrl,
    payload: { embeds: [embed] }
  })
}
