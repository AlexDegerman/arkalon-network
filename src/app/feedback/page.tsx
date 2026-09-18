'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  X,
  Check,
  AlertCircle,
  ChevronDown
} from 'lucide-react'
import { submitFeedbackAction } from '@/app/actions/submitFeedback'
import { PUBLIC_APPS } from '@/lib/registry/apps'

const APP_OPTIONS = [
  { slug: 'any', name: 'Any App' },
  { slug: 'network', name: 'Arkalon Network' },
  ...PUBLIC_APPS.map((a) => ({ slug: a.slug, name: a.name }))
]

function getCategories(slug: string) {
  if (slug === 'any' || slug === 'network') {
    return [
      { key: 'general', label: '💬 General Feedback' },
      { key: 'suggestion', label: '💡 Feature Request' },
      { key: 'bug', label: '🐛 Bug Report' },
      { key: 'ai', label: '🔮 AI Arkalon' }
    ]
  }
  if (slug === 'nexus') {
    return [
      { key: 'general', label: '💬 General Feedback' },
      { key: 'suggestion', label: '💡 Feature Request' },
      { key: 'bug', label: ' Bug Report' }
    ]
  }
  return [
    { key: 'general', label: '💬 General Feedback' },
    { key: 'suggestion', label: '💡 Feature Request' },
    { key: 'bug', label: '🐛 Bug Report' },
    { key: 'gameplay', label: '⚖️ Gameplay & Balance' },
    { key: 'visuals', label: '🎨 Visuals & Audio' }
  ]
}

