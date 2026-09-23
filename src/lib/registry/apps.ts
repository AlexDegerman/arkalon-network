import type { ArkalonApp } from '@/types/registry'

export const REGISTRY: ArkalonApp[] = [
  {
    slug: 'rps',
    name: 'RPS League',
    shortDescription: 'Live-service Rock Paper Scissors predicting platform.',
    extendedDescription:
      'A live-service Rock Paper Scissors predicting platform where players wager cosmetic points, track global rankings, and use an AI-powered assistant for match analysis and game guidance.',
    previewMediaUrl: '/rpsleaguehalfanniv.mp4',
    status: 'online',
    categories: ['prediction', 'competitive', 'arcade', 'ai'],
    route: 'https://rpsleague.fi',
    ctaLabel: 'PLAY HERE',
    public: true,
    badge: { type: null, id: 'rps-v4.4' }
  },
  {
    slug: 'daily',
    name: 'Arkalon Daily',
    shortDescription:
      'Daily puzzle platform - one challenge, one attempt per day.',
    extendedDescription:
      'A daily puzzle platform offering exactly one challenge and one attempt per day. It adapts several minigames into quick, competitive logic puzzles solved against a single global seed.',
    status: 'development',
    categories: ['puzzle', 'logic', 'daily-challenge'],
    route: 'https://daily.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: {
      type: null,
      id: 'daily-v1.0'
    }
  },
  {
    slug: 'labs',
    name: 'Arkalon Labs',
    shortDescription:
      'Incremental idle game - facility optimization and research scaling.',
    extendedDescription:
      'An incremental idle game focused on passive facility optimization, research, and long-term infrastructure scaling. Players manage an isolated scientific base to study mathematical anomalies and expand technological output.',
    status: 'coming_soon',
    categories: ['incremental', 'idle', 'simulation', 'strategy'],
    route: 'https://labs.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'labs-v1.0' }
  },
  {
    slug: 'tower-defense',
    name: 'Arkalon TD',
    shortDescription:
      '2.5D browser tower defense with fast 1-to-3 minute stages.',
    extendedDescription:
      'A 2.5D browser-based tower defense game with self-contained stages that take 1 to 3 minutes to complete. It favors positioning, path management, and tower synergy over grinding upgrades or memorizing massive rosters.',
    status: 'coming_soon',
    categories: ['tower-defense', 'strategy', 'tactical'],
    route: 'https://td.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'tower-defense-v1.0' }
  },
  {
    slug: 'realms',
    name: 'Arkalon Realms',
    shortDescription: 'Browser-based multiplayer 2.5D persistent roguelike.',
    extendedDescription:
      'A browser-based multiplayer roguelike where players explore a dangerous persistent 2.5D world, fight enemies in real time, collect loot and experience, and push deeper for greater rewards while risking permanent death.',
    status: 'coming_soon',
    categories: ['multiplayer', 'roguelike', 'action-rpg', 'survival'],
    route: 'https://realms.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'realms-v1.0' }
  },
  {
    slug: 'chaos-racing',
    name: 'Arkalon Chaos Racing',
    shortDescription:
      '2.5D physics-driven arcade racing with incremental progression.',
    extendedDescription:
      'A 2.5D arcade racing game built around physics-driven mayhem, extreme tracks, and incremental progression. Players race through chaotic environments, chain stunts and risky maneuvers for massive scores, spend points on upgrades, and push toward increasingly absurd numbers.',
    status: 'coming_soon',
    categories: ['racing', 'arcade', 'physics', 'incremental'],
    route: 'https://racing.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'chaos-racing-v1.0' }
  },
  {
    slug: 'market',
    name: 'Arkalon Market',
    shortDescription:
      'Fast-paced economic trading simulation in short sessions.',
    extendedDescription:
      'An economic simulation where players trade, manage production, and react to live market changes in 2-to-3-minute sessions. The game has no daily entry limits, allowing players to run sessions back-to-back.',
    status: 'coming_soon',
    categories: ['economy', 'simulation', 'trading', 'strategy'],
    route: 'https://market.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'market-v1.0' }
  },
  {
    slug: 'dungeons',
    name: 'Arkalon Dungeons',
    shortDescription: 'Solo tactical roguelite 2.5D dungeon crawler.',
    extendedDescription:
      'A solo tactical roguelite 2.5D dungeon crawler featuring permanent death and a deep, scaling descent. While active runs cannot be reloaded, players carry forward permanent account-wide progression into future attempts.',
    status: 'coming_soon',
    categories: ['roguelite', 'dungeon-crawler', 'tactical', 'rpg'],
    route: 'https://dungeons.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'dungeons-v1.0' }
  },
  {
    slug: 'nexus',
    name: 'Arkalon Nexus',
    shortDescription:
      'Visualized stats hub and analytics across all Arkalon apps.',
    extendedDescription:
      'A centralized stats platform that tracks and visualizes live telemetry across the entire Arkalon ecosystem. Players can explore global leaderboards, game analytics, economy graphs, and aggregate performance metrics in interactive dashboards.',
    status: 'coming_soon',
    categories: ['analytics', 'telemetry', 'leaderboards', 'ecosystem'],
    route: 'https://nexus.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'nexus-v1.0' }
  },
  {
    slug: 'party',
    name: 'Arkalon Party',
    shortDescription:
      '2.5D physics party game with chaotic multiplayer challenges.',
    extendedDescription:
      'A 2.5D physics party game focused on chaotic multiplayer experiences, cooperative challenges, environmental interaction, and hilarious physics-driven failures.',
    status: 'coming_soon',
    categories: ['multiplayer', 'party', 'physics', 'co-op'],
    route: 'https://party.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'party-v1.0' }
  },
  {
    slug: 'colony',
    name: 'Arkalon Colony',
    shortDescription: 'Idle builder - infrastructure and civilization scaling.',
    extendedDescription:
      'An idle builder focused on scaling a small settlement into a massive civilization. Players make high-level infrastructure and population choices during periodic check-ins rather than micromanaging individual citizens.',
    status: 'coming_soon',
    categories: ['city-builder', 'idle', 'incremental', 'strategy'],
    route: 'https://colony.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'colony-v1.0' }
  },
  {
    slug: 'arena',
    name: 'Arkalon Arena',
    shortDescription: 'Competitive 1v1 2.5D tactical grid game.',
    extendedDescription:
      'A 2.5D competitive 1v1 tactical grid game featuring simultaneous-turn duels resolved in under two minutes. There is no power progression or gear, leaving matches decided purely by class loadouts and skill (1.0 solo against bots before server funded).',
    status: 'coming_soon',
    categories: ['multiplayer', 'pvp', 'tactical', 'competitive'],
    route: 'https://arena.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'arena-v1.0' }
  },
  {
    slug: 'dreadwood',
    name: 'Arkalon Dreadwood',
    shortDescription:
      '2.5D horror incremental exploration and risk management.',
    extendedDescription:
      'A 2.5D horror incremental game where players explore a mysterious forest, complete tasks, risk their expedition rewards, and unlock increasingly powerful upgrades and equipment.',
    status: 'coming_soon',
    categories: ['horror', 'exploration', 'incremental', 'survival'],
    route: 'https://dreadwood.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'dreadwood-v1.0' }
  },
  {
    slug: 'raids',
    name: 'Arkalon Raids',
    shortDescription: 'Cooperative 1-to-4 player 2.5D grid-combat boss fights.',
    extendedDescription:
      'A 1-to-4 player 2.5D cooperative grid-combat game where players battle single, heavily telegraphed PvE bosses. Success is decided through team positioning, mechanics reading, and coordinated execution with no gear grinds or forced roles (1.0 solo with bots before server funded).',
    status: 'coming_soon',
    categories: ['multiplayer', 'co-op', 'tactical', 'boss-raid'],
    route: 'https://raids.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'raids-v1.0' }
  },
  {
    slug: 'auction',
    name: 'Arkalon Auction',
    shortDescription: 'Four-player real-time bidding and valuation game.',
    extendedDescription:
      "A four-player real-time bidding game where players use intel tools to uncover hidden data about virtual asset lots before entering five rounds of escalating bids using virtual credits. Performance is graded on the margin between the final winning bid and the asset's true value.",
    status: 'coming_soon',
    categories: ['multiplayer', 'bidding', 'economy', 'competitive'],
    route: 'https://auction.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'auction-v1.0' }
  },
  {
    slug: 'dispatch',
    name: 'Arkalon Dispatch',
    shortDescription:
      'Tactical idle RPG - squad prep, risk analysis, and permanent consequences.',
    extendedDescription:
      'A tactical idle RPG where players equip and send squads on high-stakes expeditions with permanent death and injury. Missions run autonomously once launched, focusing gameplay entirely on pre-mission risk analysis, trait management, and gear configuration.',
    status: 'coming_soon',
    categories: ['tactical', 'idle', 'rpg', 'strategy'],
    route: 'https://dispatch.rpsleague.fi',
    ctaLabel: 'COMING SOON',
    public: true,
    badge: { type: null, id: 'dispatch-v1.0' }
  }
]

export const PUBLIC_APPS: ArkalonApp[] = REGISTRY.filter((app) => app.public)
