'use server'

import { z } from 'zod'
import {
  getCoreIdCookie,
  setCoreIdCookie,
  setSessionCookie
} from '@/lib/identity/cookie'
import { createCoreIdentity, updateLastSeen } from '@/lib/identity/coreId'
import {
  generateRecoveryCode,
  hashRecoveryCode,
  signSessionToken,
  hashSessionToken
} from '@/lib/identity/recoveryCode'
import { checkRateLimit } from '@/lib/identity/rateLimit'
import { headers } from 'next/headers'
import pool from '@/lib/db'

export type CreateIdentityResult =
  | { status: 'existing'; displayId: string }
  | { status: 'created'; recoveryCode: string }
  | { status: 'rate_limited' }
  | { status: 'error'; message: string }

const UuidSchema = z.string().uuid()

export async function createCoreIdentityAction(): Promise<CreateIdentityResult> {
  try {
    const existingId = await getCoreIdCookie()
    if (existingId) {
      const parsed = UuidSchema.safeParse(existingId)
      if (parsed.success) {
        await updateLastSeen(parsed.data)
        const displayId = parsed.data.slice(0, 8).toUpperCase()
        return { status: 'existing', displayId }
      }
    }

    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const allowed = checkRateLimit(ip, 'identity_creation', 5, 60 * 60 * 1000)
    if (!allowed) {
      return { status: 'rate_limited' }
    }

    const recoveryCode = generateRecoveryCode()
    const recoveryCodeHash = hashRecoveryCode(recoveryCode)

    const coreId = await createCoreIdentity(recoveryCodeHash)

    // Issue session token so the new identity has a validated session immediately
    const sessionToken = signSessionToken(coreId)
    const sessionTokenHash = hashSessionToken(sessionToken)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await pool.query(
      `INSERT INTO validated_sessions (id, core_id, session_token, created_at, expires_at)
        VALUES (gen_random_uuid(), $1, $2, now(), $3)`,
      [coreId, sessionTokenHash, expiresAt]
    )

    await setCoreIdCookie(coreId)
    await setSessionCookie(sessionToken)

    return { status: 'created', recoveryCode }
  } catch (err) {
    console.error('[createCoreIdentityAction]', err)
    return {
      status: 'error',
      message: 'Identity creation failed. Please try again.'
    }
  }
}
