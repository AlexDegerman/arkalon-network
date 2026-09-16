import 'server-only'
import pool from '@/lib/db'

export type CoreIdentityRow = {
  id: string
  recovery_code_hash: string
  created_at: Date
  last_seen_at: Date
}

export type NewIdentityResult = {
  coreId: string
  recoveryCode: string
}

export async function createCoreIdentity(
  recoveryCode: string,
  recoveryCodeHash: string
): Promise<string> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO core_identities (id, recovery_code, created_at, last_seen_at)
      VALUES (gen_random_uuid(), $1, now(), now())
      RETURNING id`,
    [recoveryCodeHash]
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
    `SELECT id, recovery_code, created_at, last_seen_at
      FROM core_identities
      WHERE id = $1`,
    [coreId]
  )
  return result.rows[0] ?? null
}

export async function findIdentityByRecoveryHash(
  hash: string
): Promise<CoreIdentityRow | null> {
  const result = await pool.query<CoreIdentityRow>(
    `SELECT id, recovery_code, created_at, last_seen_at
      FROM core_identities
      WHERE recovery_code = $1`,
    [hash]
  )
  return result.rows[0] ?? null
}
