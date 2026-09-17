'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { useUiStore } from '@/app/stores/uiStore'
import { RecoveryCodeEntry } from './RecoveryCodeEntry'
import { validateSessionAction } from '@/app/actions/validateSession'
import { createCoreIdentityAction } from '@/app/actions/createCoreIdentity'
import type { CoreIdentity } from '@/types/identity'

type PanelState =
  | { phase: 'loading' }
  | { phase: 'ready'; data: CoreIdentity }
  | { phase: 'error' }

export function SettingsPanel() {
  const settingsPanelOpen = useUiStore((s) => s.settingsPanelOpen)
  const setSettingsPanelOpen = useUiStore((s) => s.setSettingsPanelOpen)

  const [panelState, setPanelState] = useState<PanelState>({ phase: 'loading' })
  const [activeTab, setActiveTab] = useState<'identity' | 'restore'>('identity')
  const [codeRevealed, setCodeRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const bootstrapInFlight = useRef(false)

  const bootstrap = useCallback(async () => {
    if (bootstrapInFlight.current) return
    bootstrapInFlight.current = true
    setPanelState({ phase: 'loading' })

    try {
      // Check for validated session first
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

      // No validated session - try to create or detect existing identity
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

  // Bootstrap identity and session state when panel opens
  useEffect(() => {
    if (!settingsPanelOpen) {
      setCodeRevealed(false)
      setCopied(false)
      return
    }

    bootstrap()
  }, [settingsPanelOpen, bootstrap])

  // Trap focus inside panel and close on Escape
  useEffect(() => {
    if (!settingsPanelOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSettingsPanelOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    closeRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [settingsPanelOpen, setSettingsPanelOpen])

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable
    }
  }

  if (!settingsPanelOpen) return null

  const identity = panelState.phase === 'ready' ? panelState.data : null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        aria-hidden="true"
        onClick={() => setSettingsPanelOpen(false)}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-90 shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-default)',
          animation: 'fade-in 0.15s ease-out both'
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <h2
            className="text-[0.875rem] font-semibold tracking-wide"
            style={{ color: 'var(--text-primary)' }}
          >
            ARKALON CORE
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setSettingsPanelOpen(false)}
            aria-label="Close settings"
            className="p-1.5 rounded transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={
              {
                color: 'var(--text-muted)',
                '--tw-outline-color': 'var(--accent-network)'
              } as React.CSSProperties
            }
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex flex-col gap-5 px-5 py-5 overflow-y-auto flex-1">
          {/* Identity display */}
          {identity && (
            <div className="flex flex-col gap-1">
              <span
                className="text-[0.6875rem] font-semibold tracking-widest"
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                CURRENT IDENTITY
              </span>
              <span
                className="text-[1.25rem] font-black tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {identity.nickname}
              </span>
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

          {/* Loading state */}
          {panelState.phase === 'loading' && (
            <p
              className="text-[0.8125rem]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Loading identity...
            </p>
          )}

          {/* Error state */}
          {panelState.phase === 'error' && (
            <p
              className="text-[0.8125rem]"
              style={{ color: 'var(--status-maintenance)' }}
            >
              Could not load identity. Please try again.
            </p>
          )}

          {/* Tabs - identity / restore */}
          {identity && (
            <>
              {/* Tab bar */}
              <div
                className="flex border-b"
                style={{ borderColor: 'var(--border-default)' }}
                role="tablist"
                aria-label="Settings sections"
              >
                {(['identity', 'restore'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-3 pb-2 text-[0.8125rem] font-semibold tracking-wide transition-colors duration-150 border-b-2 -mb-px focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={
                      {
                        borderColor:
                          activeTab === tab
                            ? 'var(--accent-network)'
                            : 'transparent',
                        color:
                          activeTab === tab
                            ? 'var(--text-primary)'
                            : 'var(--text-muted)',
                        '--tw-outline-color': 'var(--accent-network)'
                      } as React.CSSProperties
                    }
                  >
                    {tab === 'identity' ? 'RECOVERY ACCESS' : 'RESTORE'}
                  </button>
                ))}
              </div>

              {/* Identity tab */}
              {activeTab === 'identity' && (
                <div role="tabpanel" className="flex flex-col gap-3">
                  <p
                    className="text-[0.8125rem] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Use your recovery code to restore your identity and progress
                    on any device.
                  </p>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 min-w-0 px-3.5 py-2.5 rounded-md text-[0.875rem] font-semibold tracking-wider transition-all border truncate"
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
                        className="shrink-0 px-3 py-2.5 rounded text-[0.75rem] font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer"
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
                        className="shrink-0 px-3 py-2.5 rounded text-[0.75rem] font-bold uppercase tracking-wider transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
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
                </div>
              )}

              {/* Restore tab */}
              {activeTab === 'restore' && (
                <div role="tabpanel">
                  <RecoveryCodeEntry onRestored={bootstrap} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
