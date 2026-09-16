'use server'

import { z } from 'zod'
import { getCoreIdCookie, setCoreIdCookie } from '@/lib/identity/cookie'
import { createCoreIdentity, updateLastSeen } from '@/lib/identity/coreId'
import {
  generateRecoveryCode,
  hashRecoveryCode
} from '@/lib/identity/recoveryCode'
import { checkRateLimit } from '@/lib/identity/rateLimit'
import { headers } from 'next/headers'

// Return shape sent to client - no credentials, no hash, no cookie values
export type CreateIdentityResult =
  | { status: 'existing' }
  | { status: 'created'; recoveryCode: string }
  | { status: 'rate_limited' }
  | { status: 'error'; message: string }

const UuidSchema = z.string().uuid()

export async function createCoreIdentityAction(): Promise<CreateIdentityResult> {
  try {
    // If a valid core_id cookie already exists, just refresh last_seen
    const existingId = await getCoreIdCookie()
    if (existingId) {
      const parsed = UuidSchema.safeParse(existingId)
      if (parsed.success) {
        await updateLastSeen(parsed.data)
        return { status: 'existing' }
      }
    }

    // Rate limit by IP before creating a new identity
    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const allowed = checkRateLimit(ip, 'identity_creation', 5, 60 * 60 * 1000)
    if (!allowed) {
      return { status: 'rate_limited' }
    }

    const recoveryCode = generateRecoveryCode()
    const recoveryCodeHash = hashRecoveryCode(recoveryCode)

    const coreId = await createCoreIdentity(recoveryCode, recoveryCodeHash)

    setCoreIdCookie(coreId)

    // Return the plain recovery code once - never stored in plain text after this
    return { status: 'created', recoveryCode }
  } catch (err) {
    // Log server-side only, return safe message to client
    console.error('[createCoreIdentityAction]', err)
    return {
      status: 'error',
      message: 'Identity creation failed. Please try again.'
    }
  }
}

export async function getDisplayCoreId(): Promise<string | null> {
  const id = await getCoreIdCookie()
  if (!id) return null
  const parsed = UuidSchema.safeParse(id)
  if (!parsed.success) return null
  // Return truncated form for display - full UUID is only used server-side
  return parsed.data.slice(0, 8).toUpperCase()
}
