'use client'

import { memo, useState, useEffect } from 'react'
import { StatusBadge } from './StatusBadge'
import { PreviewMedia } from './PreviewMedia'
import { ComingSoonPlaceholder } from './ComingSoonPlaceholder'
import { CtaButton } from './CtaButton'
import { HypeSelector } from './HypeSelector'
import { ChevronDown } from 'lucide-react'
import { ArkalonApp } from '@/types/registry'

type Props = {
  app: ArkalonApp
  expanded: boolean
  onToggle: () => void
}

const APP_TITLE_STYLES: Record<string, string> = {
  rps: 'title-rps',
  daily: 'title-daily',
  labs: 'title-labs',
  'tower-defense': 'title-tower-defense',
  realms: 'title-realms',
  'chaos-racing': 'title-chaos-racing',
  market: 'title-market',
  dungeons: 'title-dungeons',
  nexus: 'title-nexus',
  party: 'title-party',
  colony: 'title-colony',
  arena: 'title-arena',
  dreadwood: 'title-dreadwood',
  raids: 'title-raids',
  auction: 'title-auction',
  dispatch: 'title-dispatch'
}

function AppCardInner({ app, expanded, onToggle }: Props) {
  const showPlaceholder =
    app.status === 'coming_soon' || app.status === 'development'
  const showMedia = !showPlaceholder && app.previewMediaUrl != null

  const [badgeVisible, setBadgeVisible] = useState(false)

  useEffect(() => {
    if (!app.badge?.type) return
    try {
      const seen = localStorage.getItem(`arkalon_seen_app_badge_${app.slug}`)
      if (seen !== app.badge.id) {
        setBadgeVisible(true)
      }
    } catch {}
  }, [app.badge, app.slug])

  const handleCtaClick = () => {
    if (!app.badge?.type) return
    setBadgeVisible(false)
    try {
      localStorage.setItem(`arkalon_seen_app_badge_${app.slug}`, app.badge.id)
    } catch {}
  }

  const isUpdated = app.badge?.type === 'updated'

  return (
    <article
      className="w-full rounded-lg border transition-colors duration-150 hover:bg-(--bg-surface-hover)"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: expanded ? 'var(--border-active)' : 'var(--border-default)'
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex flex-col gap-2 px-4 py-3 text-left rounded-lg transition-colors duration-150 cursor-pointer"
      >
        {/* Responsive Header: Title gets its own line on mobile, joins on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 w-full">
          <div className="flex items-center gap-2">
            <span
              className={`text-[1.125rem] font-black leading-snug tracking-wide wrap-break-word ${APP_TITLE_STYLES[app.slug] ?? ''}`}
            >
              {app.name.toUpperCase()}
            </span>
            {badgeVisible && app.badge?.type && (
              <span
                className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border leading-none shrink-0"
                style={{
                  backgroundColor: isUpdated
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(34, 197, 94, 0.15)',
                  color: isUpdated
                    ? 'var(--status-development)'
                    : 'var(--status-online)',
                  borderColor: isUpdated
                    ? 'rgba(245, 158, 11, 0.35)'
                    : 'rgba(34, 197, 94, 0.35)'
                }}
              >
                {isUpdated ? 'UPDATED' : 'NEW'}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0">
            <StatusBadge status={app.status} />
            <ChevronDown
              size={16}
              className="transition-transform duration-200 shrink-0"
              style={{
                color: 'var(--text-muted)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </div>
        </div>

        <p
          className="text-[0.875rem] leading-snug wrap-break-word w-full"
          style={{ color: 'var(--text-secondary)' }}
        >
          {app.shortDescription}
        </p>
      </button>

      {expanded && (
        <div
          id={`card-body-${app.slug}`}
          role="region"
          aria-label={`${app.name} details`}
          className="px-4 pb-4 flex flex-col gap-3"
          style={{ animation: 'card-expand 0.15s ease-out both' }}
        >
          <hr
            className="border-0 border-t"
            style={{ borderColor: 'var(--border-default)' }}
          />

          {showMedia ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between">
              <div className="flex flex-col gap-4 flex-1">
                {app.extendedDescription && (
                  <p
                    className="text-[0.875rem] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {app.extendedDescription}
                  </p>
                )}
                <div className="flex justify-center sm:justify-start">
                  <CtaButton
                    label={app.ctaLabel}
                    route={app.route}
                    onClick={handleCtaClick}
                  />
                </div>
              </div>
              <div className="shrink-0">
                <PreviewMedia url={app.previewMediaUrl!} appName={app.name} />
              </div>
            </div>
          ) : (
            <>
              {app.extendedDescription && (
                <p
                  className="text-[0.875rem] leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {app.extendedDescription}
                </p>
              )}
              {showPlaceholder && <ComingSoonPlaceholder appName={app.name} />}
              <div className="flex justify-center pt-1">
                <CtaButton
                  label={app.ctaLabel}
                  route={app.route}
                  onClick={handleCtaClick}
                />
              </div>
            </>
          )}
          <HypeSelector appSlug={app.slug} />
        </div>
      )}
    </article>
  )
}

export const AppCard = memo(AppCardInner)
