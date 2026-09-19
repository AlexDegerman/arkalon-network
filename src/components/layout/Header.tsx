'use client'

import { useEffect, useRef } from 'react'
import { Settings } from 'lucide-react'
import { useUiStore } from '@/app/stores/uiStore'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { validateSessionAction } from '@/app/actions/validateSession'
import { createCoreIdentityAction } from '@/app/actions/createCoreIdentity'
import { WelcomeModal } from '@/components/modals/WelcomeModal'
import { NewsModal } from '@/components/modals/NewsModal'
import { NEWS_VERSION } from '@/constants/news'
import { AudioControls } from './AudioControls'

export function Header() {
  const setSettingsPanelOpen = useUiStore((s) => s.setSettingsPanelOpen)
  const setShowWelcomeModal = useUiStore((s) => s.setShowWelcomeModal)
  const setShowNewsModal = useUiStore((s) => s.setShowNewsModal)
  const showNewsModal = useUiStore((s) => s.showNewsModal)
  const bootstrapped = useRef(false)

  // Auto-creates identity on first visit
  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true

    async function ensureIdentity() {
      try {
        const session = await validateSessionAction()
        if (!session.valid) {
          await createCoreIdentityAction()
        }

        if (typeof window !== 'undefined') {
          const hasWelcomed = localStorage.getItem('arkalon_welcomed') === '1'

          if (!hasWelcomed) {
            setShowWelcomeModal(true)
          } else {
            const seenNewsVersion = localStorage.getItem('arkalon_news_seen')
            if (seenNewsVersion !== NEWS_VERSION) {
              setTimeout(() => {
                setShowNewsModal(true)
              }, 600)
            }
          }
        }
      } catch (err) {
        console.error('[Header] Auto-provisioning failed:', err)
      }
    }

    ensureIdentity()
  }, [setShowWelcomeModal, setShowNewsModal])

  const handleNewsClose = () => {
    setShowNewsModal(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('arkalon_news_seen', NEWS_VERSION)
    }
  }

  return (
    <>
      <header className="w-full mb-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="flex items-center gap-1.5 sm:gap-2.5 text-[1.0625rem] min-[360px]:text-[1.1875rem] min-[390px]:text-[1.3125rem] min-[420px]:text-[1.5rem] sm:text-[1.75rem] font-black leading-tight tracking-wide select-none whitespace-nowrap">
            <img
              src="/brand/arkalon-emblem-mono-white.svg"
              alt="Arkalon"
              width={28}
              height={28}
              className="w-5 h-5 min-[360px]:w-5.5 min-[360px]:h-5.5 sm:w-7 sm:h-7 shrink-0 select-none"
            />
            <span className="g-dqgs whitespace-nowrap">ARKALON NETWORK</span>
          </h1>

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 pr-1 sm:pr-0">
            <AudioControls />
            <button
              type="button"
              onClick={() => setSettingsPanelOpen(true)}
              aria-label="Open settings"
              className="p-1.5 sm:p-2 rounded-md transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-(--text-primary) hover:bg-(--bg-surface) cursor-pointer"
              style={
                {
                  color: 'var(--text-muted)',
                  '--tw-outline-color': 'var(--accent-network)'
                } as React.CSSProperties
              }
            >
              <Settings size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
        <p
          className="mt-0.5 text-[0.8125rem] sm:text-[0.875rem] tracking-wide"
          style={{ color: 'var(--text-secondary)' }}
        >
          The Arkalon application ecosystem.
        </p>
      </header>

      <SettingsPanel />
      <WelcomeModal />
      {showNewsModal && <NewsModal onClose={handleNewsClose} />}
    </>
  )
}
