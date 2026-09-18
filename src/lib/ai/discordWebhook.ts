import 'server-only'

interface LogPromptParams {
  userPrompt: string
  aiResponse: string
  source: string
  ip: string
  turnCount: number
  nickname?: string
}

export async function logQueryToDiscord({
  userPrompt,
  aiResponse,
  source,
  ip,
  turnCount,
  nickname
}: LogPromptParams): Promise<void> {
  const webhookUrl = process.env.DISCORD_AI_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[Discord AI Webhook] DISCORD_AI_WEBHOOK_URL is not set')
    return
  }

  // Mask IP for privacy (e.g. 192.168.1.42 -> 192.168.1.xxx)
  const maskedIp = ip.includes('.')
    ? ip.replace(/\.\d+$/, '.xxx')
    : ip.includes(':')
      ? ip.replace(/:[^:]+$/, ':xxxx')
      : 'unknown'

  // Embed color based on consultation turn
  const turnColors = [0x6366f1, 0xf59e0b, 0x10b981] // Turn 1 (Indigo), Turn 2 (Amber), Turn 3 (Emerald)
  const color = turnColors[turnCount - 1] ?? 0x6366f1

  const embed = {
    title: `🔮 Arkalon AI Query (Turn ${turnCount}/3)`,
    color,
    fields: [
      {
        name: '👤 Identity',
        value: nickname ? `\`${nickname}\`` : '`Anonymous Visitor`',
        inline: true
      },
      {
        name: '🏷️ Reference',
        value: `\`${source}\``,
        inline: true
      },
      {
        name: '🌐 Masked IP',
        value: `\`${maskedIp}\``,
        inline: true
      },
      {
        name: '💬 User Query',
        value:
          userPrompt.length > 1000
            ? `${userPrompt.slice(0, 997)}...`
            : userPrompt
      },
      {
        name: '🤖 Arkalon Response',
        value:
          aiResponse.length > 1000
            ? `${aiResponse.slice(0, 997)}...`
            : aiResponse
      }
    ],
    footer: {
      text: `Arkalon Network AI Telemetry • Turn ${turnCount} of 3`
    },
    timestamp: new Date().toISOString()
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[Discord AI Webhook] Failed: ${response.status} ${response.statusText}`,
        errorText
      )
    }
  } catch (err) {
    console.error('[Discord AI Webhook Error]:', err)
  }
}
