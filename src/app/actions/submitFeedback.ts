'use server'
import { validateOwnership } from '@/lib/identity/validateOwnership'
import { findIdentityById } from '@/lib/identity/coreId'
import { OwnershipResult } from '@/types/identity'
import { PUBLIC_APPS } from '@/lib/registry/apps'
import { isBanned, getBanUrl } from '@/lib/bans'
import { sendDiscordWebhook } from '@/lib/discord'

export async function submitFeedbackAction(formData: FormData) {
  try {
    const category = formData.get('category') as string
    const message = formData.get('message') as string
    const email = (formData.get('email') as string) || ''
    const appSlug = (formData.get('appSlug') as string) || 'any'
    const screenshot = formData.get('screenshot') as File | null

    if (!message?.trim()) {
      return { status: 'error', message: 'Message is required.' }
    }

    let nickname = 'Anonymous'
    let shortId = 'n/a'
    let location: string | undefined
    let ownership: OwnershipResult | null = null

    try {
      ownership = await validateOwnership()
      if (ownership?.valid) {
        const identity = await findIdentityById(ownership.coreId)
        if (identity) {
          nickname = identity.nickname
          shortId = identity.short_id || 'n/a'
          location =
            [identity.signup_town, identity.signup_country]
              .filter(Boolean)
              .join(', ') || undefined
        }
      }
    } catch {}

    const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK_URL
    if (!webhookUrl) {
      console.error(
        '[submitFeedbackAction] DISCORD_FEEDBACK_WEBHOOK_URL is not set'
      )
      return { status: 'error', message: 'Server configuration error.' }
    }

    if (ownership?.valid) {
      const banned = await isBanned(ownership.coreId, 'feedback')
      if (banned) {
        return { status: 'banned' }
      }
    }

    const app =
      appSlug === 'network'
        ? { name: 'Arkalon Network' }
        : appSlug === 'any'
          ? { name: 'Any App' }
          : PUBLIC_APPS.find((a) => a.slug === appSlug) || {
              name: 'Unknown App'
            }

    const categoryLabels: Record<string, string> = {
      general: '💬 General Feedback',
      suggestion: '💡 Feature Request',
      bug: '🐛 Bug Report',
      ai: '🔮 AI Arkalon',
      gameplay: '⚖️ Gameplay & Balance',
      visuals: '🎨 Visuals & Audio'
    }

    const colors: Record<string, number> = {
      general: 0x95a5a6,
      suggestion: 0x3498db,
      bug: 0xe74c3c,
      ai: 0xe67e22,
      gameplay: 0x2ecc71,
      visuals: 0x9b59b6
    }

    const catLabel = categoryLabels[category] || ' Uncategorized'
    const embedTitle =
      appSlug === 'any' ? catLabel : `[${app.name}] ${catLabel}`

    const payload = {
      embeds: [
        {
          title: embedTitle,
          color: colors[category] || 0x95a5a6,
          description: message,
          fields: [
            {
              name: '👤 Player',
              value: `**${nickname}**${email ? `\n*${email}*` : ''}\n\`${shortId}\``,
              inline: true
            },
            {
              name: '📱 App',
              value: app.name,
              inline: true
            },
            ...(location
              ? [
                  {
                    name: '📍 Location',
                    value: `\`${location}\``,
                    inline: true
                  }
                ]
              : []),
            ...(ownership?.valid
              ? [
                  {
                    name: ' Admin',
                    value: `[Ban User](${getBanUrl(ownership.coreId, 'feedback')})`,
                    inline: true
                  }
                ]
              : [])
          ],
          timestamp: new Date().toISOString()
        }
      ]
    }

    if (screenshot && screenshot.size > 0) {
      if (screenshot.size > 5 * 1024 * 1024) {
        return { status: 'error', message: 'Screenshot must be under 5MB.' }
      }
      if (
        !['image/png', 'image/jpeg', 'image/webp'].includes(screenshot.type)
      ) {
        return {
          status: 'error',
          message: 'Only PNG, JPG, and WEBP images are allowed.'
        }
      }
    }

    const sent = await sendDiscordWebhook({
      webhookUrl,
      payload,
      file: screenshot
    })

    if (!sent) {
      return {
        status: 'error',
        message: 'Discord webhook error.'
      }
    }
    return { status: 'success' }
  } catch (err) {
    console.error('[submitFeedbackAction]', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return {
      status: 'error',
      message: `Failed to submit feedback: ${errorMessage}`
    }
  }
}
