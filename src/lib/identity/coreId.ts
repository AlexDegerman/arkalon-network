import 'server-only'
import pool from '@/lib/db'

export type CoreIdentityRow = {
  id: string
  short_id: string
  nickname: string
  recovery_code: string
  created_at: Date
  last_seen_at: Date
}

export async function createCoreIdentity(
  recoveryCode: string,
  nickname: string,
  shortId: string
): Promise<string> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO core_identities (id, short_id, nickname, recovery_code, created_at, last_seen_at)
      VALUES (gen_random_uuid(), $1, $2, $3, now(), now())
      RETURNING id`,
    [shortId, nickname, recoveryCode.toLowerCase().trim()]
  )
  return result.rows[0].id
}

export async function updateLastSeen(coreId: string): Promise<void> {
  await pool.query(
    `UPDATE core_identities SET last_seen_at = now() WHERE id = $1`,
    [coreId]
  )
}

export async function findIdentityById(
  coreId: string
): Promise<CoreIdentityRow | null> {
  const result = await pool.query<CoreIdentityRow>(
    `SELECT id, short_id, nickname, recovery_code, created_at, last_seen_at
      FROM core_identities
      WHERE id = $1`,
    [coreId]
  )
  return result.rows[0] ?? null
}

export async function findIdentityByRecoveryCode(
  code: string
): Promise<CoreIdentityRow | null> {
  const result = await pool.query<CoreIdentityRow>(
    `SELECT id, short_id, nickname, recovery_code, created_at, last_seen_at
      FROM core_identities
      WHERE recovery_code = $1`,
    [code.toLowerCase().trim()]
  )
  return result.rows[0] ?? null
}
