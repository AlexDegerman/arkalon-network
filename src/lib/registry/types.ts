export type AppStatus =
  | 'online'
  | 'development'
  | 'coming_soon'
  | 'maintenance'
  | 'private'

export type CtaLabel = 'PLAY HERE' | 'OPEN APP' | 'COMING SOON'

export interface ArkalonApp {
  slug: string
  name: string
  shortDescription: string
  extendedDescription?: string
  status: AppStatus
  categories: string[]
  previewMediaUrl?: string
  route: string
  ctaLabel: CtaLabel
  public: boolean
}