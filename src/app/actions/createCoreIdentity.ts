'use server'

import { validateOwnership } from '@/lib/identity/validateOwnership'
import { setCoreIdCookie, setSessionCookie } from '@/lib/identity/cookie'
import {
  createCoreIdentity,
  findIdentityById,
  updateLastSeen
} from '@/lib/identity/coreId'
import {
  generateRecoveryCode,
  signSessionToken,
  hashSessionToken
} from '@/lib/identity/recoveryCode'
import { generateNickname, generateShortId } from '@/lib/identity/nicknames'
import { checkRateLimit } from '@/lib/identity/rateLimit'
import { headers } from 'next/headers'
import pool from '@/lib/db'
import type { CreateIdentityResult } from '@/types/identity'

export type { CreateIdentityResult }

export async function createCoreIdentityAction(): Promise<CreateIdentityResult> {
  try {
    const ownership = await validateOwnership()
    if (ownership.valid) {
      await updateLastSeen(ownership.coreId)
      const identity = await findIdentityById(ownership.coreId)
      if (identity) {
        return {
          status: 'existing',
          coreId: identity.id,
          shortId: identity.short_id || identity.id.slice(0, 10),
          nickname: identity.nickname || 'Unknown Player',
          recoveryCode: identity.recovery_code
        }
      }
    }

    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
    const allowed = checkRateLimit(ip, 'identity_creation', 5, 60 * 60 * 1000)
    if (!allowed) {
      return { status: 'rate_limited' }
    }

    const recoveryCode = generateRecoveryCode()
    const nickname = generateNickname()
    const shortId = generateShortId()

    const coreId = await createCoreIdentity(recoveryCode, nickname, shortId)

    // Store only the token hash server-side while keeping the signed token client-side
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

    return {
      status: 'created',
      coreId,
      shortId,
      nickname,
      recoveryCode
    }
  } catch (err) {
    console.error('[createCoreIdentityAction]', err)
    return {
      status: 'error',
      message: 'Identity creation failed. Please try again.'
    }
  }
}
