import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RecoveryCodeEntry } from '@/components/settings/RecoveryCodeEntry'
import { restoreCoreIdentityAction } from '@/app/actions/restoreCoreIdentity'

vi.mock('@/app/actions/restoreCoreIdentity', () => ({
  restoreCoreIdentityAction: vi.fn()
}))

describe('RecoveryCodeEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders input and restore button', () => {
    render(<RecoveryCodeEntry />)
    expect(screen.getByLabelText('Recovery code')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Restore Identity' })
    ).toBeInTheDocument()
  })

  it('converts input to lowercase automatically', () => {
    render(<RecoveryCodeEntry />)
    const input = screen.getByLabelText('Recovery code')
    fireEvent.change(input, { target: { value: 'SWIFT-FALCON-4821' } })
    expect(input).toHaveValue('swift-falcon-4821')
  })

  it('disables restore button when input is empty', () => {
    render(<RecoveryCodeEntry />)
    const button = screen.getByRole('button', { name: 'Restore Identity' })
    expect(button).toBeDisabled()
  })

  it('enables restore button when input has value', () => {
    render(<RecoveryCodeEntry />)
    const input = screen.getByLabelText('Recovery code')
    fireEvent.change(input, { target: { value: 'swift-falcon-4821' } })
    const button = screen.getByRole('button', { name: 'Restore Identity' })
    expect(button).not.toBeDisabled()
  })

  it('submits form when Enter key is pressed', async () => {
    vi.mocked(restoreCoreIdentityAction).mockResolvedValue({
      status: 'restored'
    })
    render(<RecoveryCodeEntry />)
    const input = screen.getByLabelText('Recovery code')
    fireEvent.change(input, { target: { value: 'swift-falcon-4821' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(restoreCoreIdentityAction).toHaveBeenCalledWith(
        'swift-falcon-4821'
      )
    })
  })

  it('shows error message when code is not found', async () => {
    vi.mocked(restoreCoreIdentityAction).mockResolvedValue({
      status: 'not_found'
    })
    render(<RecoveryCodeEntry />)
    const input = screen.getByLabelText('Recovery code')
    fireEvent.change(input, { target: { value: 'invalid-code-0000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Restore Identity' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Recovery code not recognised. Check for typos and try again.'
      )
    })
  })

  it('shows error message when rate limited', async () => {
    vi.mocked(restoreCoreIdentityAction).mockResolvedValue({
      status: 'rate_limited'
    })
    render(<RecoveryCodeEntry />)
    const input = screen.getByLabelText('Recovery code')
    fireEvent.change(input, { target: { value: 'swift-falcon-4821' } })
    fireEvent.click(screen.getByRole('button', { name: 'Restore Identity' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Too many attempts. Please wait before trying again.'
      )
    })
  })

  it('shows success message and clears input when restored', async () => {
    vi.mocked(restoreCoreIdentityAction).mockResolvedValue({
      status: 'restored'
    })
    render(<RecoveryCodeEntry />)
    const input = screen.getByLabelText('Recovery code')
    fireEvent.change(input, { target: { value: 'swift-falcon-4821' } })
    fireEvent.click(screen.getByRole('button', { name: 'Restore Identity' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Identity restored. Your Arkalon Core ID is now active on this device.'
      )
      expect(input).toHaveValue('')
    })
  })

  it('calls onRestored callback when successfully restored', async () => {
    vi.mocked(restoreCoreIdentityAction).mockResolvedValue({
      status: 'restored'
    })
    const onRestored = vi.fn()
    render(<RecoveryCodeEntry onRestored={onRestored} />)
    const input = screen.getByLabelText('Recovery code')
    fireEvent.change(input, { target: { value: 'swift-falcon-4821' } })
    fireEvent.click(screen.getByRole('button', { name: 'Restore Identity' }))

    await waitFor(() => {
      expect(onRestored).toHaveBeenCalled()
    })
  })
})
