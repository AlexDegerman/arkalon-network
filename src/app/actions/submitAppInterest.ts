'use server'

import { z } from 'zod'
import pool from '@/lib/db'
import { validateOwnership } from '@/lib/identity/validateOwnership'

const VoteSchema = z.enum(['hyped', 'not_interested'])

export async function submitAppInterestAction(
  appSlug: string,
  vote: 'hyped' | 'not_interested' | null
) {
  try {
    const ownership = await validateOwnership()
    if (!ownership.valid) {
      return { status: 'error' as const, message: 'Unauthorized' }
    }

    const coreId = ownership.coreId

    if (vote === null) {
      // Remove vote
      await pool.query(
        `DELETE FROM app_interest_votes WHERE core_id = $1 AND app_slug = $2`,
        [coreId, appSlug]
      )
    } else {
      const parsed = VoteSchema.safeParse(vote)
      if (!parsed.success) return { status: 'error' as const }

      // Upsert vote
      await pool.query(
        `INSERT INTO app_interest_votes (core_id, app_slug, vote, created_at, updated_at)
          VALUES ($1, $2, $3, now(), now())
          ON CONFLICT (core_id, app_slug) 
          DO UPDATE SET vote = $3, updated_at = now()`,
        [coreId, appSlug, parsed.data]
      )
    }

    return { status: 'success' as const }
  } catch (err) {
    console.error('[submitAppInterestAction]', err)
    return { status: 'error' as const }
  }
}
