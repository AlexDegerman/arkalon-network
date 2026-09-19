'use client'

import { create } from 'zustand'

export interface BGMTrack {
  id: string
  title: string
  src: string
}

export const BGM_TRACKS: BGMTrack[] = [
  {
    id: 'deep-space',
    title: 'Deep Space Ambient',
    src: '/audio/bgm/deep-space-ambient.mp3'
  },
  {
    id: 'space-exploration',
    title: 'Space Exploration',
    src: '/audio/bgm/space-exploration.mp3'
  },
  {
    id: 'futuristic-space',
    title: 'Futuristic Space',
    src: '/audio/bgm/futuristic-space.mp3'
  }
]

let audioInstance: HTMLAudioElement | null = null
let initialized = false

function generateShuffledQueue(excludeFirst?: number): number[] {
  const indices = BGM_TRACKS.map((_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  if (indices.length > 1 && indices[0] === excludeFirst) {
    const swapIdx = Math.floor(Math.random() * (indices.length - 1)) + 1
    ;[indices[0], indices[swapIdx]] = [indices[swapIdx], indices[0]]
  }
  return indices
}

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!audioInstance) {
    audioInstance = new Audio()
    audioInstance.addEventListener('ended', () => {
      useMusicStore.getState().nextTrack()
    })
  }
  return audioInstance
}

const UNLOCK_EVENTS = ['click', 'pointerdown', 'touchend', 'keydown'] as const

function removeUnlockListeners(): void {
  if (typeof window === 'undefined') return
  UNLOCK_EVENTS.forEach((evt) => {
    window.removeEventListener(evt, tryUnlock)
  })
}

function tryUnlock(): void {
  const audio = getAudio()
  if (!audio) return
  const state = useMusicStore.getState()
  if (!state.isPlaying) return

  if (
    !audio.src ||
    !audio.src.endsWith(BGM_TRACKS[state.currentTrackIndex].src)
  ) {
    audio.src = BGM_TRACKS[state.currentTrackIndex].src
  }
  audio.volume = state.isMuted ? 0 : state.volume

  audio
    .play()
    .then(() => {
      removeUnlockListeners()
      useMusicStore.setState({ isPlaying: true })
    })
    .catch(() => {})
}

export function initBGM(): void {
  if (typeof window === 'undefined' || initialized) return
  initialized = true

  localStorage.removeItem('arkalon_bgm_paused')

  const savedMuted = localStorage.getItem('arkalon_bgm_muted') === '1'
  let savedVolume = 0.3
  const storedVol = localStorage.getItem('arkalon_bgm_volume')
  if (storedVol !== null) {
    const val = parseFloat(storedVol)
    if (!isNaN(val)) savedVolume = Math.max(0, Math.min(1, val))
  }

  const initialQueue = generateShuffledQueue()
  const randomStartIndex = initialQueue[0]

  useMusicStore.setState({
    isMuted: savedMuted,
    isPlaying: true,
    volume: savedVolume,
    queue: initialQueue,
    queueIndex: 0,
    currentTrackIndex: randomStartIndex
  })

  const audio = getAudio()
  if (!audio) return

  audio.src = BGM_TRACKS[randomStartIndex].src
  audio.volume = savedMuted ? 0 : savedVolume

  UNLOCK_EVENTS.forEach((evt) => {
    window.addEventListener(evt, tryUnlock, { passive: true })
  })

  const playPromise = audio.play()
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        removeUnlockListeners()
      })
      .catch(() => {})
  }
}

interface MusicState {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTrackIndex: number
  queue: number[]
  queueIndex: number
  setIsPlaying: (playing: boolean) => void
  setIsMuted: (muted: boolean) => void
  togglePlay: () => void
  toggleMute: () => void
  setVolume: (volume: number) => void
  nextTrack: () => void
  prevTrack: () => void
  setTrackIndex: (index: number) => void
}

