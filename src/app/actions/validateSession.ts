'use server'

import { validateOwnership } from '@/lib/identity/validateOwnership'
import { updateLastSeen } from '@/lib/identity/coreId'

export type SessionStatus =
  | { valid: true; displayId: string }
  | { valid: false }

// Returns whether the current request has a validated session.
// Also refreshes last_seen_at on the identity record.
// Used by the settings panel to gate recovery code re-display.
export async function validateSessionAction(): Promise<SessionStatus> {
  try {
    const result = await validateOwnership()
    if (!result.valid) return { valid: false }

    await updateLastSeen(result.coreId)

    const displayId = result.coreId.slice(0, 8).toUpperCase()
    return { valid: true, displayId }
  } catch (err) {
    console.error('[validateSessionAction]', err)
    return { valid: false }
  }
}

export type RecoveryCodeViewResult =
  | { status: 'ok'; code: string }
  | { status: 'unauthorized' }
  | { status: 'error' }

// Re-displays the recovery code only for validated sessions.
// The code is never exposed to unvalidated visitors.
export async function getRecoveryCodeAction(): Promise<RecoveryCodeViewResult> {
  try {
    const ownership = await validateOwnership()
    if (!ownership.valid) return { status: 'unauthorized' }

    const { default: pool } = await import('@/lib/db')
    const { z } = await import('zod')

    const UuidSchema = z.string().uuid()
    const parsed = UuidSchema.safeParse(ownership.coreId)
    if (!parsed.success) return { status: 'unauthorized' }

    // Fetch the stored recovery code hash to confirm the identity exists.
    // Plain recovery codes are never stored or recoverable.
    const result = await pool.query<{ recovery_code: string }>(
      `SELECT recovery_code FROM core_identities WHERE id = $1`,
      [parsed.data]
    )

    if (!result.rows[0]) return { status: 'unauthorized' }

    // Return a safe UI indicator because only the hash is stored.
    return { status: 'ok', code: 'USE-YOUR-SAVED-CODE' }
  } catch (err) {
    console.error('[getRecoveryCodeAction]', err)
    return { status: 'error' }
  }
}
