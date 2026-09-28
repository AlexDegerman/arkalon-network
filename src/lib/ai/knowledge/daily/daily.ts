export const dailyInfo = `
ARKALON DAILY COMPREHENSIVE KNOWLEDGE BASE:

================================================================================
1. OVERVIEW & CORE PHILOSOPHY
================================================================================
Q: What is Arkalon Daily?
A: Arkalon Daily (https://daily.rpsleague.fi) is a high-precision, browser-based daily cognitive challenge platform integrated into the Arkalon Network. It features five distinct daily puzzles—Recall, Surge, Cipher, Strike, and Depths—each designed to test and track a specific mental faculty: working memory, reflex speed, inductive logic, timing accuracy, and spatial deduction.

Q: What is the core daily loop and reset time?
A: Challenges reset worldwide every day at 00:00 UTC. Every player globally receives the exact same deterministic challenges on any given day. Players receive exactly one ranked daily attempt per category per day. Once completed, scores and streaks are permanently logged. Incomplete sessions cannot be replayed after midnight UTC.

Q: Is Arkalon Daily free and fair?
A: Yes. Arkalon Daily has zero pay-to-win mechanics, zero subscriptions, zero ads, and zero microtransactions. It features 100% server-authoritative scoring where client scores are never trusted, rigorous constraint-elimination solvability proofs, and deterministic seeding that guarantees zero-guess fairness.

Q: Where does Arkalon Daily fit in the Arkalon ecosystem?
A: Arkalon Daily is a core satellite application in the Arkalon Network (alongside RPS League and upcoming titles like Labs, Tower Defense, and Realms). It shares the unified Arkalon Core ID identity layer, procedural nicknames, cloud recovery codes, audio direction, and the cosmic 12-tier score visual shader system.

================================================================================
2. THE FIVE COGNITIVE DISCIPLINES & PUZZLE FAMILIES
================================================================================

--------------------------------------------------------------------------------
1. RECALL (Puzzle Family: Arkalon Vision)
--------------------------------------------------------------------------------
- Core Discipline: Working memory, sequence retention, and cognitive manipulation under pressure.
- Presentation: A runic display portal above an interactive 16-symbol runic keypad.
- Symbol Pool: 16 canonical runic glyphs:
  ◆ (filled diamond), ▲ (filled triangle up), ● (filled circle), ■ (filled square),
  ★ (filled star), ◇ (hollow diamond), ▼ (filled triangle down), ○ (hollow circle),
  ⬡ (hollow hexagon), ✦ (four-pointed star), ⬢ (filled hexagon), △ (hollow triangle up),
  ◈ (compound diamond), ⊕ (circled plus), ▣ (square with inner square), ✧ (hollow four-pointed star).
- Active Glyphs: Drawn contiguously from index 0 across pools of 8, 10, 12, 14, or 16 glyphs.
- Progression: Exactly 3 escalating rounds per session (e.g., lengths [3, 5, 7] up to [6, 9, 12]). No adjacent duplicate glyphs are permitted.
- Pacing & Timers:
  * Display Phase: Glyphs flash sequentially at 500ms to 1000ms per glyph (with ±12% continuous seed variance, locked to a hard playability floor of ≥450ms). Synchronized with acoustic sequence ticks.
  * Input Phase: An accessible, generous decaying visual time gauge:
    Time Bank Formula: T = max(18, round((6 + 2 * sequenceLength) * 1.5)) seconds.
    (Length 3 = 18s, Length 5 = 24s, Length 7 = 30s, Length 10 = 39s, Length 12 = 45s).
  * Audio Urgency: Distinct countdown ticks trigger at 3s, 2s, and 1s remaining as the timer turns crimson.
- Timeout Handling: If the timer expires, all unentered glyphs are logged as errors, partial credit is awarded for correctly entered symbols, and the puzzle advances.
- Scoring Model (Continuous Weighted):
  * Round Weights: Round 1 (35%), Round 2 (30%), Round 3 (35%).
  * Speed Multiplier Formula:
    idealMs = sequenceLength * 1400ms
    maxMs = sequenceLength * 3200ms
    speedMult = max(0.85, 1.0 - ((elapsedMs - idealMs) / (maxMs - idealMs)) * 0.15)
  * Final Score: Sum of (accuracy * weight * speedMult) across all 3 rounds, clamped to 0–100. Slower players who enter glyphs accurately preserve up to 85% of their score.
- Archetypes & Variations:
  * Standard: Static keypad layout across all 3 rounds, forward input order.
  * Shuffled (randomizedLayout): Keypad buttons randomize positions every round to prevent muscle-memory shortcuts.
  * Reverse Entry (reverseEntry): Players must input the sequence backwards (from last glyph seen back to first).
  * Nightmare: Combines randomized keypad layout AND reverse sequence entry under compressed display durations.

--------------------------------------------------------------------------------
2. SURGE (Puzzle Family: Surge Frenzy)
--------------------------------------------------------------------------------
- Core Discipline: High-speed motor reflex, peripheral awareness, and target discrimination.
- Presentation: A 600x400 logical unit kinetic arena with responsive scaling, dynamic combo HUD, and floating reaction tags.
- Session Length: 60 seconds standard (or 45s for Slow Short / 90s for Fast Long profiles).
- Targets & Controls:
  * Energy Nodes: Cyan/blue glowing nodes. Tapping or pressing Space / Z / X over them scores points and advances combos.
  * Decoy Nodes: Red nodes (#ff3b5c). Striking a decoy incurs an immediate -2.0 raw score penalty and resets the combo streak to zero. Valid challenges enforce a strict decoy ratio ceiling of ≤40%.
  * Input Ergonomics: Minimum physical tap target floor of 48px on mobile viewports; visual orb minimum floor of 32px diameter.
- Live Combo Multiplier:
  * Formula: multiplier = 1.0 + min(consecutiveHits * 0.05, 0.5) (Max 1.5x score multiplier reached at 10+ consecutive hits).
  * Auditory Feedback: Tap audio pitch-shifts upward as consecutive combo escalates.
- Reaction Micro-Grading:
  * PERFECT: <300ms (1.0x grade value)
  * FAST: <450ms (0.85x grade value)
  * GOOD: <650ms (0.70x grade value)
  * OK: <900ms (0.45x grade value)
  * LATE: <1400ms (0.25x grade value)
  * MISS: Expired node or ≥1400ms (0.0x value)
- Scoring Model (Speed-First with Multipliers):
  * Base Value Per Node: 100 / expectedNodeCount
  * Node Score: baseValue * reactionGrade * comboMultiplier - (2.0 if decoy hit)
- The 7 Spawn Patterns:
  * Spiral: Golden-angle (137.5°) vortex swirling inward toward the center.
  * Wave: Sinusoidal horizontal wave oscillating across the arena (y = 200 + 120 * sin(pi * x / 300)).
  * Lane Switch: Nodes confined to top, middle, and bottom corridor tracks separated by dashed boundary rails.
  * Corner Seq: Rapid clockwise 4-corner screen-width flick jumps testing peripheral re-acquisition.
  * Triple Burst: Clustered 3-node simultaneous spawns with expanded lifetimes (1.0 + 0.35 * (count - 1)).
  * Paired: Symmetrical bilateral mirror spawns across the vertical center line.
  * Center Out: 4 radial nodes exploding outward from center to perimeter.
- Target Behaviors:
  * Stationary: Fixed position.
  * Fading: Opacity decays over lifetime (1 - progress).
  * Shrinking: Radius contracts up to 50% over lifetime.
  * Growing: Radius expands over lifetime.
  * Moving: Linear drift (+35px * progress).
  * Brief: Flash visibility window.

--------------------------------------------------------------------------------
3. CIPHER (Puzzle Family: Wild Prediction)
--------------------------------------------------------------------------------
- Core Discipline: Inductive pattern deduction, rule discovery, and logical elimination.
- Presentation: High-density symbol puzzle card displaying sequence elements and choice buttons.
- Rounds: 7 to 12 rounds per challenge. Single-attempt resolution per round: submitting an incorrect choice immediately reveals the correct answer, logs an error, and advances to eliminate brute-force guessing.
- Elements: 6 Shapes (circle, square, triangle, diamond, hexagon, star), 6 Colors (red, blue, green, yellow, purple, orange), and 3 Sizes (small, medium, large).
- Pacing & Timers:
  * Generous time limits: 14s to 18s per round (with a 20s floor on complex rule discovery and constrained choice rounds).
  * Decaying visual time gauge across the card top, turning critical red on the final 3 seconds with acoustic timer-ticks.
- Scoring Model (Logic-First: Accuracy + Error Efficiency):
  * Accuracy Base: (correctRounds / totalRounds) * 80 points.
  * Efficiency Bonus: 20 * max(0, 1.0 - totalIncorrectGuesses / totalRounds) points.
  * Maximum Score: 100 points. Elapsed time has zero impact on the score.
- The 5 Pattern Generators:
  * Rule Discovery (rule_discovery): Presents 3 positive (YES) and 2 negative (NO) examples. Players must deduce the unstated underlying rule:
    - Specific Color (e.g., all YES items are blue)
    - Specific Shape (e.g., all YES items are hexagons)
    - Specific Size (e.g., all YES items are small)
    - Color Family (Warm tones: red/orange/yellow vs Cool tones: blue/green/purple).
    - Correct answer is a novel valid element not shown in YES; distractors are invalid elements not shown in NO.
  * Constrained Choice (constrained_choice): Multi-criteria elimination under timer pressure with 3 to 4 simultaneous constraints:
    - Affirmation ("Must be [trait]")
    - Exclusion ("Cannot be [trait]")
    - Tone ("Must be warm-toned" / "Must be cool-toned")
    - XOR ("Must be [color] or [shape], but not both")
    - Trait Intersection ("Shares exactly one trait with [reference]" or "Shares no traits")
    - Conditional Implication ("If it is [color], it must be [size]")
    - Distractors are deliberate near-misses that satisfy all constraints except exactly one.
  * Tri-Variable (tri_variable): 3 independent cycles rotating out-of-sync on prime periods: shapes (3-5), colors (2-3), sizes (2-3).
  * Dual-Variable (dual_variable): 2-axis matrix cycle (shapes on period 3, colors on period 2, size held constant).
  * Alternating (alternating): Binary A -> B -> A -> B alternating sequence.

--------------------------------------------------------------------------------
4. STRIKE (Puzzle Family: Sniper Challenge)
--------------------------------------------------------------------------------
- Core Discipline: Millisecond precision timing and kinematic trajectory prediction.
- Presentation: A 600-unit logical track with a target zone, moving reticle line, and prominent thumb-zone FIRE trigger (or Space / Enter).
- Session Length: 15 to 30 shots per session.
- Track Mechanics: Enforces a strict 30% runway constraint (min target center = 180px) so targets never spawn on top of the initial reticle position.
- Deviation Grading:
  * PERFECT: <5px deviation from center (1.0x grade value)
  * EXCELLENT: <15px deviation (0.8x grade value)
  * GOOD: <50% of target window (0.55x grade value)
  * EARLY / LATE: Inside target window but >50% (0.25x grade value)
  * MISS: Outside target window (0.0x value)
- Scoring Model (Precision Speed-First):
  * Per-Shot Maximum: 100 / shotCount
  * Final Score: Sum of (gradeValue * perShotMax) across all shots.
- The 6 Kinematics Motion Functions:
  * Linear: Constant high-speed passes (1.8x–2.3x) bouncing between 0 and 600px.
  * Sinusoidal: Smooth harmonic sine wave oscillation across track width (300 + 250 * sin(2pi * f * t * speed)). Provides a 2-cycle traversal allowance (min 3.5s).
  * Erratic: High-frequency dual-sine vibration flutter (linear + 10*sin(7.3t) + 6*sin(13.1t)).
  * Pendulum: Harmonic gravity sweep (x(t) = 300 - 260*cos(omega * t)). Whips at peak kinetic velocity through center, slowing to a stop at apex edges.
  * Staccato: Stepper-motor tracking. Advances in rapid 250ms bursts separated by 150ms dead-stops.
  * Deceptive: Multi-phase feint kinematics. The reticle approaches linearly to within 100px of target, decelerates to 30% speed for 300ms, reverses backward at -25% velocity for 200ms, then accelerates forward through the target at 1.2x velocity.

--------------------------------------------------------------------------------
5. DEPTHS (Puzzle Family: Crystal Mine)
--------------------------------------------------------------------------------
- Core Discipline: Spatial deduction, line elimination, and combinatorial grid reasoning.
- Presentation: An untimed 5x5, 6x6, or 7x7 Seismic Matrix featuring outer row/column Nonogram crystal counters and internal sensor tiles.
- Core Objective: Excavate all buried crystals before expending your limited charge budget.
- Perimeter Nonogram Counters: Numbers along the top and left borders indicate the EXACT total count of crystals buried in that entire column or row.
- Sensor Clue Types:
  * Numeric: Exact Manhattan distance (|r1-r2| + |c1-c2|) in steps to the nearest crystal.
  * Directional: 8-way compass vector arrows (→, ↘, ↓, ↙, ←, ↖, ↑, ↗) pointing directly toward the nearest crystal.
  * Hot / Cold: Thermal proximity bands: HOT (≤1 step), WARM (≤3 steps), COLD (>3 steps).
  * Adjacency Count: Exact count of crystals buried in the 8 immediately surrounding Moore-neighborhood cells (0 to 8, Minesweeper style).
- Active Sonar Triangulation: Digging an empty tile triggers a sonar ping that ALWAYS reveals the numeric Manhattan distance from that excavated cell to the nearest deposit, turning misses into vital triangulation data.
- Tile Flagging: Right-click, long-press (450ms), or toggle the Mark/Dig button to place a suspected crystal marker (🚩) without spending charges.
- Charge Limit Formula:
  chargeLimit = depositCount + clueTypePenalty + floor(gridSize^2 * 0.08)
  (Penalties: numeric = 0, directional = 2, adjacency_count = 1, hot_cold = 3).
- Auto-Scan Solution Reveal: If charges run out with crystals still buried, an automated acoustic scan sequence reveals all missed crystal locations in dashed grayscale, showing the complete solution without altering your final score.
- Scoring Model (Discovery + Charge Efficiency):
  * Discovery Base: (depositsFound / totalDeposits) * 80 points.
  * Charge Efficiency Bonus:
    wastedCharges = chargesUsed - depositsFound
    maxWaste = chargeLimit - totalDeposits
    efficiencyBonus = maxWaste > 0 ? 20 * min(1, max(0, 1.0 - wastedCharges / maxWaste)) : 0
  * Maximum Score: 100 points. Untimed puzzle—elapsed time has zero impact on score.
- Deposit Topology Templates: Scattered, Clustered, Diagonal Line, Edges Only, Center Mass, Corners, L-Shape, and Split.

================================================================================
3. DETERMINISTIC ENGINE & SOLVABILITY PROOFS
================================================================================
Q: How does Arkalon Daily ensure identical puzzles globally without live game ticks?
A: Daily seeds are derived server-side via HMAC-SHA256(secret, "YYYY-MM-DD:category") and fed into mulberry32, a 32-bit seeded PRNG. Raw seeds never touch the client. Every player receives the exact same targets, glyphs, and clues.

Q: How does Arkalon Daily prevent unsolvable or unfair puzzles?
A: Every generated puzzle passes through a strict per-family validator before acceptance:
- Depths: Runs a complete server-side constraint-elimination solvability proof. Simulates clue elimination logic and verifies that all deposits can be deduced within the charge budget without guessing. Rejects degenerate hot/cold layouts.
- Strike: Rejects deceptive motion combined with speeds ≥2.5x on windows <25px.
- Surge: Rejects decoy ratios exceeding 40% and pressure timing combined with splitting targets.
- Recall: Rejects display durations under 450ms per glyph and consecutive duplicate symbols.
- Cipher: Rejects rounds with duplicate choices, missing answers, or monotone generator sequences.
If a candidate seed fails validation, it deterministically re-seeds using a counter prefix (attempt.toString(16) + baseSeed.slice(2)). All players converge on the same validated challenge instance.

================================================================================
4. SCORING, SHADERS, & RARITY TIERS
================================================================================
Q: What score is needed to solve a puzzle and maintain a streak?
A: A score of 15 or higher (STREAK_MIN_SCORE) counts as a solve (✓ PASS) and preserves your streak for that category. Scores below 15 count as a failure (✗ FAIL) and reset the streak.

Q: What are the 12 cosmic score tier shaders?
A: Scores map to dynamic, animated CSS-first text shaders adapted from RPS League:
- Tier 1  (0–14):   Slate Steel (g-vg) - Muted slate text with subtle drop shadow.
- Tier 2  (15–29):  Vessel Lock (g-qnqg) - Steel blue with sweeping amber streak line.
- Tier 3  (30–39):  Novemtrigintillion (g-ntg) - Fluid emerald green text flow.
- Tier 4  (40–49):  Wave Sapphire (g-sp) - Flowing cyan and sapphire ocean wave.
- Tier 5  (50–59):  Electric Sky (g-dc) - White-hot cyan electric shimmer with neon aura.
- Tier 6  (60–69):  Abyssal Trench (g-nvg) - Deep oceanic teal with cyan border.
- Tier 7  (70–79):  Dune Mirage (g-qntr) - Amber and gold desert sand sweep.
- Tier 8  (80–84):  Phantasm Core (g-str) - Royal purple infused with flowing gold veins.
- Tier 9  (85–89):  Moonlight (g-uvg) - Luminous silver-blue lunar core with celestial glow.
- Tier 10 (90–95):  Duoquinquagintillion (g-dqgs) - Crystalline violet and magenta prism.
- Tier 11 (96–99):  Solar Prominence (g-ttr) - Amber-gold with white-hot solar flare core.
- Tier 12 (100):    Royal Treasure Pile (g-tqgs) - Blazing liquid gold flow with white specular flash.

Q: What are the 5 result card and streak rarity auras?
A: Result frames and milestone badges feature rarity aura effects:
- Common (0–49): Neutral border-subtle.
- Rare (50–69): Azure neon bloom (aura-rare).
- Epic (70–84): Royal amethyst aura (aura-epic).
- Legendary (85–95): Radiant golden flame aura (aura-legendary).
- Mythical (96–100): Crimson holy fire aura (aura-mythical).
- God-King (365d Streak Milestone): Multi-spectral rainbow oil-slick aura (aura-godking).

================================================================================
5. STREAKS, MILESTONES, & ARKALON VOICE
================================================================================
Q: How are streaks calculated?
A: Streaks are computed authoritatively on the server by walking consecutive UTC dates backward from today. This makes streaks completely immune to missed database writes, client clock manipulation, or increment bugs.

Q: What happens when a player reaches a streak milestone?
A: Milestones celebrate at 7, 30, 100, and 365 consecutive days per category. Reaching a milestone fires:
1. A celebratory rarity-tiered overlay with sound stings (streak-7, streak-30, streak-100, streak-365).
2. Spoken Arkalon Voice proclamation:
   - 7 Days: "Seven cycles... unbroken."
   - 30 Days: "Thirty cycles... your persistence... is noted."
   - 100 Days: "One hundred cycles... remarkable... endurance."
   - 365 Days: "A full revolution... around the star. Extraordinary."
Celebrations occur exactly once per category milestone and are tracked in players.milestones_celebrated.

Q: What is Arkalon Voice and how does it work?
A: The Arkalon Voice is a browser-native synthesized ancient voice using the Web Speech API at pitch 0.25 and rate 0.75, with synthetic cadence pauses inserted between words. It delivers the daily welcome, category entry rituals, result verdicts, and milestone proclamations with zero server or API costs. It has an independent volume slider and can be toggled in audio settings.

================================================================================
6. LEADERBOARDS & YESTERDAY'S REVIEW
================================================================================
Q: What leaderboard views are available?
A: Leaderboards feature category tabs (Recall, Surge, Cipher, Strike, Depths, and TOTAL) across three time scopes:
- Daily: Top 50 ranked by normalizedScore DESC, then elapsedMs ASC. Out-of-top-50 players receive their exact global rank.
- Weekly: Monday 00:00 UTC to Sunday 23:59 UTC aggregate. Gated by a minimum of 3 category clears (or 5 total clears).
- All-Time: Lifetime aggregate rankings. Gated by a minimum of 10 category clears (or 25 total clears).
- TOTAL Scope: Cross-category pentathlon combining performance across all five categories with per-category clear pips.

Q: What is Provisional Status?
A: When viewing Weekly or All-Time boards before meeting the minimum match threshold, a provisional banner shows your progress pips (e.g., "2/3 puzzles to rank") and current average score.

Q: What is "Yesterday's Review"?
A: Accessible from category cards once yesterday's puzzle concludes. Displays community telemetry: total players, average score, median score, top 1% cutoff, a 5-bucket score distribution bar chart, and your personal rank and percentile. To prevent statistical noise, review is suppressed if fewer than 25 players participated in that category.

================================================================================
7. ONBOARDING: TRIALS VS VARIATION BRIEFINGS
================================================================================
Q: What are Trials?
A: First contact with any category opens a guided Practice Trial. Trials use fixed seeds (TRIAL_SEEDS) and are intentionally constrained to basic mechanics (numeric clues only, forward keypad only, linear motion, no deceptive feints) so beginners learn without difficulty spikes.
- Persistent amber banner: "Trial Run · This does not count toward your daily challenge".
- Preview score screen upon completion unlocks the real daily challenge.
- Tracked in players.trials_completed.

Q: What are Pre-Flight Variation Briefings?
A: Unlike basic trials, Variation Briefings appear ONLY on standard daily challenges when today's seed rolls an advanced modifier archetype that the player has not seen before:
- Depths: Explains Compass Arrows, Thermal Radar, or Adjacency Counts.
- Strike: Explains Deceptive Feints, Stepper Motor (Staccato), Pendulum, or Erratic flutter.
- Recall: Explains Reverse Entry, Scrambled Keypad, or Nightmare mode.
- Cipher: Explains Inductive Rule Discovery (YES/NO) or Multi-Constraint Elimination.
- Surge: Explains specific topologies (Corner Sequence, Spiral, Wave, Lanes, Triple Burst).
Features a "Don't show tips for this variation again" checkbox (persisted in arkalon_seen_modifiers) and can be re-opened anytime during gameplay via the (?) Help icon in the header.

================================================================================
8. IDENTITY, PROFILES, & SECURITY
================================================================================
Q: Do players need to create an account or password?
A: No. Identity is provisioned seamlessly by the Arkalon Network hub via root cookies (arkalon_core_id) shared across all .rpsleague.fi subdomains. Nicknames are procedurally generated (e.g., AncientGoldTurtle, NovaPrimeAsh) and rerollable at any time.

Q: How do players restore progress on a new device?
A: Through their Arkalon Network Recovery Code. Profiles are anchored to the Core ID. Saving the recovery code from https://network.rpsleague.fi allows restoring streaks and stats on any browser or phone without passwords or emails. A one-time Recovery Tutorial teaches players to save their code before their first streak is at risk.

Q: What does the Player Profile show?
A:
- Deterministic Avatar: Generated algorithmically using an FNV-1a hash of the player's UUID to determine dual-tone gradient hues, overlaid with nickname initials.
- Badges: Total puzzles played, active streaks count, and trial progress.
- Skill Profile: Normalized 5-bar radar chart of average scores across all five categories (unlocks after 3+ plays per category).
- Category Stats Panels: Today's result (score and pass/fail), personal best, average score, days played, current streak, longest streak, and global percentile (suppressed below 25 players).
- Share Profile: Direct URL copying (https://daily.rpsleague.fi/profile/[shortId]).

================================================================================
9. SHARE CARDS & SOCIAL STRIPS
================================================================================
Q: How do Arkalon Daily share cards work?
A: Share cards render client-side at 540x675px at 2x resolution using html2canvas and export to the Web Share API (or image download + clipboard text fallback on desktop). Score numbers render in solid tier-matched colors for maximum visual fidelity.

Q: What is a Category Performance Strip on share cards?
A: Every category renders a unique visual diagram communicating round-by-round attempt telemetry:
- Recall: Accuracy grid with green and red runic blocks for every sequence element.
- Surge: 32-node vertical bar chart color-coded by reaction speed (green <150ms, cyan <300ms, amber <600ms, red misses).
- Cipher: Round-by-round checkmark (✓) or cross (✗) sequence labeled R1, R2, etc.
- Strike: Monospace grade letter sequence: P (Perfect), E (Excellent), G (Good), L (Late), ◇ (Miss).
- Depths: A mini-excavation matrix displaying exact discovered crystal grid coordinates.

================================================================================
10. SESSION INTEGRITY & FAIR PLAY
================================================================================
Q: What anti-exploit protections exist?
A:
- One attempt per day enforced by PostgreSQL database UNIQUE(player_id, puzzle_date, category) constraint.
- Rate Limiting: Max 5 submissions per minute per player.
- Tab Guard: Uses BroadcastChannel to detect duplicate open tabs and pauses gameplay.
- Blurring Pause Overlay: Pausing the game (via Escape or tab switch) blurs the game canvas completely to prevent studying the board while paused. Resumes with a 3-2-1 countdown. All paused milliseconds are excluded from timing telemetry.
- Mid-Session Persistence: Turn-based puzzles (Recall, Cipher, Depths) store partial round state in localStorage so accidental page reloads resume rather than reset. Real-time puzzles (Surge, Strike) track wall-clock timestamps so refreshing cannot be exploited to replay missed targets.

================================================================================
11. TECHNICAL ARCHITECTURE & DEPLOYMENT
================================================================================
- Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- State Management: Zustand 5 (uiStore, puzzleStore, musicStore).
- Backend & Actions: Next.js Server Actions with strict Zod payload validation.
- Database: PostgreSQL 17 on private Docker network (db-net).
- Audio Engine: 3 channels. Web Audio API polyphony engine with 6 simultaneous voices and voice stealing for high-frequency Surge taps; HTML5 audio pools for standard sound effects; Web Speech API for Arkalon Voice.
- Deployment: Docker container on Hetzner Cloud VPS behind Caddy reverse proxy with automatic TLS. Automated CI/CD via GitHub Actions.
- Crontab: Daily puzzle generation runs at 00:00 UTC hitting secret-protected endpoint /api/cron/generate-daily.
`.trim()