export const useMusicStore = create<MusicState>((set, get) => ({
  isPlaying: true,
  isMuted: false,
  volume: 0.3,
  currentTrackIndex: 0,
  queue: [0, 1, 2],
  queueIndex: 0,

  setIsPlaying: (playing) => {
    const audio = getAudio()
    if (!audio) return
    if (playing) {
      if (
        !audio.src ||
        !audio.src.endsWith(BGM_TRACKS[get().currentTrackIndex].src)
      ) {
        audio.src = BGM_TRACKS[get().currentTrackIndex].src
      }
      audio.volume = get().isMuted ? 0 : get().volume
      audio.play().catch(() => set({ isPlaying: false }))
      if (typeof window !== 'undefined')
        localStorage.removeItem('arkalon_bgm_paused')
    } else {
      audio.pause()
      if (typeof window !== 'undefined')
        localStorage.setItem('arkalon_bgm_paused', '1')
    }
    set({ isPlaying: playing })
  },

  setIsMuted: (muted) => {
    const audio = getAudio()
    if (audio) audio.volume = muted ? 0 : get().volume
    if (typeof window !== 'undefined') {
      localStorage.setItem('arkalon_bgm_muted', muted ? '1' : '0')
    }
    set({ isMuted: muted })
  },

  togglePlay: () => {
    const audio = getAudio()
    if (!audio) return
    const isCurrentlyPlaying = get().isPlaying && !audio.paused
    const nextState = !isCurrentlyPlaying
    if (nextState) {
      if (
        !audio.src ||
        !audio.src.endsWith(BGM_TRACKS[get().currentTrackIndex].src)
      ) {
        audio.src = BGM_TRACKS[get().currentTrackIndex].src
      }
      audio.volume = get().isMuted ? 0 : get().volume
      audio.play().catch(() => set({ isPlaying: false }))
    } else {
      audio.pause()
      removeUnlockListeners()
    }
    set({ isPlaying: nextState })
  },

  toggleMute: () => {
    const nextMuted = !get().isMuted
    const audio = getAudio()
    if (audio) audio.volume = nextMuted ? 0 : get().volume
    if (typeof window !== 'undefined') {
      localStorage.setItem('arkalon_bgm_muted', nextMuted ? '1' : '0')
    }
    set({ isMuted: nextMuted })
  },

  setVolume: (vol) => {
    const clamped = Math.max(0, Math.min(1, vol))
    const audio = getAudio()
    if (audio) audio.volume = get().isMuted ? 0 : clamped
    if (typeof window !== 'undefined') {
      localStorage.setItem('arkalon_bgm_volume', clamped.toString())
    }
    set({ volume: clamped })
  },

  nextTrack: () => {
    const { queue, queueIndex } = get()
    let newQueue = queue
    let newQueueIndex = queueIndex + 1

    if (newQueueIndex >= queue.length) {
      const lastTrack = queue[queue.length - 1]
      newQueue = generateShuffledQueue(lastTrack)
      newQueueIndex = 0
    }

    const nextTrackIdx = newQueue[newQueueIndex]
    const audio = getAudio()
    if (audio) {
      audio.src = BGM_TRACKS[nextTrackIdx].src
      if (get().isPlaying) {
        audio.volume = get().isMuted ? 0 : get().volume
        audio.play().catch(() => set({ isPlaying: false }))
      }
    }

    set({
      queue: newQueue,
      queueIndex: newQueueIndex,
      currentTrackIndex: nextTrackIdx
    })
  },

  prevTrack: () => {
    const { queue, queueIndex } = get()
    let newQueueIndex = queueIndex - 1
    if (newQueueIndex < 0) {
      newQueueIndex = queue.length - 1
    }

    const prevTrackIdx = queue[newQueueIndex]
    const audio = getAudio()
    if (audio) {
      audio.src = BGM_TRACKS[prevTrackIdx].src
      if (get().isPlaying) {
        audio.volume = get().isMuted ? 0 : get().volume
        audio.play().catch(() => set({ isPlaying: false }))
      }
    }

    set({
      queueIndex: newQueueIndex,
      currentTrackIndex: prevTrackIdx
    })
  },

  setTrackIndex: (index) => {
    const audio = getAudio()
    if (audio) {
      audio.src = BGM_TRACKS[index].src
      if (get().isPlaying) {
        audio.volume = get().isMuted ? 0 : get().volume
        audio.play().catch(() => set({ isPlaying: false }))
      }
    }
    set({ currentTrackIndex: index })
  }
}))