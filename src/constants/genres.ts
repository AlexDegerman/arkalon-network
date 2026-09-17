import type { ArkalonApp } from '@/lib/registry/types'

export interface GenreFilter {
  id: string
  label: string
  match: (app: ArkalonApp) => boolean
}

export const GENRE_FILTERS: readonly GenreFilter[] = [
  { id: 'all', label: 'ALL', match: () => true },
  { id: 'live', label: 'LIVE', match: (app) => app.status === 'online' },
  {
    id: 'multiplayer',
    label: 'MULTIPLAYER & CO-OP',
    match: (app) =>
      app.categories.some((t) => ['multiplayer', 'co-op'].includes(t))
  },
  {
    id: 'incremental',
    label: 'INCREMENTAL & IDLE',
    match: (app) =>
      app.categories.some((t) => ['incremental', 'idle'].includes(t))
  },
  {
    id: 'tactical',
    label: 'STRATEGY & TACTICAL',
    match: (app) =>
      app.categories.some((t) => ['strategy', 'tactical'].includes(t))
  },
  {
    id: 'roguelike',
    label: 'ROGUELIKE & RPG',
    match: (app) =>
      app.categories.some((t) => ['roguelike', 'roguelite', 'rpg'].includes(t))
  },
  {
    id: 'arcade',
    label: 'ARCADE & RACING',
    match: (app) => app.categories.some((t) => ['arcade', 'racing'].includes(t))
  },
  {
    id: 'puzzle',
    label: 'PUZZLE & LOGIC',
    match: (app) => app.categories.some((t) => ['puzzle', 'logic'].includes(t))
  }
]
