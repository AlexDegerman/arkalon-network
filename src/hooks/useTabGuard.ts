'use client'

import { useEffect, useState } from 'react'

const CHANNEL_NAME = 'arkalon_network_tab'

type TabMessage =
  | { type: 'ping'; tabId: string }
  | { type: 'pong'; tabId: string }

export function useTabGuard(): { isDuplicate: boolean } {
  const [isDuplicate, setIsDuplicate] = useState(false)

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return

    const channel = new BroadcastChannel(CHANNEL_NAME)
    const tabId = crypto.randomUUID()

    const handleMessage = (event: MessageEvent<TabMessage>) => {
      const msg = event.data
      if (msg.type === 'ping' && msg.tabId !== tabId) {
        channel.postMessage({ type: 'pong', tabId } satisfies TabMessage)
        setIsDuplicate(true)
      }
      if (msg.type === 'pong' && msg.tabId !== tabId) {
        setIsDuplicate(true)
      }
    }

    channel.addEventListener('message', handleMessage)
    channel.postMessage({ type: 'ping', tabId } satisfies TabMessage)

    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [])

  return { isDuplicate }
}
