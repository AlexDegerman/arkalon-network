'use client'

import { useEffect } from 'react'
import { recordUtmAction } from '@/app/actions/recordUtm'

export function UtmTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('arkalon_utm_tracked')) return

    const params = new URLSearchParams(window.location.search)
    const source = params.get('utm_source')
    const medium = params.get('utm_medium')
    const campaign = params.get('utm_campaign')
    const referrer = document.referrer

    if (
      source ||
      medium ||
      campaign ||
      (referrer && !referrer.includes(window.location.hostname))
    ) {
      sessionStorage.setItem('arkalon_utm_tracked', '1')
      recordUtmAction({
        source: source || undefined,
        medium: medium || undefined,
        campaign: campaign || undefined,
        referrer: referrer || undefined
      })
    }
  }, [])

  return null
}
