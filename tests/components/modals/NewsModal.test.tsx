import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NewsModal } from '@/components/modals/NewsModal'

vi.mock('@/constants/news', () => ({
  LATEST_NEWS: {
    id: 'v1.0-network-launch',
    date: 'September 19, 2026',
    title: 'Arkalon Network is Live!',
    notes: [
      'Unified Core Identity: Instant account provisioning.',
      'Ecosystem Directory: Centralized hub for all apps.'
    ]
  }
}))

describe('NewsModal', () => {
  const mockOnClose = vi.fn()

  it('renders the NEW TRANSMISSION heading', () => {
    render(<NewsModal onClose={mockOnClose} />)
    expect(screen.getByText('NEW TRANSMISSION')).toBeInTheDocument()
  })

  it('displays the latest news title', () => {
    render(<NewsModal onClose={mockOnClose} />)
    expect(screen.getByText('Arkalon Network is Live!')).toBeInTheDocument()
  })

  it('renders the latest news date', () => {
    render(<NewsModal onClose={mockOnClose} />)
    expect(screen.getByText('September 19, 2026')).toBeInTheDocument()
  })

  it('renders individual notes within the latest news item', () => {
    render(<NewsModal onClose={mockOnClose} />)
    expect(
      screen.getByText('Unified Core Identity: Instant account provisioning.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Ecosystem Directory: Centralized hub for all apps.')
    ).toBeInTheDocument()
  })

  it('calls onClose when the close (X) button is clicked', () => {
    render(<NewsModal onClose={mockOnClose} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the "GOT IT" button is clicked', () => {
    render(<NewsModal onClose={mockOnClose} />)
    const gotItButton = screen.getByRole('button', { name: /got it/i })
    fireEvent.click(gotItButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
