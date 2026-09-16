'use client'

import { useState, useRef } from 'react'
import { restoreCoreIdentityAction } from '@/app/actions/restoreCoreIdentity'

type State =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'success' }
  | { phase: 'error'; message: string }

export function RecoveryCodeEntry() {
  const [code, setCode] = useState('')
  const [state, setState] = useState<State>({ phase: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setState({ phase: 'loading' })

    const result = await restoreCoreIdentityAction(trimmed)

    if (result.status === 'restored') {
      setState({ phase: 'success' })
      setCode('')
    } else if (result.status === 'rate_limited') {
      setState({
        phase: 'error',
        message: 'Too many attempts. Please wait before trying again.'
      })
    } else if (result.status === 'not_found') {
      setState({
        phase: 'error',
        message: 'Recovery code not recognised. Check for typos and try again.'
      })
    } else {
      setState({
        phase: 'error',
        message: 'Something went wrong. Please try again.'
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-[0.8125rem] leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        Enter your recovery code to restore your Arkalon identity on this
        device.
      </p>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            if (state.phase === 'error') setState({ phase: 'idle' })
          }}
          onKeyDown={handleKeyDown}
          placeholder="WORD-WORD-0000"
          aria-label="Recovery code"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          disabled={state.phase === 'loading' || state.phase === 'success'}
          className="w-full rounded-md px-3 py-2 text-[0.875rem] tracking-widest transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={
            {
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
              '--tw-outline-color': 'var(--accent-network)'
            } as React.CSSProperties
          }
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !code.trim() ||
            state.phase === 'loading' ||
            state.phase === 'success'
          }
          className="w-full rounded px-4 py-2 text-[0.875rem] font-semibold tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={
            {
              backgroundColor: 'var(--accent-network)',
              color: '#ffffff',
              opacity: !code.trim() || state.phase === 'loading' ? '0.5' : '1',
              cursor:
                !code.trim() || state.phase === 'loading'
                  ? 'not-allowed'
                  : 'pointer',
              '--tw-outline-color': 'var(--accent-network)'
            } as React.CSSProperties
          }
        >
          {state.phase === 'loading' ? 'Restoring...' : 'Restore Identity'}
        </button>
      </div>

      {state.phase === 'error' && (
        <p
          className="text-[0.8125rem]"
          style={{ color: 'var(--status-maintenance)' }}
          role="alert"
        >
          {state.message}
        </p>
      )}

      {state.phase === 'success' && (
        <p
          className="text-[0.8125rem]"
          style={{ color: 'var(--status-online)' }}
          role="status"
        >
          Identity restored. Your Arkalon Core ID is now active on this device.
        </p>
      )}
    </div>
  )
}
