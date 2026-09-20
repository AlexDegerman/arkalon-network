'use server'

import pool from '@/lib/db'
import { validateOwnership } from '@/lib/identity/validateOwnership'

interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  referrer?: string
}

export async function recordUtmAction(params: UtmParams): Promise<void> {
  try {
    if (
      !params.source &&
      !params.medium &&
      !params.campaign &&
      !params.referrer
    ) {
      return
    }

    let coreId: string | null = null
    try {
      const ownership = await validateOwnership()
      if (ownership.valid) {
        coreId = ownership.coreId
      }
    } catch {}

    await pool.query(
      `INSERT INTO utm_visits (core_id, utm_source, utm_medium, utm_campaign, referrer, created_at)
        VALUES ($1, $2, $3, $4, $5, now())`,
      [
        coreId,
        params.source?.slice(0, 64) || null,
        params.medium?.slice(0, 64) || null,
        params.campaign?.slice(0, 64) || null,
        params.referrer?.slice(0, 256) || null
      ]
    )
  } catch (err) {
    console.error('[recordUtmAction]', err)
  }
}
