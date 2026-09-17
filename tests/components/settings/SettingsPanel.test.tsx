import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { useUiStore } from '@/app/stores/uiStore'
import { validateSessionAction } from '@/app/actions/validateSession'
import { createCoreIdentityAction } from '@/app/actions/createCoreIdentity'

vi.mock('@/app/actions/validateSession', () => ({
  validateSessionAction: vi.fn()
}))

vi.mock('@/app/actions/createCoreIdentity', () => ({
  createCoreIdentityAction: vi.fn()
}))

vi.mock('@/components/settings/RecoveryCodeEntry', () => ({
  RecoveryCodeEntry: ({ onRestored }: any) => (
    <div data-testid="recovery-code-entry">
      <button onClick={onRestored}>Restore</button>
    </div>
  )
}))

describe('SettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useUiStore.setState({ settingsPanelOpen: false })
    vi.mocked(validateSessionAction).mockResolvedValue({ valid: false })
    vi.mocked(createCoreIdentityAction).mockResolvedValue({
      status: 'created',
      coreId: '123e4567-e89b-12d3-a456-426614174000',
      shortId: 'Short123',
      nickname: 'TestNickname',
      recoveryCode: 'TEST-CODE-1234'
    })
  })

  it('does not render when settingsPanelOpen is false', () => {
    render(<SettingsPanel />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when settingsPanelOpen is true', async () => {
    useUiStore.setState({ settingsPanelOpen: true })
    render(<SettingsPanel />)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('closes panel when Escape key is pressed', async () => {
    useUiStore.setState({ settingsPanelOpen: true })
    render(<SettingsPanel />)
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(useUiStore.getState().settingsPanelOpen).toBe(false)
  })

  it('closes panel when close button is clicked', async () => {
    useUiStore.setState({ settingsPanelOpen: true })
    render(<SettingsPanel />)
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    fireEvent.click(screen.getByLabelText('Close settings'))

    expect(useUiStore.getState().settingsPanelOpen).toBe(false)
  })

  it('switches between identity and restore tabs', async () => {
    useUiStore.setState({ settingsPanelOpen: true })
    render(<SettingsPanel />)

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())

    const restoreTab = screen.getByRole('tab', { name: 'RESTORE' })
    const identityTab = screen.getByRole('tab', { name: 'RECOVERY ACCESS' })

    expect(identityTab).toHaveAttribute('aria-selected', 'true')
    expect(restoreTab).toHaveAttribute('aria-selected', 'false')

    fireEvent.click(restoreTab)
    expect(restoreTab).toHaveAttribute('aria-selected', 'true')
    expect(identityTab).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByTestId('recovery-code-entry')).toBeInTheDocument()

    fireEvent.click(identityTab)
    expect(identityTab).toHaveAttribute('aria-selected', 'true')
    expect(restoreTab).toHaveAttribute('aria-selected', 'false')
  })

  it('focuses the close button when opened', async () => {
    useUiStore.setState({ settingsPanelOpen: true })
    render(<SettingsPanel />)

    await waitFor(() =>
      expect(screen.getByLabelText('Close settings')).toBeInTheDocument()
    )

    expect(document.activeElement).toBe(screen.getByLabelText('Close settings'))
  })
})
