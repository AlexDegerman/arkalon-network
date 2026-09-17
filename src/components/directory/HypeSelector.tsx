'use client'

import { useEffect, useState, useTransition } from 'react'
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react'
import { getAppInterestAction } from '@/app/actions/getAppInterest'
import { submitAppInterestAction } from '@/app/actions/submitAppInterest'

type Props = {
  appSlug: string
}

type VoteState = 'hyped' | 'not_interested' | null

export function HypeSelector({ appSlug }: Props) {
  const [vote, setVote] = useState<VoteState>(null)
  const [isPending, startTransition] = useTransition()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = await getAppInterestAction(appSlug)
      if (!cancelled && res.status === 'success') {
        setVote(res.vote)
        setIsLoaded(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [appSlug])

  const handleVote = (newVote: 'hyped' | 'not_interested') => {
    // Toggle off if clicking the already active button
    const nextVote = vote === newVote ? null : newVote

    setVote(nextVote)

    startTransition(async () => {
      const res = await submitAppInterestAction(appSlug, nextVote)
      if (res.status !== 'success') {
        // Revert on error
        setVote(vote)
      }
    })
  }

  // Prevent layout shift while loading initial state
  if (!isLoaded) {
    return <div className="h-8" aria-hidden="true" />
  }

  return (
    <div className="flex flex-col gap-2 pt-2">
      <span
        className="text-[0.6875rem] font-semibold tracking-widest"
        style={{
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace"
        }}
      >
        INTEREST LEVEL
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleVote('hyped')}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-semibold tracking-wide transition-all duration-150 border cursor-pointer"
          style={{
            backgroundColor:
              vote === 'hyped' ? 'var(--status-online)' : 'var(--bg-primary)',
            borderColor:
              vote === 'hyped'
                ? 'var(--status-online)'
                : 'var(--border-active)',
            color: vote === 'hyped' ? '#ffffff' : 'var(--text-secondary)',
            opacity: isPending ? 0.6 : 1
          }}
        >
          <span
            style={{
              color: vote === 'hyped' ? '#ffffff' : 'var(--status-online)'
            }}
          >
            {vote === 'hyped' ? <Check size={12} /> : <ThumbsUp size={12} />}
          </span>
          <span>HYPED</span>
        </button>

        <button
          type="button"
          onClick={() => handleVote('not_interested')}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-semibold tracking-wide transition-all duration-150 border cursor-pointer"
          style={{
            backgroundColor:
              vote === 'not_interested'
                ? 'var(--status-maintenance)'
                : 'var(--bg-primary)',
            borderColor:
              vote === 'not_interested'
                ? 'var(--status-maintenance)'
                : 'var(--border-active)',
            color:
              vote === 'not_interested' ? '#ffffff' : 'var(--text-secondary)',
            opacity: isPending ? 0.6 : 1
          }}
        >
          <span
            style={{
              color:
                vote === 'not_interested'
                  ? '#ffffff'
                  : 'var(--status-maintenance)'
            }}
          >
            {vote === 'not_interested' ? (
              <Check size={12} />
            ) : (
              <ThumbsDown size={12} />
            )}
          </span>
          <span>NOT INTERESTED</span>
        </button>
      </div>
    </div>
  )
}
