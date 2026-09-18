import 'server-only'
import { cookies } from 'next/headers'

const CORE_ID_COOKIE = 'arkalon_core_id'
const SESSION_COOKIE = 'arkalon_session'

const ONE_YEAR = 31_536_000
const THIRTY_DAYS = 60 * 60 * 24 * 30

function cookieDomain(): string | undefined {
  if (process.env.NODE_ENV === 'development') return undefined
  return process.env.COOKIE_DOMAIN ?? '.rpsleague.fi'
}

export async function setCoreIdCookie(coreId: string): Promise<void> {
  const cookieStore = await cookies()
  const domain = cookieDomain()
  cookieStore.set(CORE_ID_COOKIE, coreId, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    ...(domain ? { domain } : {}),
    path: '/',
    maxAge: ONE_YEAR
  })
}

export async function getCoreIdCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CORE_ID_COOKIE)?.value
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  const domain = cookieDomain()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    ...(domain ? { domain } : {}),
    path: '/',
    maxAge: THIRTY_DAYS
  })
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value
}
