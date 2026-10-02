import 'server-only'
import pool from '@/lib/db'

export type BanFeature = 'feedback' | 'ai'

export async function isBanned(
  coreId: string,
  feature: BanFeature
): Promise<boolean> {
  const table = feature === 'feedback' ? 'feedback_bans' : 'ai_bans'
  try {
    const result = await pool.query(
      `SELECT 1 FROM ${table} WHERE core_id = $1 LIMIT 1`,
      [coreId]
    )
    return (result.rowCount ?? 0) > 0
  } catch (err) {
    console.error(`[isBanned:${feature}]`, err)
    return false
  }
}

export async function banCoreId(
  coreId: string,
  feature: BanFeature
): Promise<void> {
  const table = feature === 'feedback' ? 'feedback_bans' : 'ai_bans'
  await pool.query(
    `INSERT INTO ${table} (core_id, banned_at) VALUES ($1, NOW()) ON CONFLICT (core_id) DO NOTHING`,
    [coreId]
  )
}

export function getBanUrl(coreId: string, feature: BanFeature): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://network.rpsleague.fi'
  const key = process.env.FEEDBACK_ADMIN_KEY || 'missing_key'
  return `${siteUrl}/api/ban/${feature}/${coreId}?key=${key}`
}
