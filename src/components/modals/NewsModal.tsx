'use client'

import { X } from 'lucide-react'
import { LATEST_NEWS } from '@/constants/news'

interface NewsModalProps {
  onClose: () => void
}

export function NewsModal({ onClose }: NewsModalProps) {
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
          className="rounded-xl border shadow-2xl overflow-hidden max-h-[70svh] flex flex-col"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-active)'
          }}
        >
          <div
            className="h-1.5 w-full shrink-0"
            style={{ backgroundColor: 'var(--accent-network)' }}
          />

          <div className="px-6 pt-4 pb-1 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span
                  className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1"
                  style={{ color: 'var(--accent-network)' }}
                >
                  NEW TRANSMISSION
                </span>
                <h2
                  className="text-lg font-black leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {LATEST_NEWS.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors duration-150 cursor-pointer hover:bg-(--bg-surface-hover)"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 relative">
            <div
              className="rounded-lg p-4 border mb-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-default)'
              }}
            >
              <h3
                className="text-[10px] font-black uppercase tracking-widest mb-3"
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {LATEST_NEWS.date}
              </h3>
              <ul className="space-y-3.5">
                {LATEST_NEWS.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--accent-network)' }}
                    />
                    <p
                      className="text-[11px] font-medium leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {note}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="h-16" />
            </div>

            <div
              className="sticky bottom-0 left-0 right-0 h-20 pointer-events-none -mx-6 z-10"
              style={{
                background:
                  'linear-gradient(to top, var(--bg-surface) 0%, var(--bg-surface)/80 60%, transparent 100%)'
              }}
            />
          </div>

          <div className="px-6 pb-6 pt-1 shrink-0 z-20 relative">
            <button
              onClick={onClose}
              className="w-full py-3 sm:py-4 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all active:scale-[0.98] cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-network)',
                color: '#ffffff'
              }}
            >
              GOT IT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
