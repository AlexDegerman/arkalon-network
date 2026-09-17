import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '@/components/layout/Header'
import { useUiStore } from '@/app/stores/uiStore'

vi.mock('@/components/settings/SettingsPanel', () => ({
  SettingsPanel: () => <div data-testid="settings-panel" />
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useUiStore.setState({ settingsPanelOpen: false })
  })

  it('renders the network title and subtitle', () => {
    render(<Header />)
    expect(screen.getByText('ARKALON NETWORK')).toBeInTheDocument()
    expect(
      screen.getByText('The Arkalon application ecosystem.')
    ).toBeInTheDocument()
  })

  it('renders the settings toggle button', () => {
    render(<Header />)
    expect(
      screen.getByRole('button', { name: 'Open settings' })
    ).toBeInTheDocument()
  })

  it('opens the settings panel when the settings button is clicked', () => {
    render(<Header />)
    const settingsButton = screen.getByRole('button', { name: 'Open settings' })

    expect(useUiStore.getState().settingsPanelOpen).toBe(false)

    fireEvent.click(settingsButton)

    expect(useUiStore.getState().settingsPanelOpen).toBe(true)
  })

  it('renders the settings panel component', () => {
    render(<Header />)
    expect(screen.getByTestId('settings-panel')).toBeInTheDocument()
  })
})
