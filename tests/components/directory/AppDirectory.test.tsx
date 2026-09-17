import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppDirectory } from '@/components/directory/AppDirectory'

vi.mock('@/components/directory/AppCard', () => ({
  AppCard: ({ app, expanded, onToggle }: any) => (
    <div data-testid={`app-card-${app.slug}`} data-expanded={!!expanded}>
      <button onClick={onToggle}>Toggle {app.name}</button>
    </div>
  )
}))

describe('AppDirectory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders public apps from the registry', () => {
    render(<AppDirectory />)
    expect(screen.getByTestId('app-card-rps')).toBeInTheDocument()
    expect(screen.getByTestId('app-card-daily')).toBeInTheDocument()
    expect(screen.getByTestId('app-card-labs')).toBeInTheDocument()
  })

  it('expands only one app card at a time', () => {
    render(<AppDirectory />)
    const rpsCard = screen.getByTestId('app-card-rps')
    const dailyCard = screen.getByTestId('app-card-daily')

    expect(rpsCard).toHaveAttribute('data-expanded', 'false')
    expect(dailyCard).toHaveAttribute('data-expanded', 'false')

    fireEvent.click(screen.getByText('Toggle RPS League'))
    expect(rpsCard).toHaveAttribute('data-expanded', 'true')
    expect(dailyCard).toHaveAttribute('data-expanded', 'false')

    fireEvent.click(screen.getByText('Toggle Arkalon Daily'))
    expect(rpsCard).toHaveAttribute('data-expanded', 'false')
    expect(dailyCard).toHaveAttribute('data-expanded', 'true')
  })

  it('collapses an app card when clicked while already expanded', () => {
    render(<AppDirectory />)
    const rpsCard = screen.getByTestId('app-card-rps')

    fireEvent.click(screen.getByText('Toggle RPS League'))
    expect(rpsCard).toHaveAttribute('data-expanded', 'true')

    fireEvent.click(screen.getByText('Toggle RPS League'))
    expect(rpsCard).toHaveAttribute('data-expanded', 'false')
  })

  it('toggles the category filter dropdown', () => {
    render(<AppDirectory />)
    const filterButton = screen.getByRole('button', {
      name: 'Filter applications'
    })

    expect(filterButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(filterButton)
    expect(filterButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(filterButton)
    expect(filterButton).toHaveAttribute('aria-expanded', 'false')
  })
})
