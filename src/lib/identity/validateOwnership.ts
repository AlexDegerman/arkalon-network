import 'server-only'
import { z } from 'zod'
import pool from '@/lib/db'
import { getSessionCookie, getCoreIdCookie } from '@/lib/identity/cookie'
import {
  verifySessionToken,
  hashSessionToken
} from '@/lib/identity/recoveryCode'

export type OwnershipResult =
  | { valid: true; coreId: string }
  | {
      valid: false
      reason: 'no_cookie' | 'invalid_token' | 'expired' | 'not_found'
    }

const UuidSchema = z.string().uuid()

// Validates that the request has a session token that matches a live
// validated_sessions row for the core_id in the cookie.
// Every protected Server Action must call this before touching identity data.
export async function validateOwnership(): Promise<OwnershipResult> {
  const coreIdCookie = await getCoreIdCookie()
  const sessionToken = await getSessionCookie()

  if (!coreIdCookie || !sessionToken) {
    return { valid: false, reason: 'no_cookie' }
  }

  const coreIdParsed = UuidSchema.safeParse(coreIdCookie)
  if (!coreIdParsed.success) {
    return { valid: false, reason: 'invalid_token' }
  }

  // Verify HMAC signature before any database lookup
  const tokenPayload = verifySessionToken(sessionToken)
  if (!tokenPayload) {
    return { valid: false, reason: 'invalid_token' }
  }

  // Token coreId must match the cookie coreId
  if (tokenPayload.coreId !== coreIdParsed.data) {
    return { valid: false, reason: 'invalid_token' }
  }

  const tokenHash = hashSessionToken(sessionToken)

  const result = await pool.query<{ core_id: string; expires_at: Date }>(
    `SELECT core_id, expires_at
      FROM validated_sessions
      WHERE session_token = $1
        AND core_id = $2
      LIMIT 1`,
    [tokenHash, coreIdParsed.data]
  )

  const row = result.rows[0]
  if (!row) {
    return { valid: false, reason: 'not_found' }
  }

  if (row.expires_at < new Date()) {
    return { valid: false, reason: 'expired' }
  }

  return { valid: true, coreId: row.core_id }
}
