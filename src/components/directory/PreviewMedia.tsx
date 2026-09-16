'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const nextMuted = !videoRef.current.muted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if (
      (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void })
        .webkitEnterFullscreen
    ) {
      ;(video as HTMLVideoElement & { webkitEnterFullscreen?: () => void })
        .webkitEnterFullscreen!()
    }
  }

  return (
    <div
      onClick={togglePlay}
      className="relative w-40 sm:w-55 max-w-full overflow-hidden rounded-xl border shadow-xl cursor-pointer group select-none"
      style={{
        borderColor: 'var(--border-active)',
        backgroundColor: '#000000'
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
        className="w-full h-auto block rounded-xl"
      >
        Your browser does not support the video tag.
      </video>

      {/* Center play icon when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
          <div className="p-3 rounded-full bg-black/70 text-white shadow-lg">
            <Play size={24} fill="currentColor" />
          </div>
        </div>
      )}

      {/* Bottom control bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 via-black/60 to-transparent px-2.5 pt-4 pb-2 z-20 flex flex-col gap-1"
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

        {/* Control buttons on the left + Duration timer on the right */}
        <div className="flex items-center justify-between text-[10px] text-zinc-300 font-mono pt-0.5">
          <div className="flex items-center gap-2 text-white">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="hover:text-indigo-400 transition-colors"
            >
              {isPlaying ? (
                <Pause size={13} fill="currentColor" />
              ) : (
                <Play size={13} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="hover:text-indigo-400 transition-colors"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            <button
              type="button"
              onClick={handleFullscreen}
              aria-label="Open fullscreen"
              className="hover:text-indigo-400 transition-colors"
            >
              <Maximize2 size={12} />
            </button>
          </div>

          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
