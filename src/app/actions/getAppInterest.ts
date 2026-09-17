'use server'

import pool from '@/lib/db'
import { validateOwnership } from '@/lib/identity/validateOwnership'

export async function getAppInterestAction(appSlug: string) {
  try {
    const ownership = await validateOwnership()
    if (!ownership.valid) {
      return { status: 'success' as const, vote: null }
    }

    const result = await pool.query<{ vote: string }>(
      `SELECT vote FROM app_interest_votes WHERE core_id = $1 AND app_slug = $2`,
      [ownership.coreId, appSlug]
    )

    return {
      status: 'success' as const,
      vote: (result.rows[0]?.vote as 'hyped' | 'not_interested' | null) || null
    }
  } catch (err) {
    console.error('[getAppInterestAction]', err)
    return { status: 'success' as const, vote: null }
  }
}