function getPlaceholder(category: string, appSlug: string) {
  const base =
    {
      general: 'Share your thoughts or general feedback...',
      suggestion: 'Describe your feature request or suggestion...',
      bug: 'Describe the issue, steps to reproduce, and expected behavior...',
      ai: 'Ask Arkalon a question or provide feedback about the AI oracle...',
      gameplay: 'Share feedback on mechanics, difficulty, or balance...',
      visuals: 'Feedback on graphics, UI, animations, or sound design...'
    }[category] || 'Describe your feedback...'

  if (appSlug === 'any') return base
  const appName = APP_OPTIONS.find((a) => a.slug === appSlug)?.name || appSlug
  return `${base} for ${appName}`
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function FeedbackPage() {
  const [appSlug, setAppSlug] = useState('any')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState(getCategories('any')[0].key)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  )
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isBanned, setIsBanned] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const appSelectRef = useRef<HTMLSelectElement>(null)

  const handleFile = useCallback((file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Images only (PNG, JPG, WEBP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Max 5 MB')
      return
    }
    setErrorMsg('')
    setScreenshot(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }, [])

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/')
      )
      if (item) {
        const file = item.getAsFile()
        if (file) handleFile(file)
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handleFile])

  useEffect(() => {
    const currentPreview = screenshotPreview
    return () => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview)
      }
    }
  }, [screenshotPreview])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const removeScreenshot = () => {
    setScreenshot(null)
    setScreenshotPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!message.trim()) {
      setErrorMsg('Message is required')
      return
    }

    setErrorMsg('')
    setStatus('submitting')

    const formData = new FormData()
    formData.append('appSlug', appSlug)
    formData.append('category', category)
    formData.append('email', email)
    formData.append('message', message)
    if (screenshot) formData.append('screenshot', screenshot)

    const result = await submitFeedbackAction(formData)

    if (result.status === 'success') {
      setStatus('success')
      setMessage('')
      setEmail('')
      removeScreenshot()
    } else if (result.status === 'banned') {
      setIsBanned(true)
      setStatus('idle')
    } else {
      setErrorMsg(result.message || 'Submission failed')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="mx-auto w-full max-w-2xl px-3 sm:px-4 pt-3 pb-6 sm:py-5 min-h-dvh flex flex-col items-center justify-center text-center">
        <div
          className="rounded-xl border p-8 flex flex-col items-center gap-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--status-online)'
          }}
        >
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
          >
            <Check size={32} style={{ color: 'var(--status-online)' }} />
          </div>
          <h2
            className="text-lg font-black tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            TRANSMISSION RECEIVED
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your feedback has been securely logged and routed to the Arkalon
            developer.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold tracking-wider transition-colors duration-150 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-network)',
              color: '#ffffff'
            }}
          >
            <ArrowLeft size={13} />
            <span>RETURN TO HUB</span>
          </Link>
        </div>
      </main>
    )
  }
  if (isBanned) {
    return (
      <main className="mx-auto w-full max-w-2xl px-3 sm:px-4 pt-3 pb-6 sm:py-5 min-h-dvh flex flex-col items-center justify-center text-center">
        <div
          className="rounded-xl border p-8 flex flex-col items-center gap-4"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--status-maintenance)'
          }}
        >
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          >
            <AlertCircle
              size={32}
              style={{ color: 'var(--status-maintenance)' }}
            />
          </div>
          <h2
            className="text-lg font-black tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            TRANSMISSION BLOCKED
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your identity has been restricted from submitting feedback.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold tracking-wider transition-colors duration-150 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)'
            }}
          >
            <ArrowLeft size={13} />
            <span>RETURN TO HUB</span>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-3 sm:px-4 pt-3 pb-6 sm:py-5 min-h-dvh flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-5 shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold tracking-wider transition-colors duration-150 hover:bg-(--bg-surface-hover) cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono', monospace"
          }}
          aria-label="Back to Hub"
        >
          <ArrowLeft size={13} />
          <span>HUB</span>
        </Link>
        <div className="flex items-center gap-2">
          <h1
            className="text-sm sm:text-base font-black tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            FEEDBACK
          </h1>
        </div>
        <div className="w-14 shrink-0" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-5 flex-1">
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            App
          </label>
          <div className="relative">
            <select
              ref={appSelectRef}
              value={appSlug}
              onChange={(e) => {
                setAppSlug(e.target.value)
                setCategory(getCategories(e.target.value)[0].key)
              }}
              className="w-full appearance-none rounded-md px-3 py-2.5 text-sm font-bold tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
              style={
                {
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono', monospace",
                  '--tw-outline-color': 'var(--accent-network)'
                } as React.CSSProperties
              }
            >
              {APP_OPTIONS.map(({ slug, name }) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {getCategories(appSlug).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className="px-3 py-1.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer"
                style={{
                  backgroundColor:
                    category === key
                      ? 'var(--accent-network)'
                      : 'var(--bg-primary)',
                  borderColor:
                    category === key
                      ? 'var(--accent-network)'
                      : 'var(--border-default)',
                  color: category === key ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Email (Optional, for response)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-md px-3 py-2.5 text-sm tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={
              {
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontFamily: "'Inter', system-ui, sans-serif",
                '--tw-outline-color': 'var(--accent-network)'
              } as React.CSSProperties
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getPlaceholder(category, appSlug)}
            rows={6}
            className="w-full rounded-md px-3 py-2.5 text-sm tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 resize-none"
            style={
              {
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontFamily: "'Inter', system-ui, sans-serif",
                '--tw-outline-color': 'var(--accent-network)'
              } as React.CSSProperties
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Screenshot (Optional)
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full rounded-md border border-dashed transition-all duration-150 flex flex-col items-center justify-center gap-2 py-6 cursor-pointer"
            style={{
              backgroundColor: isDragging
                ? 'var(--bg-surface-hover)'
                : 'var(--bg-primary)',
              borderColor: isDragging
                ? 'var(--accent-network)'
                : 'var(--border-default)'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
              className="hidden"
            />
            {screenshotPreview ? (
              <div className="relative w-full max-w-xs">
                <img
                  src={screenshotPreview}
                  alt="Screenshot preview"
                  className="w-full rounded-md border"
                  style={{ borderColor: 'var(--border-default)' }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeScreenshot()
                  }}
                  className="absolute -top-2 -right-2 p-1 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: 'var(--status-maintenance)',
                    color: '#ffffff'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={20} style={{ color: 'var(--text-muted)' }} />
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Click to upload or paste (Ctrl+V)
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  PNG, JPG, WEBP up to 5MB
                </span>
              </>
            )}
          </div>
        </div>

        {errorMsg && (
          <div
            className="flex items-start gap-2 rounded-md border p-2.5 text-xs"
            style={{
              borderColor: 'var(--status-maintenance)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--status-maintenance)'
            }}
          >
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === 'submitting' || !message.trim()}
          className="w-full py-3 rounded-md text-xs font-black uppercase tracking-widest transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--accent-network)',
            color: '#ffffff'
          }}
        >
          {status === 'submitting' ? 'TRANSMITTING...' : 'TRANSMIT FEEDBACK'}
        </button>
      </div>
    </main>
  )
}
