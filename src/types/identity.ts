export interface CoreIdentity {
  coreId: string
  shortId: string
  nickname: string
  recoveryCode: string
}

export type SessionStatus = ({ valid: true } & CoreIdentity) | { valid: false }

export type OwnershipResult =
  | { valid: true; coreId: string }
  | {
      valid: false
      reason: 'no_cookie' | 'invalid_token' | 'expired' | 'not_found'
    }

export type CreateIdentityResult =
  | ({ status: 'created' | 'existing' } & CoreIdentity)
  | { status: 'rate_limited' }
  | { status: 'error'; message: string }

export type RestoreResult =
  | { status: 'restored' }
  | { status: 'not_found' }
  | { status: 'rate_limited' }
  | { status: 'error' }

export type RerollNicknameResult =
  | { status: 'success'; nickname: string }
  | { status: 'unauthorized' }
  | { status: 'error'; message: string }

export interface CoreIdentityRow {
  id: string
  short_id: string
  nickname: string
  recovery_code: string
  created_at: Date
  last_seen_at: Date
}
