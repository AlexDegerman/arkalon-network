import { describe, it, expect } from 'vitest'
import { REGISTRY, PUBLIC_APPS } from '@/lib/registry/apps'
import { ArkalonApp } from '@/types/registry'

describe('App Registry', () => {
  it('exports a non-empty array of apps in REGISTRY', () => {
    expect(Array.isArray(REGISTRY)).toBe(true)
    expect(REGISTRY.length).toBeGreaterThan(0)
  })

  it('ensures every app in REGISTRY has required core fields', () => {
    REGISTRY.forEach((app: ArkalonApp) => {
      expect(app).toHaveProperty('slug')
      expect(app).toHaveProperty('name')
      expect(app).toHaveProperty('shortDescription')
      expect(app).toHaveProperty('status')
      expect(app).toHaveProperty('categories')
      expect(app).toHaveProperty('route')
      expect(app).toHaveProperty('ctaLabel')
      expect(app).toHaveProperty('public')
      expect(typeof app.slug).toBe('string')
      expect(app.slug.length).toBeGreaterThan(0)
    })
  })

  it('filters PUBLIC_APPS correctly to only include public apps', () => {
    expect(Array.isArray(PUBLIC_APPS)).toBe(true)
    PUBLIC_APPS.forEach((app: ArkalonApp) => {
      expect(app.public).toBe(true)
    })
  })

  it('contains the expected RPS League app as the first entry', () => {
    const firstApp = REGISTRY[0]
    expect(firstApp.slug).toBe('rps')
    expect(firstApp.name).toBe('RPS League')
    expect(firstApp.status).toBe('online')
  })

  it('allows finding an app by slug using standard array methods', () => {
    const foundApp = REGISTRY.find((app) => app.slug === 'labs')
    expect(foundApp).toBeDefined()
    expect(foundApp?.name).toBe('Arkalon Labs')
  })

  it('returns undefined when searching for a non-existent slug', () => {
    const foundApp = REGISTRY.find(
      (app) => app.slug === 'non-existent-slug-12345'
    )
    expect(foundApp).toBeUndefined()
  })
})
