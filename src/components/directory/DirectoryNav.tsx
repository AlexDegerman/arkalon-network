'use client'
import Link from 'next/link'
import { Newspaper, Bot, MessageSquare } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/news', label: 'NEWS', Icon: Newspaper },
  { href: '/ai', label: 'ASK AI', Icon: Bot },
  { href: '/feedback', label: 'FEEDBACK', Icon: MessageSquare }
] as const

export function DirectoryNav() {
  return (
    <div className="flex items-center gap-2">
      {NAV_ITEMS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-semibold tracking-wider transition-colors duration-150 border hover:bg-(--bg-surface-hover) cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          <Icon size={14} className="min-[420px]:hidden" />
          <span className="hidden min-[420px]:inline">{label}</span>
        </Link>
      ))}
    </div>
  )
}
