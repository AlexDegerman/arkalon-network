'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, Radio } from 'lucide-react'
import { NEWS_ITEMS } from '@/constants/news'

type NewsItem = (typeof NEWS_ITEMS)[number]
type SortOrder = 'newest' | 'oldest'

export default function NewsPage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const sorted: NewsItem[] =
    sortOrder === 'newest' ? NEWS_ITEMS : [...NEWS_ITEMS].reverse()

  useEffect(() => {
    if (openId) {
      setTimeout(() => {
        containerRefs.current[openId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }, 100)
    }
  }, [openId])

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
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
          <Radio size={14} style={{ color: 'var(--accent-network)' }} />
          <h1
            className="text-sm sm:text-base font-black tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            NEWS
          </h1>
        </div>
        <div className="w-14 shrink-0" aria-hidden="true" />
      </div>

      <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <h2
            className="text-base sm:text-lg font-black uppercase tracking-widest"
            style={{ color: 'var(--text-primary)' }}
          >
            Transmission Log
          </h2>
          <p
            className="text-[10px] sm:text-[11px] font-medium mt-1 uppercase tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            {NEWS_ITEMS.length} transmission{NEWS_ITEMS.length !== 1 ? 's' : ''}{' '}
            recorded
          </p>
        </div>

        <div
          className="flex items-center gap-1 rounded-lg p-1 shrink-0 self-start"
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-default)'
          }}
        >
          {(['newest', 'oldest'] as const).map((order) => (
            <button
              key={order}
              type="button"
              onClick={() => setSortOrder(order)}
              className="text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-md transition-all duration-150 cursor-pointer"
              style={{
                backgroundColor:
                  sortOrder === order ? 'var(--accent-network)' : 'transparent',
                color: sortOrder === order ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {order}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {sorted.map((item: NewsItem) => {
          const isOpen = openId === item.id
          const isNewest = item.id === NEWS_ITEMS[0].id
          const monthAbbr = item.date
            .split(' ')[0]
            .substring(0, 3)
            .toUpperCase()
          const day = item.date.split(' ')[1]?.replace(',', '')

          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) containerRefs.current[item.id] = el
              }}
              className="rounded-xl border transition-all duration-200 overflow-hidden scroll-mt-20"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: isOpen
                  ? 'var(--accent-network)'
                  : 'var(--border-default)',
                boxShadow: isOpen
                  ? '0 0 0 1px var(--accent-network), 0 4px 20px rgba(99, 102, 241, 0.15)'
                  : 'none'
              }}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
              >
                <div
                  className="shrink-0 flex flex-col items-center rounded-lg px-2.5 py-1.5"
                  style={{
                    backgroundColor: isNewest
                      ? 'var(--accent-network)'
                      : 'var(--bg-primary)',
                    border: isNewest
                      ? 'none'
                      : '1px solid var(--border-default)'
                  }}
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-wider leading-none"
                    style={{
                      color: isNewest
                        ? 'rgba(255,255,255,0.7)'
                        : 'var(--text-muted)'
                    }}
                  >
                    {monthAbbr}
                  </span>
                  <span
                    className="text-sm font-black leading-tight mt-0.5"
                    style={{
                      color: isNewest ? '#ffffff' : 'var(--text-primary)'
                    }}
                  >
                    {day}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span
                    className="text-xs sm:text-sm font-bold leading-tight truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </span>
                  {isNewest && (
                    <span
                      className="self-start inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--accent-network)'
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: 'var(--accent-network)' }}
                      />
                      Latest
                    </span>
                  )}
                </div>

                <ChevronDown
                  size={16}
                  className="shrink-0 transition-transform duration-200"
                  style={{
                    color: 'var(--text-muted)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              {isOpen && (
                <div
                  className="px-4 pb-4 border-t animate-[fade-in_0.2s_ease-out_both]"
                  style={{ borderColor: 'var(--border-default)' }}
                >
                  <div className="pt-3.5">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="h-px flex-1"
                        style={{ backgroundColor: 'var(--border-default)' }}
                      />
                      <span
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{
                          color: 'var(--text-muted)',
                          fontFamily: "'JetBrains Mono', monospace"
                        }}
                      >
                        {item.date}
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{ backgroundColor: 'var(--border-default)' }}
                      />
                    </div>
                    <ul className="flex flex-col gap-3">
                      {item.notes.map((note: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div
                            className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--accent-network)' }}
                          />
                          <p
                            className="text-[12px] font-medium leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {note}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
