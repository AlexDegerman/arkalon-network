import 'server-only'

import { KnowledgeChunk } from '@/types/ai'
// Network Knowledge
import { ecosystemInfo } from '../knowledge/network/ecosystem'
import { identitySystem } from '../knowledge/network/identity'
import { networkFaq } from '../knowledge/network/faq'

// RPS League Knowledge
import { matchResolution } from '../knowledge/rpsleague/matchResolution'
import { relics } from '../knowledge/rpsleague/relics'
import { worldBosses } from '../knowledge/rpsleague/worldBosses'
import { neonParadise } from '../knowledge/rpsleague/neonParadise'
import { festivals } from '../knowledge/rpsleague/festivals'
import { flashEvents } from '../knowledge/rpsleague/flashEvents'
import { globalEvents } from '../knowledge/rpsleague/globalEvents'
import { progression } from '../knowledge/rpsleague/progression'
import { achievements } from '../knowledge/rpsleague/achievements'
import { strategy } from '../knowledge/rpsleague/strategy'
import { controls } from '../knowledge/rpsleague/controls'
import { pwaAndIdentity } from '../knowledge/rpsleague/pwaAndIdentity'
import { faq as rpsFaq } from '../knowledge/rpsleague/faq'


export const KNOWLEDGE_REGISTRY: KnowledgeChunk[] = [
  // --- NETWORK ECOSYSTEM & IDENTITY ---
  {
    id: 'network:ecosystem',
    appSlug: 'network',
    title: 'Arkalon Application Ecosystem Overview',
    keywords: [
      'ecosystem',
      'network',
      'portal',
      'directory',
      'hub',
      'all apps',
      'games',
      'development',
      'in dev',
      'roadmap',
      'upcoming',
      'status'
    ],
    content: ecosystemInfo
  },
  {
    id: 'network:identity',
    appSlug: 'network',
    title: 'Arkalon Core Identity & SSO Architecture',
    keywords: [
      'core',
      'identity',
      'account',
      'nickname',
      'short id',
      'recovery code',
      'cookie',
      'sso',
      'root domain',
      'persistence',
      'restore',
      'session',
      'hmac'
    ],
    content: identitySystem
  },
  {
    id: 'network:faq',
    appSlug: 'network',
    title: 'Arkalon Network Frequently Asked Questions',
    keywords: [
      'faq',
      'questions',
      'reroll',
      'nickname',
      'short id',
      'devices',
      'pwa',
      'lost code',
      'help',
      'priority',
      'priorities',
      'developer',
      'creator',
      'who made this',
      'what game is next',
      'influence',
      'vote',
      'hyped',
      'roadmap',
      'schedule',
      'delete account',
      'change recovery code',
      'shared currency',
      'transfer points',
      'change vote',
      'cancel vote',
      'free to play',
      'offline',
      'discord',
      'google login',
      'switch account',
      'multiple accounts',
      'real money',
      'cashout',
      'third-party cookies',
      'brute force'
    ],
    content: networkFaq
  },

  // --- RPS LEAGUE ---
  {
    id: 'rps:match-resolution',
    appSlug: 'rps',
    title: 'RPS League Match Resolution & Bot Rules',
    keywords: [
      'rps',
      'bot',
      'match',
      'resolution',
      'predict',
      'predictor',
      'rock',
      'paper',
      'scissors',
      'rules',
      'timing'
    ],
    content: matchResolution
  },
  {
    id: 'rps:relics',
    appSlug: 'rps',
    title: 'RPS League Relic Vault & Loadouts',
    keywords: [
      'relic',
      'relics',
      'vault',
      'loadout',
      'socket',
      'drop rate',
      'mythical relic',
      'architect',
      'keystone',
      'twin fortune',
      'prism key'
    ],
    content: relics
  },
  {
    id: 'rps:world-bosses',
    appSlug: 'rps',
    title: 'RPS League World Boss Encounters',
    keywords: [
      'world boss',
      'boss',
      'hexurion',
      'orphion',
      'fracturon',
      'alexion',
      'hp',
      'raid',
      'chest',
      'strike'
    ],
    content: worldBosses
  },
  {
    id: 'rps:neon-paradise',
    appSlug: 'rps',
    title: 'RPS League Neon Paradise Bonus Stages',
    keywords: [
      'neon paradise',
      'bonus stage',
      'minigame',
      'treasure vault',
      'double down',
      'wild prediction',
      'surge frenzy',
      'crystal mine',
      'jackpot'
    ],
    content: neonParadise
  },
  {
    id: 'rps:festivals',
    appSlug: 'rps',
    title: 'RPS League Player Festivals',
    keywords: [
      'festival',
      'spark',
      'ghost',
      'safeguard',
      'resonance',
      'surge',
      'vault festival',
      'fever',
      'sanguine',
      'cooldown'
    ],
    content: festivals
  },
  {
    id: 'rps:flash-events',
    appSlug: 'rps',
    title: 'RPS League Personal Flash Events',
    keywords: [
      'flash event',
      'moon blessing',
      'electric surge',
      'hellfire',
      'luck in the card',
      'multiplier'
    ],
    content: flashEvents
  },
  {
    id: 'rps:global-events',
    appSlug: 'rps',
    title: 'RPS League Global SSE Events',
    keywords: [
      'global event',
      'tidal surge',
      'cyclone blitz',
      'solar flare',
      'mirage cataclysm',
      'warning phase'
    ],
    content: globalEvents
  },
  {
    id: 'rps:progression',
    appSlug: 'rps',
    title: 'RPS League Progression, Ascension & Leaderboards',
    keywords: [
      'progression',
      'ascension',
      'chrono-lap',
      'lap',
      'prestige',
      'leaderboard',
      'auto-bet',
      'win streak',
      'tqgs',
      'bigint'
    ],
    content: progression
  },
  {
    id: 'rps:achievements',
    appSlug: 'rps',
    title: 'RPS League Achievement Codex',
    keywords: [
      'achievement',
      'achievements',
      'codex',
      'god king',
      'cosmic sovereign',
      'rainbow',
      'badges',
      'showcase'
    ],
    content: achievements
  },
  {
    id: 'rps:strategy',
    appSlug: 'rps',
    title: 'RPS League Strategy & Optimization Guide',
    keywords: [
      'strategy',
      'tips',
      'guide',
      'optimize',
      'best relic',
      'beginner',
      'speedrun'
    ],
    content: strategy
  },
  {
    id: 'rps:controls',
    appSlug: 'rps',
    title: 'RPS League UI Controls & Audio Settings',
    keywords: [
      'controls',
      'audio',
      'auto max',
      'voice',
      'sound',
      'popover',
      'feedback'
    ],
    content: controls
  },
  {
    id: 'rps:pwa-identity',
    appSlug: 'rps',
    title: 'RPS League Local Storage & Onboarding',
    keywords: [
      'install',
      'pwa',
      'onboarding',
      'welcome modal',
      'whats new',
      'mobile install'
    ],
    content: pwaAndIdentity
  },
  {
    id: 'rps:faq',
    appSlug: 'rps',
    title: 'RPS League Comprehensive FAQ',
    keywords: [
      'rps faq',
      'questions',
      'house edge',
      'pity system',
      '100k floor',
      'ties',
      'payout'
    ],
    content: rpsFaq
  }

  // Future apps (e.g. daily, labs, td, realms) plug directly into this registry
]
