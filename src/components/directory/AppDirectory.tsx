'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { PUBLIC_APPS } from '@/lib/registry/apps'
import { GENRE_FILTERS } from '@/constants/genres'
import { AppCard } from './AppCard'

export function AppDirectory() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isOpen, setIsOpen] = useState(false)
  const [expandedApp, setExpandedApp] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const filter of GENRE_FILTERS) {
      map[filter.id] = PUBLIC_APPS.filter((app) => filter.match(app)).length
    }
    return map
  }, [])

  const filteredApps = useMemo(() => {
    const activeFilter = GENRE_FILTERS.find((f) => f.id === activeCategory)
    if (!activeFilter || activeFilter.id === 'all') return PUBLIC_APPS
    return PUBLIC_APPS.filter((app) => activeFilter.match(app))
  }, [activeCategory])

  const activeLabel = useMemo(() => {
    return GENRE_FILTERS.find((c) => c.id === activeCategory)?.label ?? 'ALL'
  }, [activeCategory])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col flex-1 min-w-0 w-full">
      {/* Filter bar with dropdown */}
      <div
        className="relative mb-4 z-30 flex items-center justify-between"
        ref={dropdownRef}
      >
        <a
          href="/ai"
          className="inline-flex items-center px-3 py-1.5 rounded-md text-[0.75rem] font-semibold tracking-wider transition-colors duration-150 cursor-pointer hover:bg-(--bg-surface-hover)"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            color: 'var(--accent-network)',
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          ASK AI
        </a>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Filter applications"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[0.75rem] font-semibold tracking-wider transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-(--bg-surface-hover)"
          style={
            {
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontFamily: "'JetBrains Mono', monospace",
              '--tw-outline-color': 'var(--accent-network)'
            } as React.CSSProperties
          }
        >
          <span>{activeLabel}</span>
          <span
            className="text-[0.625rem] px-1 py-0.2 rounded"
            style={{
              backgroundColor: 'var(--border-default)',
              color: 'var(--text-secondary)'
            }}
          >
            {counts[activeCategory] ?? 0}
          </span>
          <ChevronDown
            size={14}
            className="transition-transform duration-150"
            style={{
              color: 'var(--text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </button>

        {/* Dropdown popover */}
        {isOpen && (
          <div
            role="listbox"
            aria-label="Categories"
            className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border shadow-2xl overflow-hidden py-1"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-active)',
              animation: 'fade-in 0.1s ease-out both'
            }}
          >
            {GENRE_FILTERS.map((cat) => {
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-[0.75rem] font-semibold tracking-wider transition-colors duration-150 hover:bg-(--bg-surface-hover) cursor-pointer"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isSelected
                      ? 'var(--accent-network)'
                      : 'var(--text-primary)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <Check size={12} className="shrink-0" />
                    ) : (
                      <span className="w-3" />
                    )}
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className="text-[0.625rem] px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: isSelected
                        ? 'var(--accent-network)'
                        : 'var(--border-default)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)'
                    }}
                  >
                    {counts[cat.id] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <section
        aria-label="Application directory"
        className="flex flex-col gap-3 flex-1"
      >
        {filteredApps.map((app) => (
          <AppCard
            key={app.slug}
            app={app}
            expanded={expandedApp === app.slug}
            onToggle={() =>
              setExpandedApp((prev) => (prev === app.slug ? null : app.slug))
            }
          />
        ))}
      </section>
    </div>
  )
}
