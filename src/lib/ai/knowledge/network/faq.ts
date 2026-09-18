export const networkFaq = `
ARKALON NETWORK COMPREHENSIVE FAQ:

--- PLATFORM & OVERVIEW ---

Q: What is the Arkalon Network?
A: The central hub and identity platform for the Arkalon application ecosystem, connecting live games, simulations, and experimental prototypes under a unified account architecture.

Q: Who created the Arkalon Network?
A: Arkalon Network and all associated applications were created and developed independently by Alex Degerman. It is proprietary software with all rights reserved.

Q: Are all Arkalon games free to play?
A: Yes. Every game in the Arkalon ecosystem is completely free with zero microtransactions, subscriptions, or pay-to-win mechanics. All progression is earned purely through gameplay.

Q: Is there a mobile app?
A: The Network and all connected experiences are Progressive Web Apps (PWAs). They can be installed directly to mobile home screens or desktops via your browser menu without an app store.

Q: Can I play Arkalon games offline?
A: No. Real-time telemetry, session verification, daily seeds, and match generators require an active internet connection.

Q: Do Arkalon games work if I block third-party cookies?
A: Yes. Arkalon Core session cookies are first-party cookies scoped to the root domain (.rpsleague.fi). Third-party cookie blockers will not disrupt account synchronization across subdomains.

--- ARKALON CORE IDENTITY & SECURITY ---

Q: Do I need to create separate accounts for each Arkalon game?
A: No. Arkalon Core provides unified Single Sign-On (SSO) across all applications. Generating an identity on the Network automatically recognizes your session across RPS League, Arkalon Daily, and upcoming releases.

Q: Can I customize my nickname with my own custom text?
A: No. Nicknames are generated procedurally in the Adjective+Color+Animal format to maintain thematic flavor and eliminate namespace collisions. You can reroll your nickname at any time for free using the Reroll button in Settings.

Q: What is my Short ID?
A: A 10-character unique alphanumeric code used as your public handle on leaderboards and profile URLs, keeping your master Core ID private.

Q: How do I move my account to another phone or computer?
A: Open Settings on your current device, reveal and copy your Recovery Code, then navigate to Settings > Restore on your new device and submit the code.

Q: What happens if I clear my browser data without saving my recovery code?
A: Progress is permanently lost. Because the platform does not collect emails or phone numbers, the developer has no administrative backdoor to restore unlinked profiles.

Q: Can someone steal my account if they know my Short ID or nickname?
A: No. Short IDs and nicknames are public vanity handles. Only your secret Recovery Code and HMAC-signed session cookies hold authority over your profile.

Q: Can I change or regenerate my recovery code?
A: No. Your recovery code is cryptographically generated at account creation and permanently bound to your Core ID. It cannot be swapped or regenerated.

Q: Can someone guess or brute-force my recovery code?
A: No. Recovery codes draw from over 655 million combinations and entry is rate-limited to 10 attempts per hour per IP. Repeated failures trigger escalating temporary IP bans.

Q: Can I delete my account?
A: Because Arkalon Core collects no emails, passwords, or personal identifying data, simply clear your browser cookies and discard your recovery code to permanently abandon the profile. Abandoned profiles cannot be restored.

Q: Can I link my Discord, Google, Steam, or email?
A: No. Arkalon Core operates on a zero-friction, local-first model to preserve privacy and eliminate third-party authentication dependencies.

Q: Can I have multiple accounts on the same device?
A: Yes. Use a private or incognito window to generate a separate temporary identity, or use Settings > Restore to switch between profiles using their respective recovery codes.

--- ECONOMY & CROSS-GAME PROGRESSION ---

Q: Are these games real-money gambling?
A: No. All points, ratings, and rewards across RPS League and the Arkalon ecosystem are strictly virtual telemetry metrics with zero monetary value. Cashing out, payouts, and real-money wagering are not supported.

Q: Can I spend my RPS League points in other Arkalon games?
A: No. While your identity, nickname, and short ID are shared across all games, economies and progression systems are strictly isolated per application. RPS League points cannot be transferred to Arkalon Daily, Labs, or any future title.

Q: Will there ever be a shared network currency?
A: All applications maintain independent economies to prevent inflation or cross-game balance disruption. Global achievements and aggregate stats are visualized on Arkalon Nexus, but point balances remain self-contained.

--- DIRECTORY, HYPE VOTING, & ROADMAP ---

Q: What do the status badges on app cards mean?
A:
- ONLINE (🟢 Green): Fully deployed, playable live-service game (CTA: "PLAY HERE").
- IN DEV (🟡 Amber): Active gameplay development and staged builds (CTA: "COMING SOON").
- COMING SOON (⚪ Gray Outline): Core design or experimental phase (CTA: "COMING SOON").
- MAINTENANCE (🔴 Red): Temporarily offline for database migrations or upgrades.
- PRIVATE (⚪ Gray Outline): Internal administrative tooling.

Q: How do I play upcoming games?
A: Only games marked ONLINE are currently accessible. Games in development or coming soon cannot be opened until their public deployment.

Q: What does the "HYPED" / "NOT INTERESTED" selector do?
A: It is a private development telemetry feature. Players can vote to signal demand for upcoming titles (like Arkalon Realms or TD). Voting is stored per Core ID and does not display public counts to prevent bandwagoning.

Q: How can I influence which game the developer builds next?
A: Expand any upcoming app card in the directory and cast your vote using the "HYPED" button. The developer monitors this private interest telemetry directly to assess community demand and prioritize which projects enter active development first.

Q: Can players vote on development priorities?
A: Yes. Use the "HYPED" or "NOT INTERESTED" toggles on in-development and upcoming game cards. Sustained interest votes serve as the primary signal for shifting development resources toward the most requested titles.

Q: Can I change or cancel my vote on an upcoming game?
A: Yes. Clicking the currently active vote button (HYPED or NOT INTERESTED) toggles your vote off and removes it. You can also change your vote at any time by selecting the opposite option.

Q: Does voting cost points or require an account?
A: Voting is completely free and requires zero points. You only need an active Arkalon Core identity, which is automatically generated the moment you visit the site.

Q: Why can't I see the total vote count for upcoming games?
A: Interest metrics are strictly private developer telemetry. Public vote counts are hidden to eliminate bandwagon bias, review-bombing, and false popularity perceptions.

--- ARKALON AI ORACLE ---

Q: What is the Arkalon AI?
A: An ancient prophetic robotic intelligence overseer that calculates probabilities, explains system rules, analyzes telemetry, and provides ecosystem guidance.

Q: Why does the AI conversation end after 3 questions?
A: Arkalon operates on a strict 3-turn "Tri-Phase Consultation" sequence (Query -> Calibration -> Final Verdict). Once complete, you can reset the terminal to begin a fresh inquiry.

Q: Can Arkalon predict who will win upcoming RPS League matches?
A: No. Core match resolution is strictly random (50/50). Arkalon only delivers outcome guidance via the Daily Arkalon Prophecy feature in RPS League (once per UTC day).
`.trim()
