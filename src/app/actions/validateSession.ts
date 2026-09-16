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