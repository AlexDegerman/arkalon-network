'use server'
import { headers } from 'next/headers'
import pool from '@/lib/db'
import { validateOwnership } from '@/lib/identity/validateOwnership'
import { findIdentityById } from '@/lib/identity/coreId'
import { OwnershipResult } from '@/types/identity'
import { PUBLIC_APPS } from '@/lib/registry/apps'

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

    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    let nickname = 'Anonymous'
    let shortId = 'n/a'
    let ownership: OwnershipResult | null = null

    try {
      ownership = await validateOwnership()
      if (ownership?.valid) {
        const identity = await findIdentityById(ownership.coreId)
        if (identity) {
          nickname = identity.nickname
          shortId = identity.short_id || 'n/a'
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
      const banCheck = await pool.query(
        'SELECT 1 FROM feedback_bans WHERE core_id = $1',
        [ownership.coreId]
      )
      if (banCheck.rowCount && banCheck.rowCount > 0) {
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
            {
              name: ' Context',
              value: `IP: \`${ip.split('.').slice(0, 3).join('.')}.xxx\``,
              inline: true
            },
            {
              name: ' Admin',
              value: `[Ban User](${process.env.NEXT_PUBLIC_SITE_URL || 'https://network.rpsleague.fi'}/api/feedback/ban/${ownership?.valid ? ownership.coreId : 'anonymous'}?key=${process.env.FEEDBACK_ADMIN_KEY || 'missing_key'})`,
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    }

    const discordFormData = new FormData()
    discordFormData.append('payload_json', JSON.stringify(payload))

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
      discordFormData.append(
        'files[0]',
        screenshot,
        screenshot.name || 'screenshot.png'
      )
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: discordFormData
    })
    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[submitFeedbackAction] Discord webhook failed: ${response.status} ${response.statusText}`,
        errorText
      )
      return {
        status: 'error',
        message: `Discord webhook error: ${response.status}`
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