'use server'

import { z } from 'zod'
import { findIdentityByRecoveryCode } from '@/lib/identity/coreId'
import { signSessionToken, hashSessionToken } from '@/lib/identity/recoveryCode'
import { setCoreIdCookie, setSessionCookie } from '@/lib/identity/cookie'
import { checkRateLimit } from '@/lib/identity/rateLimit'
import { headers } from 'next/headers'
import pool from '@/lib/db'
import { RestoreResult } from '@/types/identity'

// WORD-WORD-DIGITS format, e.g. SWIFT-CRYSTAL-8214
const RecoveryCodeSchema = z
  .string()
  .regex(/^[A-Za-z]+-[A-Za-z]+-\d{4}$/, 'Invalid recovery code format')

export async function restoreCoreIdentityAction(
  code: string
): Promise<RestoreResult> {
  try {
    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const allowed = checkRateLimit(ip, 'recovery_entry', 10, 60 * 60 * 1000)
    if (!allowed) return { status: 'rate_limited' }

    const parsed = RecoveryCodeSchema.safeParse(code.trim())
    if (!parsed.success) return { status: 'not_found' }

    const identity = await findIdentityByRecoveryCode(parsed.data.toLowerCase())

    // Return not_found regardless of whether coreId exists or hash mismatches
    // - prevents enumeration
    if (!identity) return { status: 'not_found' }

    // Issue new session token
    const sessionToken = signSessionToken(identity.id)
    const sessionTokenHash = hashSessionToken(sessionToken)

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await pool.query(
      `INSERT INTO validated_sessions (id, core_id, session_token, created_at, expires_at)
        VALUES (gen_random_uuid(), $1, $2, now(), $3)`,
      [identity.id, sessionTokenHash, expiresAt]
    )

    await setCoreIdCookie(identity.id)
    await setSessionCookie(sessionToken)

    return { status: 'restored' }
  } catch (err) {
    console.error('[restoreCoreIdentityAction]', err)
    return { status: 'error' }
  }
}