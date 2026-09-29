'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useMusicStore } from '@/app/stores/musicStore'

type Props = {
  url: string
  appName: string
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PreviewMedia({ url, appName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const bgmInterruptedByVideo = useRef(false)

  useEffect(() => {
    return () => {
      if (bgmInterruptedByVideo.current) {
        useMusicStore.getState().setIsPlaying(true)
        bgmInterruptedByVideo.current = false
      }
    }
  }, [])

  // Track fullscreen state changes (e.g. user presses Escape)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [])

  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return

    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)

    const musicState = useMusicStore.getState()

    if (!nextMuted) {
      if (musicState.isPlaying && !musicState.isMuted) {
        bgmInterruptedByVideo.current = true
        musicState.setIsPlaying(false)
      }
    } else {
      if (bgmInterruptedByVideo.current) {
        useMusicStore.getState().setIsPlaying(true)
        bgmInterruptedByVideo.current = false
      }
    }
  }, [])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {})
      } else if (
        (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void })
          .webkitEnterFullscreen
      ) {
        ;(video as HTMLVideoElement & { webkitEnterFullscreen?: () => void })
          .webkitEnterFullscreen!()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className={`relative w-40 sm:w-52 aspect-320/670 max-w-full overflow-hidden rounded-xl border shadow-xl cursor-pointer group select-none bg-black ${
        isFullscreen
          ? 'w-full h-full max-w-none flex items-center justify-center rounded-none border-0'
          : ''
      }`}
      style={{
        borderColor: isFullscreen ? 'transparent' : 'var(--border-active)'
      }}
    >
      <video
        ref={videoRef}
        src={url}
        aria-label={`${appName} preview`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        className="w-full h-full object-contain block"
      >
        Your browser does not support the video tag.
      </video>

      {/* Center play icon when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
          <div className="p-3 rounded-full bg-black/70 text-white shadow-lg">
            <Play size={22} fill="currentColor" />
          </div>
        </div>
      )}

      {/* Bottom control bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/95 via-black/70 to-transparent px-2.5 pt-4 pb-2 z-20 flex flex-col gap-1"
      >
        {/* Scrubber slider */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek video"
          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-indigo-400"
        />

        {/* Control buttons & Duration */}
        <div className="flex items-center justify-between text-[10px] text-zinc-300 font-mono pt-0.5">
          <div className="flex items-center gap-2 text-white">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="hover:text-indigo-400 transition-colors p-0.5"
            >
              {isPlaying ? (
                <Pause size={12} fill="currentColor" />
              ) : (
                <Play size={12} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="hover:text-indigo-400 transition-colors p-0.5"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            <button
              type="button"
              onClick={handleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Open fullscreen'}
              className="hover:text-indigo-400 transition-colors p-0.5"
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
          </div>

          <span className="text-[9px] sm:text-[10px] tabular-nums shrink-0">
            {formatTime(currentTime)}
            <span className="hidden min-[380px]:inline">
              {' '}
              / {formatTime(duration)}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
