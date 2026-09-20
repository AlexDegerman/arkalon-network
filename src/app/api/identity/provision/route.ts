import { NextResponse } from 'next/server'
import { createCoreIdentity } from '@/lib/identity/coreId'
import {
  generateRecoveryCode,
  signSessionToken,
  hashSessionToken
} from '@/lib/identity/recoveryCode'
import { generateNickname, generateShortId } from '@/lib/identity/nicknames'
import pool from '@/lib/db'

export async function POST(req: Request) {
  const authHeader = req.headers.get('x-internal-secret')
  if (authHeader !== process.env.INTERNAL_SERVICE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const recoveryCode = generateRecoveryCode()
    const nickname = generateNickname()
    const shortId = generateShortId()
    const coreId = await createCoreIdentity(recoveryCode, nickname, shortId)

    const sessionToken = signSessionToken(coreId)
    const sessionTokenHash = hashSessionToken(sessionToken)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await pool.query(
      `INSERT INTO validated_sessions (id, core_id, session_token, created_at, expires_at)
        VALUES (gen_random_uuid(), $1, $2, now(), $3)`,
      [coreId, sessionTokenHash, expiresAt]
    )

    return NextResponse.json({
      success: true,
      coreId,
      sessionToken,
      nickname,
      shortId,
      recoveryCode
    })
  } catch (err) {
    console.error('[API /identity/provision]', err)
    return NextResponse.json({ error: 'Provisioning failed' }, { status: 500 })
  }
}
