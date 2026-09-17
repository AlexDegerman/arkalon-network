import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUiStore } from '@/app/stores/uiStore'

let idCounter = 0
vi.spyOn(crypto, 'randomUUID').mockImplementation(
  () => `mock-uuid-${idCounter++}`
)

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      settingsPanelOpen: false,
      popupQueue: []
    })
    idCounter = 0
  })

  it('initializes with default state', () => {
    const state = useUiStore.getState()
    expect(state.settingsPanelOpen).toBe(false)
    expect(state.popupQueue).toEqual([])
  })

  it('toggles settings panel open state', () => {
    useUiStore.getState().setSettingsPanelOpen(true)
    expect(useUiStore.getState().settingsPanelOpen).toBe(true)

    useUiStore.getState().setSettingsPanelOpen(false)
    expect(useUiStore.getState().settingsPanelOpen).toBe(false)
  })

  it('pushes a new popup to the queue with a generated id', () => {
    const newPopup = { text: 'Test message', variant: 'info' as const }
    useUiStore.getState().pushPopup(newPopup)

    const state = useUiStore.getState()
    expect(state.popupQueue).toHaveLength(1)
    expect(state.popupQueue[0]).toEqual({
      id: 'mock-uuid-0',
      text: 'Test message',
      variant: 'info'
    })
  })

  it('appends multiple popups to the queue', () => {
    useUiStore.getState().pushPopup({ text: 'First', variant: 'success' })
    useUiStore.getState().pushPopup({ text: 'Second', variant: 'error' })

    expect(useUiStore.getState().popupQueue).toHaveLength(2)
  })

  it('dismisses a specific popup by id', () => {
    useUiStore.getState().pushPopup({ text: 'First', variant: 'info' })
    useUiStore.getState().pushPopup({ text: 'Second', variant: 'info' })

    const firstId = useUiStore.getState().popupQueue[0].id
    useUiStore.getState().dismissPopup(firstId)

    expect(useUiStore.getState().popupQueue).toHaveLength(1)
    expect(useUiStore.getState().popupQueue[0].text).toBe('Second')
  })

  it('does nothing when dismissing a non-existent id', () => {
    useUiStore.getState().pushPopup({ text: 'Test', variant: 'info' })
    useUiStore.getState().dismissPopup('non-existent-id')

    expect(useUiStore.getState().popupQueue).toHaveLength(1)
  })
})
