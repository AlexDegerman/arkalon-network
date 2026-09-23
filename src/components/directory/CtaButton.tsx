import { CTA_DISABLED } from '@/constants/status'
import { CtaLabel } from '@/types/registry'

type Props = {
  label: CtaLabel
  route: string
  onClick?: () => void
}

export function CtaButton({ label, route, onClick }: Props) {
  const disabled = CTA_DISABLED[label]

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex items-center justify-center px-6 py-2 rounded text-[0.875rem] font-semibold tracking-wider cursor-not-allowed"
        style={{
          backgroundColor: 'var(--border-default)',
          color: 'var(--text-muted)'
        }}
      >
        {label}
      </span>
    )
  }

  return (
    <a
      href={route}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="inline-flex items-center justify-center px-6 py-2 rounded text-[0.875rem] font-semibold tracking-wider transition-colors duration-150 hover:bg-(--accent-network-dim)"
      style={{
        backgroundColor: 'var(--accent-network)',
        color: '#ffffff'
      }}
    >
      {label}
    </a>
  )
}
