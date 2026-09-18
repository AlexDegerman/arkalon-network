'use client'

import { useState, useEffect } from 'react'
import { Dices } from 'lucide-react'
import { useUiStore } from '@/app/stores/uiStore'
import { rerollNicknameAction } from '@/app/actions/rerollNickname'
import { validateSessionAction } from '@/app/actions/validateSession'

export function WelcomeModal() {
  const showWelcomeModal = useUiStore((s) => s.showWelcomeModal)
  const setShowWelcomeModal = useUiStore((s) => s.setShowWelcomeModal)

  const [nickname, setNickname] = useState('Loading...')
  const [rerolling, setRerolling] = useState(false)
  const [justRerolled, setJustRerolled] = useState(false)

  // Fetch the current identity nickname when the modal opens
  useEffect(() => {
    if (showWelcomeModal) {
      validateSessionAction().then((session) => {
        if (session.valid) {
          setNickname(session.nickname)
        } else {
          setNickname('Unknown')
        }
      })
    }
  }, [showWelcomeModal])

  const handleReroll = async () => {
    if (rerolling) return
    setRerolling(true)

    const result = await rerollNicknameAction()
    if (result.status === 'success') {
      setNickname(result.nickname)
      setJustRerolled(true)
      setTimeout(() => setJustRerolled(false), 1000)
    }
    setRerolling(false)
  }

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('arkalon_welcomed', '1')
    }
    setShowWelcomeModal(false)
  }

  if (!showWelcomeModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'var(--bg-primary)',
          backgroundImage: `
          linear-gradient(115deg, transparent 15%, rgba(255, 255, 255, 0.045) 35%, transparent 55%),
          linear-gradient(35deg, rgba(255,255,255,0.025), transparent 30%, rgba(120,140,170,0.035) 70%, transparent),
          radial-gradient(ellipse 90% 55% at 50% -20%, rgba(180,190,210,0.16), transparent 70%),
          linear-gradient(180deg, #151820 0%, #0b0d13 45%, #050609 100%)
        `
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm animate-[fade-in_0.2s_ease-out_both]">
        <div
          className="rounded-xl border shadow-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-active)'
          }}
        >
          <div
            className="h-1 w-full"
            style={{ backgroundColor: 'var(--accent-network)' }}
          />

          <div className="px-6 py-6 flex flex-col items-center text-center gap-5">
            <div className="flex flex-col gap-1">
              <p
                className="text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: 'var(--text-muted)' }}
              >
                Welcome to
              </p>
              <p className="text-2xl font-black tracking-wide g-dqgs select-none whitespace-nowrap">
                ARKALON NETWORK
              </p>
            </div>

            <div className="w-full">
              <p
                className="text-[9px] font-black uppercase tracking-[0.2em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Your Core Identity
              </p>

              <div
                className="w-full rounded-lg border px-4 py-3 flex items-center justify-between gap-3 transition-all duration-200"
                style={{
                  backgroundColor: justRerolled
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'var(--bg-primary)',
                  borderColor: justRerolled
                    ? 'var(--accent-network)'
                    : 'var(--border-default)'
                }}
              >
                <span
                  className="flex-1 whitespace-nowrap tracking-tight font-bold leading-snug text-left"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize:
                      nickname.length > 18
                        ? '10px'
                        : nickname.length > 13
                          ? '12px'
                          : '14px',
                    color: 'var(--text-primary)'
                  }}
                >
                  {rerolling ? '...' : nickname}
                </span>

                <button
                  onClick={handleReroll}
                  disabled={rerolling}
                  className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-active)',
                    color: 'var(--accent-network)',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  <Dices size={12} />
                  <span>REROLL</span>
                </button>
              </div>

              <p
                className="mt-3 text-[11px] leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                This identity is shared across all Arkalon apps.
                <br />
                You can reroll your nickname anytime in Settings.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-150 active:scale-[0.98] cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-network)',
                color: '#ffffff'
              }}
            >
              Enter the Network
            </button>

            <div className="flex flex-col gap-1 mt-1">
              <p
                className="text-[10px] font-medium leading-snug text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                Your session is secured on this device.
              </p>
              <p
                className="text-[10px] font-medium leading-snug text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                Save your recovery code from Settings to restore it elsewhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
