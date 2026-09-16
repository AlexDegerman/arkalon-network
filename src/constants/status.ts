import type { AppStatus, CtaLabel } from '@/lib/registry/types'

// CSS custom property name per status - used by StatusBadge
export const STATUS_COLOR: Record<AppStatus, string> = {
  online: 'var(--status-online)',
  development: 'var(--status-development)',
  coming_soon: 'var(--status-coming-soon)',
  maintenance: 'var(--status-maintenance)',
  private: 'var(--status-coming-soon)'
}

// Display label per status
export const STATUS_LABEL: Record<AppStatus, string> = {
  online: 'ONLINE',
  development: 'IN DEV',
  coming_soon: 'COMING SOON',
  maintenance: 'MAINTENANCE',
  private: 'PRIVATE'
}

// Whether the status dot is filled or outlined
export const STATUS_FILLED: Record<AppStatus, boolean> = {
  online: true,
  development: true,
  coming_soon: false,
  maintenance: true,
  private: false
}

// Whether the CTA button should be disabled
export const CTA_DISABLED: Record<CtaLabel, boolean> = {
  'PLAY HERE': false,
  'OPEN APP': false,
  'COMING SOON': true
}
