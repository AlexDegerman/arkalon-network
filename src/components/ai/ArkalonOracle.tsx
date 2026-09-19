'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle, Sparkles, RotateCcw } from 'lucide-react'
import { queryArkalonAction } from '@/lib/ai/queryArkalon'
import { ChatMessage } from '@/types/ai'

const MAX_USER_TURNS = 3

const SUGGESTIONS = [
  'What is the Arkalon Network?',
  'What is Arkalon?',
  'Does my account work across all apps?',
  'How do recovery codes work?',
  'What games are currently in development?'
] as const

function renderFormattedContent(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1 py-0.5 rounded bg-black/40 text-[11px] font-mono text-indigo-300"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

export function ArkalonOracle() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userTurnCount = messages.filter((m) => m.role === 'user').length
  const isSequenceComplete = userTurnCount >= MAX_USER_TURNS && !isLoading

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleReset = () => {
    setMessages([])
    setQuery('')
    setError(null)
  }

  // Starts a new query session when requested instead of appending history
  const executePrompt = async (
    promptText: string,
    isFresh: boolean = false
  ) => {
    const trimmed = promptText.trim()
    if (!trimmed || isLoading) return
    if (!isFresh && isSequenceComplete) return

    setQuery('')
    setIsLoading(true)
    setError(null)

    // If starting fresh (e.g. template clicked), discard prior conversation
    const baseMessages = isFresh ? [] : messages
    const updatedMessages: ChatMessage[] = [
      ...baseMessages,
      { role: 'user', content: trimmed }
    ]

    setMessages(updatedMessages)

    const result = await queryArkalonAction(
      updatedMessages.map((m) => ({ role: m.role, content: m.content }))
    )

    if (result.status === 'success') {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.response, source: result.source }
      ])
    } else if (result.status === 'rate_limited') {
      setError(
        'Arkalon is calculating too many requests. Please pause before continuing.'
      )
    } else {
      setError(result.message || 'An unknown anomaly occurred.')
    }

    setIsLoading(false)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    executePrompt(query, false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executePrompt(query, false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: isSequenceComplete
                ? 'var(--status-maintenance)'
                : 'var(--status-online)'
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>
            {isSequenceComplete
              ? 'DIVINATION COMPLETE'
              : `SEQUENCE: ${userTurnCount} / ${MAX_USER_TURNS}`}
          </span>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Horizontal scrolling on mobile prevents suggestion overflow*/}
      <div className="relative shrink-0">
        <div
          className="overflow-x-auto sm:overflow-x-visible pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-1.5 w-max sm:w-auto sm:flex-wrap pr-8 sm:pr-0">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => executePrompt(s, true)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full border transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 hover:border-indigo-400 hover:text-white"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right-edge fade mask (mobile only) */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 sm:hidden"
          style={{
            background:
              'linear-gradient(to left, var(--bg-primary), transparent)'
          }}
        />
      </div>

      <div
        className={`rounded-lg border overflow-y-auto p-3 flex flex-col gap-2.5 transition-all duration-200 ${
          messages.length === 0
            ? 'h-27.5 sm:h-32.5 justify-center items-center text-center'
            : 'min-h-45 max-h-[46vh] sm:max-h-[50vh]'
        }`}
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-default)'
        }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
            <Sparkles size={22} style={{ color: 'var(--accent-network)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Select a prompt above or ask a question below.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-lg px-3 py-2 text-xs sm:text-sm leading-relaxed ${
                message.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
              }`}
              style={{
                backgroundColor:
                  message.role === 'user'
                    ? 'var(--accent-network)'
                    : 'var(--bg-surface)',
                color:
                  message.role === 'user' ? '#ffffff' : 'var(--text-primary)',
                border:
                  message.role === 'user'
                    ? 'none'
                    : '1px solid var(--border-default)'
              }}
            >
              <p className="whitespace-pre-wrap">
                {renderFormattedContent(message.content)}
              </p>

              {message.source && message.role === 'assistant' && (
                <div className="mt-1 pt-1 flex items-center gap-1.5 border-t border-(--border-default)/40">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-500">
                    Ref: {message.source}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className="rounded-lg rounded-bl-none px-3 py-2 border flex items-center gap-2 text-xs"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)'
              }}
            >
              <Loader2 size={13} className="animate-spin" />
              <span>Arkalon is calculating...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div
          className="flex items-start gap-2 rounded-md border p-2 text-xs shrink-0"
          style={{
            borderColor: 'var(--status-maintenance)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--status-maintenance)'
          }}
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Bottom Input Form: Never pushed off screen */}
      <div className="shrink-0">
        {isSequenceComplete ? (
          <div
            className="rounded-md border p-2.5 flex items-center justify-between gap-2 text-left"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-default)'
            }}
          >
            <div>
              <h4
                className="text-xs font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Sequence Complete
              </h4>
              <p
                className="text-[11px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Arkalon has delivered its calculation.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded text-xs font-bold tracking-wider inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              style={{
                backgroundColor: 'var(--accent-network)',
                color: '#ffffff'
              }}
            >
              <RotateCcw size={12} />
              <span>NEW QUERY</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  userTurnCount === 0
                    ? 'Query Arkalon or tap a suggestion...'
                    : 'Respond to Arkalon...'
                }
                className="w-full h-10 rounded-md px-3 pr-10 text-xs sm:text-sm tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={
                  {
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    fontFamily: "'JetBrains Mono', monospace",
                    '--tw-outline-color': 'var(--accent-network)'
                  } as React.CSSProperties
                }
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute right-1 p-1.5 rounded transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-network)',
                  color: '#ffffff'
                }}
              >
                {isLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
              </button>
            </div>
            <div
              className="flex items-center justify-between text-[10px] px-1 font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>Press Enter to send</span>
              <span>{MAX_USER_TURNS - userTurnCount} queries remaining</span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
