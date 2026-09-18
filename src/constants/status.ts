import type { AppStatus, CtaLabel } from '@/types/registry'

// Color token per status - maps to CSS custom properties
export const STATUS_COLOR: Record<AppStatus, string> = {
  online: 'var(--status-online)',
  development: 'var(--status-development)',
  coming_soon: 'var(--status-coming-soon)',
  maintenance: 'var(--status-maintenance)',
  private: 'var(--status-coming-soon)'
}

// Display label per status - Section 7.3
export const STATUS_LABEL: Record<AppStatus, string> = {
  online: 'ONLINE',
  development: 'IN DEV',
  coming_soon: 'COMING SOON',
  maintenance: 'MAINTENANCE',
  private: 'PRIVATE'
}

// Filled dot vs outlined dot per status - Section 7.3
export const STATUS_FILLED: Record<AppStatus, boolean> = {
  online: true,
  development: true,
  coming_soon: false,
  maintenance: true,
  private: false
}

// Whether the CTA is interactive
export const CTA_DISABLED: Record<CtaLabel, boolean> = {
  'PLAY HERE': false,
  'OPEN APP': false,
  'COMING SOON': true
}
