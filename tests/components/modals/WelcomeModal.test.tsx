import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WelcomeModal } from '@/components/modals/WelcomeModal'

const mockSetShowWelcomeModal = vi.fn()
let mockShowWelcomeModal = true

vi.mock('@/app/stores/uiStore', () => ({
  useUiStore: (selector: (s: any) => any) =>
    selector({
      showWelcomeModal: mockShowWelcomeModal,
      setShowWelcomeModal: mockSetShowWelcomeModal
    })
}))

const mockValidateSessionAction = vi.fn()
vi.mock('@/app/actions/validateSession', () => ({
  validateSessionAction: (...args: any[]) => mockValidateSessionAction(...args)
}))

const mockRerollNicknameAction = vi.fn()
vi.mock('@/app/actions/rerollNickname', () => ({
  rerollNicknameAction: (...args: any[]) => mockRerollNicknameAction(...args)
}))

describe('WelcomeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockShowWelcomeModal = true
    mockValidateSessionAction.mockResolvedValue({
      valid: true,
      nickname: 'brave-fox-ember',
      shortId: 'abc123'
    })
    mockRerollNicknameAction.mockResolvedValue({
      status: 'success',
      nickname: 'calm-owl-frost'
    })
  })

  it('renders nothing when showWelcomeModal is false', () => {
    mockShowWelcomeModal = false
    const { container } = render(<WelcomeModal />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the modal when showWelcomeModal is true', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(screen.getByText('brave-fox-ember')).toBeInTheDocument()
    })
  })

  it('calls validateSessionAction on mount', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(mockValidateSessionAction).toHaveBeenCalledTimes(1)
    })
  })

  it('displays the provisioned nickname', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(screen.getByText('brave-fox-ember')).toBeInTheDocument()
    })
  })

  it('renders a reroll button', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /reroll/i })
      ).toBeInTheDocument()
    })
  })

  it('calls rerollNicknameAction and updates nickname on reroll click', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(screen.getByText('brave-fox-ember')).toBeInTheDocument()
    })

    const rerollButton = screen.getByRole('button', { name: /reroll/i })
    fireEvent.click(rerollButton)

    await waitFor(() => {
      expect(mockRerollNicknameAction).toHaveBeenCalledTimes(1)
      expect(screen.getByText('calm-owl-frost')).toBeInTheDocument()
    })
  })

  it('renders an enter button', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /enter the network/i })
      ).toBeInTheDocument()
    })
  })

  it('dismisses modal when enter button is clicked', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /enter the network/i })
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /enter the network/i }))
    expect(mockSetShowWelcomeModal).toHaveBeenCalledWith(false)
  })

  it('mentions recovery code information', async () => {
    render(<WelcomeModal />)
    await waitFor(() => {
      expect(screen.getByText(/recovery code/i)).toBeInTheDocument()
    })
  })
})
