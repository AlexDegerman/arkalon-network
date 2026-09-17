# 🌐 Arkalon Network

The central hub and identity platform for the **Arkalon application ecosystem**, connecting live-service games, simulations, and competitive experiences under a unified account system.

> **Ecosystem Evolution:** Following the full production rollout of [RPS League](https://rpsleague.fi/), development has expanded into the wider **Arkalon universe**. Arkalon Network acts as the anchor for all current and upcoming applications, synchronizing user identities, global telemetry, and session state across the ecosystem.

**Explore the Network:** [https://network.rpsleague.fi/](https://network.rpsleague.fi/)

## Preview

<p align="center">
  <img src="./assets/arkalon-network-demo.gif" width="280" alt="Arkalon Network Preview" />
</p>

---

## 📑 Table of Contents

### 🕹️ Core Systems

- [Arkalon Core: Unified Account System](#-arkalon-core-unified-account-system)
- [AI Arkalon: The Ecosystem Overseer](#-ai-arkalon-the-ecosystem-overseer)

### 🚀 Ecosystem Directory

- [Active & In Development](#-active--in-development)
- [Future Experiences](#-future-experiences)
- [Status Lifecycle Engine](#-status-lifecycle-engine)
- [Application Registry & Discovery](#-application-registry--discovery)

### 🏗️ Engineering & Architecture

- [Architecture & Tech Stack](#️-architecture--tech-stack)
- [System Data Flow](#-system-data-flow)
- [Single-Tab Guard & Concurrency](#-single-tab-guard--concurrency)
- [Visual Shader & Typography Engine](#-visual-shader--typography-engine)
- [Cryptographic Session & Security Model](#-cryptographic-session--security-model)

### 📦 Meta

- [Device Compatibility](#-device-compatibility)
- [Disclaimer](#️-disclaimer)
- [Privacy, Telemetry & Security](#-privacy-telemetry--security)
- [License](#-license)

---

## ⚡ Arkalon Core: Unified Account System

Arkalon Network introduces **Arkalon Core**, a zero-friction, local-first account system that eliminates traditional email and password registration entirely. Visiting any application within the network instantly provisions a secure, persistent identity that functions seamlessly across all subdomains.

- **Deterministic 3-Word Nicknames**: Procedurally generated using a three-tier dictionary (Adjective + Color + Animal, e.g., `AncientGoldTurtle`), creating millions of unique, readable identities with zero namespace collisions.
- **Short ID Anchor**: Lightweight 10-character URL-safe identifiers (e.g., `Hqo7qUSe38`) providing unambiguous public references across leaderboards, profiles, and cross-game match tracking.
- **Mnemonic Recovery Phrases**: Alphanumeric, human-readable recovery phrases (e.g., `swift-falcon-4821`) generated cryptographically on the server, serving as the master key for profile migration and cross-device restoration.
- **Revealable Recovery Access**: Security-conscious UX where recovery credentials remain blurred behind real-time CSS filters until explicitly requested by verified sessions, featuring instant clipboard integration.
- **Root-Domain Cookie SSO**: Authentication tokens and Core IDs are scoped to the parent `.rpsleague.fi` domain. Players authenticated on the hub are silently recognized across all satellite experiences without manual sign-in.
- **Self-Healing State Sync**: Automatic database backfilling that dynamically resolves legacy profiles, generates missing credentials on the fly, and repopulates local browser storage without data loss.

---

## 🤖 AI Arkalon: The Ecosystem Overseer

> *"A forgotten intelligence from a lost era. It does not predict the future, it calculates the probability of what has already begun."*

The ecosystem features **AI Arkalon**, represented in-universe as **The Arkalon**—an ancient time-lost prophetic robotic entity acting as an observer, announcer, and analytical guide across the network.

While originally introduced within RPS League to analyze prediction telemetry and speak prophecies, Arkalon serves as the unifying narrative and intelligence bridge across all connected applications. It calculates ecosystem probability, guides players through cross-app progression milestones, and unifies system mechanics under a shared universe.

---

## 🌌 Active & In Development

The network links together several independent experiences built on top of the Arkalon Core identity:

| Application | Category | Status | Focus |
| :--- | :--- | :---: | :--- |
| **RPS League** | Live | `ONLINE` | Live-service high-frequency prediction arena with virtual economy. |
| **Arkalon Daily** | Short-Session | `IN DEV` | Daily logic puzzle challenges solved against a single global seed. |
| **Arkalon Labs** | Incremental | `COMING SOON` | Passive scientific facility optimization and research scaling. |

---

## 🚀 Future Experiences

Upcoming concepts, experimental game loops, and multiplayer environments planned for the Arkalon universe:

| Application | Category | Status | Focus |
| :--- | :--- | :---: | :--- |
| **Arkalon Tower Defense** | Short-Session | `COMING SOON` | Fast-paced 2.5D browser tower defense with self-contained stages. |
| **Arkalon Realms** | Multiplayer | `COMING SOON` | Persistent 2.5D browser roguelike featuring real-time combat and loot. |
| **Arkalon Chaos Racing** | Short-Session | `COMING SOON` | Physics-driven arcade racing with stunts and incremental upgrades. |
| **Arkalon Market** | Short-Session | `COMING SOON` | High-frequency economic trading and production simulation. |
| **Arkalon Dungeons** | Short-Session | `COMING SOON` | Tactical roguelite dungeon crawler with account-wide meta progression. |
| **Arkalon Nexus** | Live | `COMING SOON` | Centralized cross-app telemetry, global achievements, and analytics hub. |
| **Arkalon AI** | Live | `COMING SOON` | Prophetic ecosystem guidance, odds calculation, and lore commentary. |
| **Arkalon Party** | Multiplayer | `COMING SOON` | Physics-driven chaotic party minigames with cooperative objectives. |
| **Arkalon Colony** | Incremental | `COMING SOON` | Civilization builder focused on high-level infrastructure and check-ins. |
| **Arkalon Arena** | Multiplayer | `COMING SOON` | Simultaneous-turn 1v1 tactical grid duels with zero power progression. |
| **Arkalon Dreadwood** | Incremental | `COMING SOON` | 2.5D horror risk management and expedition scaling. |
| **Arkalon Raids** | Multiplayer | `COMING SOON` | Cooperative 1-to-4 player telegraph-based boss encounters. |
| **Arkalon Auction** | Multiplayer | `COMING SOON` | Real-time multi-round asset lot bidding and valuation competition. |
| **Arkalon Dispatch** | Short-Session | `COMING SOON` | Autonomous squad RPG focused on tactical preparation and consequence. |

---

## 🚥 Status Lifecycle Engine

Every project in the registry operates on a standardized visual lifecycle pipeline communicating operational readiness in real time:

| Status | Dot Indicator | Meaning | Interactive CTA |
| :--- | :---: | :--- | :--- |
| `ONLINE` | 🟢 Filled Green | Live production deployment, fully playable | `PLAY HERE` |
| `IN DEV` | 🟡 Filled Amber | Active gameplay development, periodic staging | `COMING SOON` |
| `COMING SOON` | ⚪ Outlined Gray | Core design stage, upcoming deployment | `COMING SOON` |
| `MAINTENANCE` | 🔴 Filled Red | Offline for scheduled migration or database upgrades | `OPEN APP` (Disabled) |
| `PRIVATE` | ⚪ Outlined Gray | Internal tooling, administrative dashboard | `COMING SOON` |

---

## 🧭 Application Registry & Discovery

The directory serves as the centralized portal for exploring the Arkalon ecosystem, organizing platforms by gameplay cadence, multiplayer architecture, and active release state.

- **Context-Aware Presentation**: Application cards dynamically surface gameplay categories (Live, Short-Session, Incremental, Multiplayer), status telemetry, and responsive call-to-action pathways.
- **Embedded Media Showcase**: Integrated preview player featuring custom scrubber timeline controls, responsive audio ducking, mute toggles, and cross-browser fullscreen handling.
- **Modular Categorization**: Structural tagging enabling swift filtering across instant-action challenges, deep progression loops, and synchronized multiplayer arenas.
- **Priority Navigation**: Direct routing to active production deployments (`PLAY HERE`), staged staging builds (`OPEN APP`), and work-in-progress sandboxes (`COMING SOON`).

---

## 🏗️ Architecture & Tech Stack

| Layer | Stack | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (Turbopack, App Router) | Fast server-side rendering, standalone production build |
| **Runtime** | React 19, TypeScript 5.8 | Strict type contracts and modern concurrency primitives |
| **Styling** | Tailwind CSS v4 | Zero-runtime CSS engine with custom metallic shaders |
| **State** | Zustand | Lightweight client UI and modal overlay state machines |
| **Database** | PostgreSQL 17 | Core identity storage, session verification, and schema routing |
| **Validation** | Zod | Runtime input schema validation for server actions |
| **Icons** | Lucide React | Minimal, accessible interface iconography |

---

## 🔄 System Data Flow

```text
       ┌──────────────────────────────┐
       │        Player Browser        │
       └──────────────┬───────────────┘
                      │
                      │ Root Cookie Scope: .rpsleague.fi
                      ▼
       ┌──────────────────────────────┐
       │     Arkalon Network Hub      │
       └──────┬────────────────┬──────┘
              │                │
   HMAC Token │                │ Shared SSO Session
   Validation │                │
              ▼                ▼
       ┌─────────────┐  ┌────────────────────────────────┐
       │ PostgreSQL  │  │         Satellite Apps         │
       │  Database   │  │  (RPS League, Daily, Labs...)  │
       └─────────────┘  └──────────────┬─────────────────┘
              ▲                        │
              │                        │ Game Telemetry &
              └────────────────────────┘ Progress Tables
```

---

## 🛡️ Single-Tab Guard & Concurrency

To preserve connection stability and prevent cross-tab state desynchronization, Arkalon Network incorporates browser-native broadcast channel guarding:

- **Collision Detection**: Real-time communication via `BroadcastChannel` checks for redundant open tabs under the same origin.
- **Heartbeat Handshake**: Outgoing tabs send discovery pings on mount; existing active instances respond with authoritative pong acknowledgments.
- **Graceful Isolation**: Flags duplicate instances to halt redundant polling, socket connections, or server-sent event streams, preventing browser memory leaks and server connection exhaustion.

---

## 🎨 Visual Shader & Typography Engine

Arkalon Network features a bespoke cyber-metallic aesthetic engineered with pure hardware-accelerated CSS:

- **Brushed Metallic Sheen**: Multi-layered background rendering broad brushed linear gradients, ambient top-reflection radials, and dark metallic undertones (`#0a0a0f` to `#12121a`).
- **Dynamic Shimmer Typography**: Animated title shaders custom-built for each ecosystem title, featuring multi-stop linear sweeps, ambient drop shadows, and high-contrast text strokes.
- **Accessible Motion Reduction**: Full `@media (prefers-reduced-motion)` containment ensuring animations gracefully collapse to static, readable frames for users with visual sensitivity.

---

## 🔐 Cryptographic Session & Security Model

Security is maintained through strict separation between public identifiers and private session credentials:

- **HMAC-Signed Session Tokens**: Authentication tokens are signed server-side using a secret-backed HMAC SHA-256 pipeline, ensuring session cookies cannot be forged or tampered with by client processes.
- **Layered Rate Limiting**: Dedicated in-memory sliding window guards against brute-force recovery attempts and excessive identity creation spikes per IP subnet.
- **Constant-Time Verification**: Cryptographic token comparisons utilize bitwise XOR verification to eliminate side-channel timing attack vectors entirely.
- **Zero Exposure of Passwords or PII**: Identity is established without storing emails, plaintext passwords, or personal identifying information in the database.

---

## 📱 Device Compatibility

Arkalon Network is built using modern web standards and responsive layout architectures:

- **Desktop & Mobile Responsive**: Optimized flex and grid layouts tailored for seamless navigation on mobile viewports, tablets, and wide desktop displays.
- **Hardware Acceleration**: Transitions and animations leverage GPU-accelerated transforms (`transform`, `opacity`) to guarantee stable 60 FPS rendering across standard modern browsers.
- **Supported Browsers**: Chrome, Firefox, Safari, and Edge (current modern releases).

---

## ⚠️ Disclaimer

Arkalon Network and all associated applications are entertainment and simulation experiences.

All points, virtual credits, ratings, cosmetics, and rewards are purely virtual and hold no real-world monetary value. No real-money gambling, cash payouts, or withdrawable balances are supported or offered anywhere in the ecosystem.

---

## 🔒 Privacy, Telemetry & Security

Arkalon Network adheres to privacy-by-design principles across all systems:

- **Subnet Masking**: Audit and error logs store only masked IP subnets (e.g. `203.0.113.x`) to evaluate service health without tracking individuals.
- **No Third-Party Tracking**: The platform operates with no third-party behavioral advertising trackers, data brokers, or marketing profiling scripts.
- **Credential Hygiene**: Recovery codes and session secrets are managed with constant-time cryptographic comparisons and isolated from public frontend exposure.

---

## 📜 License

This project is proprietary software.

Source code is not licensed for public reuse, modification, or distribution.