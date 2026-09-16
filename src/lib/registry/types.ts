export type AppStatus =
  | 'online'
  | 'development'
  | 'coming_soon'
  | 'maintenance'
  | 'private'

export type AppCategory =
  | 'live'
  | 'incremental'
  | 'short-session'
  | 'multiplayer'

export type CtaLabel = 'PLAY HERE' | 'OPEN APP' | 'COMING SOON'

export interface ArkalonApp {
  slug: string
  name: string
  shortDescription: string
  extendedDescription?: string
  status: AppStatus
  category: AppCategory
  previewMediaUrl?: string
  route: string
  ctaLabel: CtaLabel
  public: boolean
}
