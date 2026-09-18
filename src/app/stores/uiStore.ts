'use client'
import { create } from 'zustand'

type PopupMessage = {
  id: string
  text: string
  variant: 'info' | 'success' | 'error'
}

type UiState = {
  settingsPanelOpen: boolean
  popupQueue: PopupMessage[]
  showWelcomeModal: boolean
  showNewsModal: boolean
  setSettingsPanelOpen: (open: boolean) => void
  pushPopup: (popup: Omit<PopupMessage, 'id'>) => void
  dismissPopup: (id: string) => void
  setShowWelcomeModal: (open: boolean) => void
  setShowNewsModal: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  settingsPanelOpen: false,
  popupQueue: [],
  showWelcomeModal: false,
  showNewsModal: false,
  setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),
  pushPopup: (popup) =>
    set((state) => ({
      popupQueue: [...state.popupQueue, { ...popup, id: crypto.randomUUID() }]
    })),
  dismissPopup: (id) =>
    set((state) => ({
      popupQueue: state.popupQueue.filter((p) => p.id !== id)
    })),
  setShowWelcomeModal: (open) => set({ showWelcomeModal: open }),
  setShowNewsModal: (open) => set({ showNewsModal: open })
}))
