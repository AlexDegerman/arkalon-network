import 'server-only'
import geoip from 'geoip-lite'

export interface GeoLocation {
  town: string | null
  country: string | null
}

/**
 * Masks the client IP address to a valid subnet format (.0 or ::)
 * so it can still be parsed by offline lookup databases.
 */
export const anonymizeIp = (ip: string | undefined): string => {
  if (!ip || ip === 'anonymous') return ''

  const cleanIp = ip.split(',')[0]?.trim() ?? ''

  if (cleanIp.includes('.')) {
    const [p0, p1, p2, p3] = cleanIp.split('.')
    if (
      p0 !== undefined &&
      p1 !== undefined &&
      p2 !== undefined &&
      p3 !== undefined
    ) {
      return `${p0}.${p1}.${p2}.0`
    }
  }

  if (cleanIp.includes(':')) {
    const [p0, p1, p2] = cleanIp.split(':')
    if (p0 !== undefined && p1 !== undefined && p2 !== undefined) {
      return `${p0}:${p1}:${p2}::`
    }
  }

  return cleanIp
}

/**
 * Resolves an approximate town and country offline.
 * Automatically masks IPs and intercepts localhost loopbacks.
 */
export const getCoarseLocation = (rawIp: string | undefined): GeoLocation => {
  if (!rawIp || rawIp === 'anonymous') {
    return { town: null, country: null }
  }

  const maskedIp = anonymizeIp(rawIp)

  if (
    maskedIp === '::1' ||
    maskedIp === '127.0.0.1' ||
    maskedIp.startsWith('::ffff:127.') ||
    maskedIp.startsWith('192.168.') ||
    maskedIp.startsWith('10.')
  ) {
    return { town: 'Developer Localhost', country: 'DEV' }
  }

  try {
    const geo = geoip.lookup(maskedIp)
    if (geo) {
      return {
        town: geo.city || null,
        country: geo.country || null
      }
    }
  } catch {
    // Fail silently to prevent lookup errors from breaking core system threads
  }

  return { town: null, country: null }
}
