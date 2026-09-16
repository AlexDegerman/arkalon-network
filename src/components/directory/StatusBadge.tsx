import type { AppStatus } from '@/lib/registry/types'
import { STATUS_COLOR, STATUS_FILLED, STATUS_LABEL } from '@/constants/status'

type Props = {
  status: AppStatus
}

export function StatusBadge({ status }: Props) {
  const color = STATUS_COLOR[status]
  const label = STATUS_LABEL[status]
  const filled = STATUS_FILLED[status]

  return (
    <span
      className="inline-flex items-center gap-1.5 shrink-0"
      aria-label={`Status: ${label}`}
    >
      {/* Dot indicator */}
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={
          filled
            ? { backgroundColor: color }
            : {
                border: `1.5px solid ${color}`,
                backgroundColor: 'transparent'
              }
        }
        aria-hidden="true"
      />
      {/* Label */}
      <span
        className="text-[0.6875rem] font-semibold leading-none tracking-wide"
        style={{
          color,
          fontFamily: "'JetBrains Mono', monospace"
        }}
      >
        {label}
      </span>
    </span>
  )
}
