import type { CtaLabel } from '@/lib/registry/types'
import { CTA_DISABLED } from '@/constants/status'

type Props = {
  label: CtaLabel
  route: string
}

export function CtaButton({ label, route }: Props) {
  const disabled = CTA_DISABLED[label]

  return (
    <a
      href={disabled ? undefined : route}
      target={disabled ? undefined : '_blank'}
      rel="noopener noreferrer"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className="inline-flex items-center justify-center px-6 py-2 rounded text-[0.875rem] font-semibold tracking-wider transition-colors duration-150"
      style={
        disabled
          ? {
              backgroundColor: 'var(--border-default)',
              color: 'var(--text-muted)',
              cursor: 'not-allowed',
              pointerEvents: 'none'
            }
          : {
              backgroundColor: 'var(--accent-network)',
              color: '#ffffff'
            }
      }
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLElement).style.backgroundColor =
            'var(--accent-network-dim)'
      }}
      onMouseLeave={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLElement).style.backgroundColor =
            'var(--accent-network)'
      }}
    >
      {label}
    </a>
  )
}
