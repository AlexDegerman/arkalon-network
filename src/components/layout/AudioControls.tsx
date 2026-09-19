'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react'
import { useMusicStore, BGM_TRACKS, initBGM } from '@/app/stores/musicStore'

export function AudioControls() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initBGM()
  }, [])

  const isPlaying = useMusicStore((s) => s.isPlaying)
  const isMuted = useMusicStore((s) => s.isMuted)
  const volume = useMusicStore((s) => s.volume)
  const currentTrackIndex = useMusicStore((s) => s.currentTrackIndex)
  const togglePlay = useMusicStore((s) => s.togglePlay)
  const toggleMute = useMusicStore((s) => s.toggleMute)
  const setVolume = useMusicStore((s) => s.setVolume)
  const nextTrack = useMusicStore((s) => s.nextTrack)
  const prevTrack = useMusicStore((s) => s.prevTrack)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentTrack = BGM_TRACKS[currentTrackIndex]

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Audio controls"
        className="p-1.5 sm:p-2 rounded-md transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-(--text-primary) hover:bg-(--bg-surface) cursor-pointer"
        style={
          {
            color:
              isPlaying && !isMuted
                ? 'var(--accent-network)'
                : 'var(--text-muted)',
            '--tw-outline-color': 'var(--accent-network)'
          } as React.CSSProperties
        }
      >
        {isMuted || !isPlaying ? (
          <VolumeX size={17} />
        ) : volume < 0.5 ? (
          <Volume1 size={17} />
        ) : (
          <Volume2 size={17} />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-xl border shadow-2xl p-4 flex flex-col gap-3 z-50 animate-[fade-in_0.15s_ease-out_both]"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-active)'
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              BACKGROUND MUSIC
            </span>
            <span
              className="text-[10px] font-bold font-mono"
              style={{
                color:
                  isPlaying && !isMuted
                    ? 'var(--status-online)'
                    : 'var(--text-muted)'
              }}
            >
              {isPlaying && !isMuted ? 'PLAYING' : 'MUTED'}
            </span>
          </div>

          <div
            className="flex items-center justify-between gap-2 p-2.5 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-default)'
            }}
          >
            <button
              type="button"
              onClick={prevTrack}
              aria-label="Previous track"
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <SkipBack size={13} />
            </button>

            <div className="flex-1 min-w-0 text-center">
              <p
                className="text-[11px] font-bold tracking-wide truncate"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {currentTrack.title}
              </p>
              <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                Track {currentTrackIndex + 1} of {BGM_TRACKS.length}
              </p>
            </div>

            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next track"
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="flex-1 py-1.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              style={{
                backgroundColor: isPlaying
                  ? 'var(--bg-primary)'
                  : 'var(--accent-network)',
                border: isPlaying ? '1px solid var(--border-default)' : 'none',
                color: '#ffffff'
              }}
            >
              {isPlaying ? (
                <>
                  <Pause size={12} />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play size={12} fill="currentColor" />
                  <span>PLAY</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="px-3 py-1.5 rounded-md text-xs font-bold border transition-all cursor-pointer flex items-center gap-1"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: isMuted
                  ? 'var(--status-maintenance)'
                  : 'var(--border-default)',
                color: isMuted
                  ? 'var(--status-maintenance)'
                  : 'var(--text-secondary)'
              }}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-1 pt-1">
            <div
              className="flex items-center justify-between text-[10px] font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>VOLUME</span>
              <span>{isMuted ? '0%' : `${Math.round(volume * 100)}%`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setVolume(val)
                if (isMuted && val > 0) toggleMute()
              }}
              aria-label="Volume slider"
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
