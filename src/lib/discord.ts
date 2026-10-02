import 'server-only'

interface SendDiscordWebhookParams {
  webhookUrl: string
  payload: {
    embeds: Record<string, unknown>[]
  }
  file?: File | null
}

export async function sendDiscordWebhook({
  webhookUrl,
  payload,
  file
}: SendDiscordWebhookParams): Promise<boolean> {
  try {
    let body: BodyInit
    const headers: HeadersInit = {}

    if (file && file.size > 0) {
      const formData = new FormData()
      formData.append('payload_json', JSON.stringify(payload))
      formData.append('files[0]', file, file.name || 'attachment.png')
      body = formData
    } else {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(payload)
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[Discord Webhook] Failed: ${response.status} ${response.statusText}`,
        errorText
      )
      return false
    }
    return true
  } catch (err) {
    console.error('[Discord Webhook Error]:', err)
    return false
  }
}
