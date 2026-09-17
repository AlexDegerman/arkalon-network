import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { RecoveryCodeDisplay } from '@/components/settings/RecoveryCodeDisplay'

describe('RecoveryCodeDisplay', () => {
  const mockCode = 'SWIFT-FALCON-4821'
  const mockWriteText = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true,
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the recovery code and instructional text', () => {
    render(<RecoveryCodeDisplay code={mockCode} />)
    expect(screen.getByText(mockCode)).toBeInTheDocument()
    expect(screen.getByText(/Save your recovery code/)).toBeInTheDocument()
    expect(screen.getByText('Format: WORD-WORD-DIGITS')).toBeInTheDocument()
  })

  it('copies code to clipboard when copy button is clicked', async () => {
    render(<RecoveryCodeDisplay code={mockCode} />)
    const copyButton = screen.getByRole('button', {
      name: 'Copy recovery code'
    })

    fireEvent.click(copyButton)

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockWriteText).toHaveBeenCalledWith(mockCode)
  })

  it('updates aria-label after successful copy and reverts after timeout', async () => {
    vi.useFakeTimers()
    render(<RecoveryCodeDisplay code={mockCode} />)

    const copyButton = screen.getByRole('button', {
      name: 'Copy recovery code'
    })

    fireEvent.click(copyButton)

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(
      screen.getByRole('button', { name: 'Copy recovery code' })
    ).toBeInTheDocument()

    vi.useRealTimers()
  })
})
