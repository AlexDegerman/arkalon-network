'use client'

import { useEffect, useRef, useState, useCallback, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { X, Copy, Check, Dices } from 'lucide-react'
import { useUiStore } from '@/app/stores/uiStore'
import { RecoveryCodeEntry } from './RecoveryCodeEntry'
import { validateSessionAction } from '@/app/actions/validateSession'
import { createCoreIdentityAction } from '@/app/actions/createCoreIdentity'
import { rerollNicknameAction } from '@/app/actions/rerollNickname'
import type { CoreIdentity } from '@/types/identity'

interface SettingsPanelProps {
  forceOpen?: boolean
  initialTab?: 'identity' | 'restore'
  returnTo?: string
}

type PanelState =
  | { phase: 'loading' }
  | { phase: 'ready'; data: CoreIdentity }
  | { phase: 'error' }

export function SettingsPanel({
  forceOpen = false,
  initialTab,
  returnTo
}: SettingsPanelProps = {}) {
  const storeOpen = useUiStore((s) => s.settingsPanelOpen)
  const setSettingsPanelOpen = useUiStore((s) => s.setSettingsPanelOpen)
  const isOpen = forceOpen || storeOpen

  const searchParams = useSearchParams()
  const urlTab = searchParams.get('tab') as 'identity' | 'restore' | null
  const activeReturnTo = returnTo || searchParams.get('returnTo')

  const [panelState, setPanelState] = useState<PanelState>({ phase: 'loading' })
  const [activeTab, setActiveTab] = useState<'identity' | 'restore'>(
    initialTab || urlTab || 'identity'
  )
  const [codeRevealed, setCodeRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isRerolling, startRerollTransition] = useTransition()

  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const bootstrapInFlight = useRef(false)

  const bootstrap = useCallback(async () => {
    if (bootstrapInFlight.current) return
    bootstrapInFlight.current = true
    setPanelState({ phase: 'loading' })

    try {
      const sessionResult = await validateSessionAction()
      if (sessionResult.valid) {
        setPanelState({
          phase: 'ready',
          data: {
            coreId: sessionResult.coreId,
            shortId: sessionResult.shortId,
            nickname: sessionResult.nickname,
            recoveryCode: sessionResult.recoveryCode
          }
        })
        return
      }

      const identityResult = await createCoreIdentityAction()
      if (
        identityResult.status === 'created' ||
        identityResult.status === 'existing'
      ) {
        setPanelState({
          phase: 'ready',
          data: {
            coreId: identityResult.coreId,
            shortId: identityResult.shortId,
            nickname: identityResult.nickname,
            recoveryCode: identityResult.recoveryCode
          }
        })
      } else {
        setPanelState({ phase: 'error' })
      }
    } finally {
      bootstrapInFlight.current = false
    }
  }, [])

  // Auto-switch to restore tab if ?tab=restore is in the URL
  useEffect(() => {
    if (urlTab === 'restore' || urlTab === 'identity') {
      setActiveTab(urlTab)
    }
  }, [urlTab])

  useEffect(() => {
    if (!isOpen) {
      setCodeRevealed(false)
      setCopied(false)
      return
    }
    bootstrap()
  }, [isOpen, bootstrap])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !forceOpen) setSettingsPanelOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, forceOpen, setSettingsPanelOpen])

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable
    }
  }

  const handleReroll = () => {
    startRerollTransition(async () => {
      const res = await rerollNicknameAction()
      if (res.status === 'success') {
        setPanelState((prev) =>
          prev.phase === 'ready'
            ? { ...prev, data: { ...prev.data, nickname: res.nickname } }
            : prev
        )
      }
    })
  }

  if (!isOpen) return null
  const identity = panelState.phase === 'ready' ? panelState.data : null

  return (
    <>
      {!forceOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          aria-hidden="true"
          onClick={() => setSettingsPanelOpen(false)}
        />
      )}

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className={
          forceOpen
            ? 'w-full flex flex-col rounded-xl border p-5 shadow-2xl'
            : 'fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-90 shadow-2xl'
        }
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
          animation: 'fade-in 0.15s ease-out both'
        }}
      >
        <div
          className="flex items-center justify-between pb-4 border-b shrink-0 pt-5 px-5"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <h2
            className="text-[0.875rem] font-semibold tracking-wide"
            style={{ color: 'var(--text-primary)' }}
          >
            ARKALON CORE
          </h2>
          {!forceOpen && (
            <button
              ref={closeRef}
              type="button"
              onClick={() => setSettingsPanelOpen(false)}
              aria-label="Close settings"
              className="p-1.5 rounded transition-colors duration-150 cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-col px-5 pb-5 gap-5 pt-4 overflow-y-auto flex-1">
          {identity && (
            <div className="flex flex-col gap-1.5">
              <span
                className="text-[0.6875rem] font-semibold tracking-widest"
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                CURRENT IDENTITY
              </span>

              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[1.25rem] font-black tracking-tight leading-tight truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {identity.nickname}
                </span>
                <button
                  type="button"
                  onClick={handleReroll}
                  disabled={isRerolling}
                  title="Reroll procedural nickname"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[0.6875rem] font-bold tracking-wider transition-all border shrink-0 cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-active)',
                    color: 'var(--accent-network)',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  <Dices
                    size={13}
                    className={isRerolling ? 'animate-spin' : ''}
                  />
                  <span>REROLL</span>
                </button>
              </div>

              <span
                className="text-[0.75rem] tracking-wider"
                style={{
                  color: 'var(--accent-network)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                ID: {identity.shortId}
              </span>
              <span
                className="text-[0.75rem] mt-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Shared across all Arkalon apps on this network.
              </span>
            </div>
          )}

          {panelState.phase === 'loading' && (
            <p
              className="text-[0.8125rem]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Loading identity...
            </p>
          )}

          {panelState.phase === 'error' && (
            <p
              className="text-[0.8125rem]"
              style={{ color: 'var(--status-maintenance)' }}
            >
              Could not load identity. Please try again.
            </p>
          )}

          {identity && (
            <>
              <div
                className="flex border-b"
                style={{ borderColor: 'var(--border-default)' }}
                role="tablist"
              >
                {(['identity', 'restore'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-3 pb-2 text-[0.8125rem] font-semibold tracking-wide border-b-2 -mb-px cursor-pointer"
                    style={{
                      borderColor:
                        activeTab === tab
                          ? 'var(--accent-network)'
                          : 'transparent',
                      color:
                        activeTab === tab
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)'
                    }}
                  >
                    {tab === 'identity' ? 'RECOVERY ACCESS' : 'RESTORE'}
                  </button>
                ))}
              </div>

              {activeTab === 'identity' && (
                <div role="tabpanel" className="flex flex-col gap-3">
                  <p
                    className="text-[0.8125rem] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Save this recovery code. It is the only way to restore your
                    identity and streaks across devices.
                  </p>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 min-w-0 px-3.5 py-2.5 rounded-md text-[0.875rem] font-semibold tracking-wider border truncate"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        filter: !codeRevealed ? 'blur(6px)' : 'none',
                        userSelect: !codeRevealed ? 'none' : 'text'
                      }}
                    >
                      {identity.recoveryCode}
                    </div>

                    {!codeRevealed ? (
                      <button
                        type="button"
                        onClick={() => setCodeRevealed(true)}
                        className="shrink-0 px-3 py-2.5 rounded text-[0.75rem] font-bold uppercase tracking-wider cursor-pointer"
                        style={{
                          backgroundColor: 'var(--border-active)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Reveal
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCopy(identity.recoveryCode)}
                        className="shrink-0 px-3 py-2.5 rounded text-[0.75rem] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        style={{
                          backgroundColor: copied
                            ? 'var(--status-online)'
                            : 'var(--accent-network)',
                          color: '#ffffff',
                          minWidth: '76px',
                          justifyContent: 'center'
                        }}
                      >
                        {copied ? (
                          <>
                            <Check size={14} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {activeReturnTo && (
                    <a
                      href={activeReturnTo}
                      className="mt-3 inline-flex items-center justify-center rounded px-4 py-2.5 text-xs font-bold tracking-wider transition-colors"
                      style={{
                        backgroundColor: 'var(--accent-network)',
                        color: '#ffffff'
                      }}
                    >
                      RETURN TO APP &rarr;
                    </a>
                  )}
                </div>
              )}

              {activeTab === 'restore' && (
                <div role="tabpanel" className="flex flex-col gap-3">
                  <RecoveryCodeEntry onRestored={bootstrap} />
                  {activeReturnTo && (
                    <a
                      href={activeReturnTo}
                      className="mt-2 text-center text-xs text-text-muted hover:underline"
                    >
                      &larr; Cancel and return to app
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
