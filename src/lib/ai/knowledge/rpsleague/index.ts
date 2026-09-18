import { securityResponses } from './securityResponses'
import { matchResolution } from './matchResolution'
import { faq } from './faq'
import { strategy } from './strategy'
import { pwaAndIdentity } from './pwaAndIdentity'
import { flashEvents } from './flashEvents'
import { globalEvents } from './globalEvents'
import { festivals } from './festivals'
import { progression } from './progression'
import { relics } from './relics'
import { achievements } from './achievements'
import { controls } from './controls'
import { futureContent } from './futureContent'
import { neonParadise } from './neonParadise'
import { worldBosses } from './worldBosses'

export const GAME_KNOWLEDGE = [
  securityResponses,
  matchResolution,
  faq,
  strategy,
  pwaAndIdentity,
  flashEvents,
  globalEvents,
  festivals,
  progression,
  relics,
  achievements,
  controls,
  futureContent,
  neonParadise,
  worldBosses
].join('\n\n')
