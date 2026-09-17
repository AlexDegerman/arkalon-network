import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HypeSelector } from '@/components/directory/HypeSelector'
import { getAppInterestAction } from '@/app/actions/getAppInterest'
import { submitAppInterestAction } from '@/app/actions/submitAppInterest'

vi.mock('@/app/actions/getAppInterest', () => ({
  getAppInterestAction: vi.fn()
}))

vi.mock('@/app/actions/submitAppInterest', () => ({
  submitAppInterestAction: vi.fn()
}))

describe('HypeSelector', () => {
  const mockAppSlug = 'rps'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getAppInterestAction).mockResolvedValue({
      status: 'success',
      vote: null
    })
    vi.mocked(submitAppInterestAction).mockResolvedValue({ status: 'success' })
  })

  it('renders loading placeholder while fetching initial state', () => {
    vi.mocked(getAppInterestAction).mockImplementation(
      () => new Promise(() => {})
    )
    render(<HypeSelector appSlug={mockAppSlug} />)
    expect(screen.queryByText('HYPED')).not.toBeInTheDocument()
    expect(screen.queryByText('NOT INTERESTED')).not.toBeInTheDocument()
  })

  it('renders both vote buttons after loading', async () => {
    render(<HypeSelector appSlug={mockAppSlug} />)
    await waitFor(() => {
      expect(screen.getByText('HYPED')).toBeInTheDocument()
      expect(screen.getByText('NOT INTERESTED')).toBeInTheDocument()
    })
  })

  it('fetches current vote on mount', async () => {
    render(<HypeSelector appSlug={mockAppSlug} />)
    await waitFor(() => {
      expect(getAppInterestAction).toHaveBeenCalledWith(mockAppSlug)
    })
  })

  it('submits hyped vote when HYPED button is clicked', async () => {
    render(<HypeSelector appSlug={mockAppSlug} />)
    await waitFor(() => expect(screen.getByText('HYPED')).toBeInTheDocument())

    fireEvent.click(screen.getByText('HYPED'))

    await waitFor(() => {
      expect(submitAppInterestAction).toHaveBeenCalledWith(mockAppSlug, 'hyped')
    })
  })

  it('submits not_interested vote when NOT INTERESTED button is clicked', async () => {
    render(<HypeSelector appSlug={mockAppSlug} />)
    await waitFor(() =>
      expect(screen.getByText('NOT INTERESTED')).toBeInTheDocument()
    )

    fireEvent.click(screen.getByText('NOT INTERESTED'))

    await waitFor(() => {
      expect(submitAppInterestAction).toHaveBeenCalledWith(
        mockAppSlug,
        'not_interested'
      )
    })
  })

  it('toggles off active vote when clicking the same button again', async () => {
    vi.mocked(getAppInterestAction).mockResolvedValue({
      status: 'success',
      vote: 'hyped'
    })
    render(<HypeSelector appSlug={mockAppSlug} />)
    await waitFor(() => expect(screen.getByText('HYPED')).toBeInTheDocument())

    fireEvent.click(screen.getByText('HYPED'))

    await waitFor(() => {
      expect(submitAppInterestAction).toHaveBeenCalledWith(mockAppSlug, null)
    })
  })

  it('disables buttons during pending submission', async () => {
    vi.mocked(submitAppInterestAction).mockImplementation(
      () => new Promise(() => {})
    )
    render(<HypeSelector appSlug={mockAppSlug} />)
    await waitFor(() => expect(screen.getByText('HYPED')).toBeInTheDocument())

    fireEvent.click(screen.getByText('HYPED'))

    await waitFor(() => {
      expect(screen.getByText('HYPED').closest('button')).toBeDisabled()
      expect(
        screen.getByText('NOT INTERESTED').closest('button')
      ).toBeDisabled()
    })
  })

  it('reverts optimistic update when submission fails', async () => {
    vi.mocked(submitAppInterestAction).mockResolvedValue({
      status: 'error'
    })
    render(<HypeSelector appSlug={mockAppSlug} />)
    await waitFor(() => expect(screen.getByText('HYPED')).toBeInTheDocument())

    fireEvent.click(screen.getByText('HYPED'))

    await waitFor(() => {
      expect(submitAppInterestAction).toHaveBeenCalledWith(mockAppSlug, 'hyped')
    })

    await waitFor(() => {
      const hypedButton = screen.getByText('HYPED').closest('button')
      expect(hypedButton).not.toHaveStyle({
        backgroundColor: 'var(--status-online)'
      })
    })
  })
})
