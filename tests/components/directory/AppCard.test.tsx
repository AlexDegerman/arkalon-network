import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppCard } from '@/components/directory/AppCard'
import type { ArkalonApp } from '@/lib/registry/types'

vi.mock('@/components/directory/StatusBadge', () => ({
  StatusBadge: ({ status }: any) => (
    <span data-testid="status-badge">{status}</span>
  )
}))

vi.mock('@/components/directory/PreviewMedia', () => ({
  PreviewMedia: ({ url, appName }: any) => (
    <div data-testid="preview-media">{appName}</div>
  )
}))

vi.mock('@/components/directory/ComingSoonPlaceholder', () => ({
  ComingSoonPlaceholder: ({ appName }: any) => (
    <div data-testid="coming-soon">{appName}</div>
  )
}))

vi.mock('@/components/directory/CtaButton', () => ({
  CtaButton: ({ label, route }: any) => (
    <a data-testid="cta-button" href={route}>
      {label}
    </a>
  )
}))

vi.mock('@/components/directory/HypeSelector', () => ({
  HypeSelector: ({ appSlug }: any) => (
    <div data-testid="hype-selector">{appSlug}</div>
  )
}))

const mockApp: ArkalonApp = {
  slug: 'rps',
  name: 'RPS League',
  shortDescription: 'Live-service Rock Paper Scissors predicting platform.',
  extendedDescription: 'Extended description here.',
  status: 'online',
  categories: ['prediction', 'competitive'],
  previewMediaUrl: '/video.mp4',
  route: 'https://rpsleague.fi',
  ctaLabel: 'PLAY HERE',
  public: true
}

describe('AppCard', () => {
  it('renders app name, short description, and status badge', () => {
    render(<AppCard app={mockApp} expanded={false} onToggle={vi.fn()} />)
    expect(screen.getByText('RPS LEAGUE')).toBeInTheDocument()
    expect(
      screen.getByText('Live-service Rock Paper Scissors predicting platform.')
    ).toBeInTheDocument()
    expect(screen.getByTestId('status-badge')).toHaveTextContent('online')
  })

  it('applies title style class based on app slug', () => {
    render(<AppCard app={mockApp} expanded={false} onToggle={vi.fn()} />)
    const title = screen.getByText('RPS LEAGUE')
    expect(title).toHaveClass('title-rps')
  })

  it('calls onToggle when the card header is clicked', () => {
    const onToggle = vi.fn()
    render(<AppCard app={mockApp} expanded={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByText('RPS LEAGUE').closest('button')!)
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('does not render expanded content when expanded is false', () => {
    render(<AppCard app={mockApp} expanded={false} onToggle={vi.fn()} />)
    expect(screen.queryByTestId('cta-button')).not.toBeInTheDocument()
    expect(screen.queryByTestId('hype-selector')).not.toBeInTheDocument()
  })

  it('renders expanded content when expanded is true', () => {
    render(<AppCard app={mockApp} expanded={true} onToggle={vi.fn()} />)
    expect(screen.getByTestId('cta-button')).toHaveAttribute(
      'href',
      'https://rpsleague.fi'
    )
    expect(screen.getByTestId('cta-button')).toHaveTextContent('PLAY HERE')
    expect(screen.getByTestId('hype-selector')).toHaveTextContent('rps')
    expect(screen.getByTestId('preview-media')).toBeInTheDocument()
    expect(screen.getByText('Extended description here.')).toBeInTheDocument()
  })

  it('renders ComingSoonPlaceholder for coming_soon status instead of media', () => {
    const comingSoonApp: ArkalonApp = {
      ...mockApp,
      status: 'coming_soon',
      previewMediaUrl: undefined
    }
    render(<AppCard app={comingSoonApp} expanded={true} onToggle={vi.fn()} />)
    expect(screen.getByTestId('coming-soon')).toBeInTheDocument()
    expect(screen.queryByTestId('preview-media')).not.toBeInTheDocument()
  })

  it('renders ComingSoonPlaceholder for development status', () => {
    const devApp: ArkalonApp = {
      ...mockApp,
      status: 'development',
      previewMediaUrl: undefined
    }
    render(<AppCard app={devApp} expanded={true} onToggle={vi.fn()} />)
    expect(screen.getByTestId('coming-soon')).toBeInTheDocument()
  })
})
