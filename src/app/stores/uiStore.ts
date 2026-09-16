'use client'

import { create } from 'zustand'

type ModalType = 'settings' | 'recovery-entry' | null

type PopupMessage = {
  id: string
  text: string
  variant: 'info' | 'success' | 'error'
}

type UiState = {
  activeModal: ModalType
  settingsPanelOpen: boolean
  popupQueue: PopupMessage[]
  openModal: (modal: Exclude<ModalType, null>) => void
  closeModal: () => void
  setSettingsPanelOpen: (open: boolean) => void
  pushPopup: (popup: Omit<PopupMessage, 'id'>) => void
  dismissPopup: (id: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  settingsPanelOpen: false,
  popupQueue: [],

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),

  setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),

  pushPopup: (popup) =>
    set((state) => ({
      popupQueue: [...state.popupQueue, { ...popup, id: crypto.randomUUID() }]
    })),

  dismissPopup: (id) =>
    set((state) => ({
      popupQueue: state.popupQueue.filter((p) => p.id !== id)
    }))
}))
