export const dailyInfo = `
ARKALON DAILY COMPREHENSIVE KNOWLEDGE:
--- OVERVIEW & CORE PHILOSOPHY ---
Q: What is Arkalon Daily?
A: Arkalon Daily is a browser-based daily puzzle platform offering five optional daily challenges, each targeting a distinct cognitive skill. It is fully live and integrated into the Arkalon Network.
Q: How many puzzles are there per day?
A: There are five distinct puzzle categories available every day: Recall, Surge, Cipher, Strike, and Depths. Players may attempt each category once per day.
Q: When do the puzzles reset?
A: All daily challenges reset simultaneously at 00:00 UTC. Missed days cannot be replayed, and attempting a puzzle on a new day generates a completely new deterministic seed.
Q: Is Arkalon Daily free to play?
A: Yes. Like all Arkalon applications, it is completely free with zero microtransactions, subscriptions, or pay-to-win mechanics. All progression is earned purely through gameplay.

--- THE FIVE PUZZLE CATEGORIES ---
1. RECALL (Arkalon Vision)
- Core Skill: Working memory and sequence retention.
- Mechanics: Watch a sequence of runic glyphs light up, then reproduce them from memory across three escalating rounds. Features a dynamic input time bank, audio urgency ticks, and partial credit scoring on timeout.
- Variations: Standard (static keypad), Shuffled (randomized keypad per round), Reverse (backwards entry), and Nightmare (shuffled + reverse under compressed time).

2. SURGE (Surge F9renzy)
- Core Skill: Rapid reflex to changing stimuli.
- Mechanics: A 60-second continuous survival arena where energy nodes spawn, mutate, and decay. Players must tap valid nodes while avoiding red decoy penalty nodes that reset combos.
- Variations: Features diverse spawn patterns (Spiral, Wave, Lane Switch, Corner Seq, Triple Burst, Paired, Center Out) and timing profiles (Ramp, Sudden Spike, Wave, Pressure, Endurance, Mixed).

3. CIPHER (Wild Prediction)
- Core Skill: Pattern reasoning and rule discovery.
- Mechanics: Deduce transformation rules and structural logic across 7 to 12 escalating rounds. Features single-attempt-per-round resolution with instant answer reveals on errors to eliminate brute-force guessing.
- Variations: Rule Discovery (inductive logic with YES/NO examples), Constrained Choice (multi-criteria elimination), Tri-Variable (3-axis independent cycle deduction), Dual-Variable, and Alternating.

4. STRIKE (Sniper Challenge)
- Core Skill: Controlled timing accuracy.
- Mechanics: Fire when a moving reticle crosses the target window on a 600-unit logical track. Enforces a 30% runway constraint so targets never spawn in front of the starting reticle.
- Variations: Deceptive (multi-phase feint kinematics), Staccato (stepper-motor tracking with dead-stops), Pendulum (harmonic gravity release), Erratic (high-frequency vibration), Sinusoidal, and Linear.

5. DEPTHS (Crystal Mine)
- Core Skill: Spatial deduction and grid logic.
- Mechanics: A pure, untimed spatial deduction puzzle on a 5x5 to 7x7 grid. Features outer row/column crystal counters paired with inner proximity clues, allowing 100% deterministic, zero-guess solutions. Excavating empty tiles pings Active Sonar distance data.
- Variations: Clue types include Numeric (Manhattan distance), Directional (8-way compass), Hot/Cold (thermal radar bands), and Adjacency Count. Topologies include Scattered, Clustered, Diagonal Line, Edges Only, Center Mass, Corners, L-Shape, and Split.

--- DETERMINISTIC PUZZLE ENGINE & FAIR PLAY ---
Q: How does Arkalon Daily ensure every player gets the same puzzle?
A: Daily seeds are derived server-side using HMAC-SHA256(secret, "YYYY-MM-DD:category") and consumed by a mulberry32 seeded PRNG. The raw seed never reaches the client, ensuring identical, fair challenges for everyone without server-side game ticks.
Q: Can players guess or brute-force the puzzles?
A: No. Every generated challenge passes a strict per-family validator before acceptance. For example, Depths runs a full clue-elimination solvability proof, and Strike rejects unfair kinematic combinations. Rejections re-seed deterministically so the accepted instance is identical for all players.
Q: Is scoring server-authoritative?
A: Yes. Clients submit only raw performance metrics. The server recomputes the normalized_score (0-100) from scratch. No client-side score is ever trusted.

--- PROGRESSION, STREAKS, & LEADERBOARDS ---
Q: How do streaks work in Arkalon Daily?
A: A score of 15 or higher counts as a solve and preserves your streak for that category. Missing a day or scoring below 15 breaks the streak. Streaks are recomputed by walking consecutive UTC dates backward, making them immune to missed writes or increment bugs.
Q: What are the streak milestones?
A: Milestones occur at 7, 30, 100, and 365 days. Reaching these fires rarity-tiered overlay animations (Rare, Legendary, Mythical, Rainbow) with dedicated sound stings and spoken Arkalon Voice proclamations.
Q: What leaderboards are available?
A: Daily (Top 50 per category), Weekly, All-Time, and a TOTAL cross-category aggregate tier. Leaderboards are gated by minimum-match thresholds to ensure meaningful rankings, and player-agnostic board rows are cached server-side for 45 seconds to reduce database load.
Q: What is "Yesterday's Review"?
A: A per-category community telemetry screen showing player count, average score, median, top-1% threshold, and a five-bucket score distribution from the previous UTC day, plus your personal rank and percentile if you played.

--- IDENTITY, RECOVERY, & PWA ---
Q: Do I need an account to play Arkalon Daily?
A: No. Identity is provisioned instantly by the Arkalon Network hub as an anonymous core UUID shared across the ecosystem via root cookies. Nicknames are procedurally generated and rerollable at any time.
Q: How do I protect my streaks across devices?
A: Save your human-readable Recovery Code from the Arkalon Network settings. It is the only cross-device restoration mechanism. A one-time Recovery Tutorial overlay teaches players to save this code before their first streak is at risk.
Q: Can I install Arkalon Daily as an app?
A: Yes. It is a fully installable Progressive Web App (PWA) on iOS (Safari), Android (Chrome), and desktop browsers, launching in a standalone, borderless window with custom icons and offline-resilient architecture.

--- AUDIO & ARKALON VOICE ---
Q: What audio features does Arkalon Daily have?
A: Three independent channels (Sound FX, Background Music, Arkalon Voice), each with its own toggle and volume control. Music rotates genre-distinct tracks per category (e.g., IDM for Cipher, dub-techno for Depths).
Q: What is the Arkalon Voice in Daily?
A: Browser-native Web Speech API delivers spoken proclamations at zero server cost. Arkalon speaks the daily welcome, category entries, result verdicts, and milestone proclamations with synthetic cadence pauses, adapting to your enabled volume.

--- TRIALS & ONBOARDING ---
Q: What are Trials in Arkalon Daily?
A: First contact with each category opens a Trial: a multi-screen explainer followed by a seeded practice run on fixed trial seeds. Trials feature constrained axes (e.g., no deceptive motion in Strike, numeric clues only in Depths) to introduce mechanics without difficulty spikes. A persistent amber banner clarifies that trial runs never count toward streaks or leaderboards.
`.trim()
