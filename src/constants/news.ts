export const NEWS_ITEMS = [
  {
  id: 'v1.0-daily-launch',
  date: 'September 29, 2026',
  title: 'Arkalon Daily is Live!',
  notes: [
    'Five daily cognitive puzzles: Recall, Surge, Cipher, Strike, and Depths, each resetting at midnight UTC.',
    'Deterministic seeds: every player receives the identical challenge each day, with one attempt per puzzle.',
    'Server-authoritative scoring on a 0 to 100 scale with global leaderboards, streaks, and shareable result cards.',
    'Zero friction: anonymous Core Identity on arrival, no accounts, no ads, no payments.'
  ]
},
  {
    id: 'v1.0-network-launch',
    date: 'September 19, 2026',
    title: 'Arkalon Network is Live!',
    notes: [
      'Unified Core Identity: Instant, zero-friction account provisioning with deterministic 3-word nicknames and mnemonic recovery phrases.',
      'Ecosystem Directory: Centralized hub for all Arkalon applications, featuring live status telemetry and silent hype voting.',
      'Arkalon AI Oracle: In-memory RAG intelligence engine providing sub-2ms contextual answers across the entire ecosystem.',
      'Cross-App SSO: Seamless root-domain session persistence across all current and future Arkalon experiences.'
    ]
  }
]

export const LATEST_NEWS = NEWS_ITEMS[0]
export const NEWS_VERSION = LATEST_NEWS.id
