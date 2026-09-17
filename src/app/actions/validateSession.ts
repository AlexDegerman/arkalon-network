'use server'

import { validateOwnership } from '@/lib/identity/validateOwnership'
import { findIdentityById, updateLastSeen } from '@/lib/identity/coreId'
import type { SessionStatus } from '@/types/identity'

export type { SessionStatus }

// Returns whether the current request has a validated session.
// Also refreshes last_seen_at on the identity record.
// Used by the settings panel to gate recovery code re-display.
export async function validateSessionAction(): Promise<SessionStatus> {
  try {
    const result = await validateOwnership()
    if (!result.valid) return { valid: false }

    await updateLastSeen(result.coreId)
    const identity = await findIdentityById(result.coreId)
    if (!identity) return { valid: false }

    return {
      valid: true,
      coreId: identity.id,
      shortId: identity.short_id || identity.id.slice(0, 10),
      nickname: identity.nickname || 'Unknown Player',
      recoveryCode: identity.recovery_code
    }
  } catch (err) {
    console.error('[validateSessionAction]', err)
    return { valid: false }
  }
}
