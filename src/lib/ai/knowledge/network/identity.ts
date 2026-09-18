export const identitySystem = `
ARKALON CORE IDENTITY & SECURITY ARCHITECTURE:

--- ZERO-FRICTION ACCOUNT CREATION ---
- Visiting any application on the Arkalon Network instantly provisions a secure, persistent account.
- No email, phone number, password, or third-party OAuth registration is ever required.
- Zero Personal Identifiable Information (PII) is stored or requested.

--- IDENTITY PARAMETERS ---
1. Procedural Nickname:
    - Format: [Adjective] + [Color] + [Animal] (e.g., "AncientGoldTurtle", "SwiftCrimsonHawk").
    - Generated from a closed 3-tier dictionary (104 adjectives x 83 colors x 100 animals = ~863,000 combinations).
    - Custom manual nickname typing is NOT permitted to maintain thematic integrity and avoid profanity.
    - Players may reroll their procedural nickname at any time for free using the "Reroll" button in Settings.
2. Short ID:
    - 10-character URL-safe identifier (e.g., "Hqo7qUSe38").
    - Uses a 54-character base set that omits ambiguous characters (0, O, 1, l, I).
    - Serves as the public identifier across cross-game leaderboards, profiles, and match history.
3. Master Recovery Code:
    - Cryptographically generated server-side mnemonic format: WORD-WORD-DIGITS (e.g., "SWIFT-CRYSTAL-8214").
    - 256-word curated bank: 256 x 256 x 10,000 = ~655 million unique combinations.
    - Master key used for cross-device migration and profile recovery.
    - Case-insensitive when entered in the Restore interface.

--- RECOVERY PRIVACY & REVEAL UX ---
- Recovery codes are strictly confidential master keys.
- To prevent shoulder-surfing and accidental screen exposure, recovery codes remain blurred behind real-time CSS filters in the Settings panel until explicitly unlocked via the "Reveal" button.
- One-click clipboard copy is available once revealed.
- CRITICAL WARNING: If browser local cookies are cleared without saving the recovery code, account progress is PERMANENTLY LOST. Developers cannot manually recover lost unlinked profiles.

--- DUAL-COOKIE SESSION & SSO ENGINE ---
Arkalon Core uses a two-tier cookie system scoped to the parent root domain (.rpsleague.fi) for silent single sign-on (SSO):
1. arkalon_core_id:
    - Lifespan: 1 Year (Persistent).
    - Scope: Root-domain (.rpsleague.fi), HttpOnly, Secure, SameSite=Lax.
    - Payload: The account's permanent UUID anchor.
2. arkalon_session:
    - Lifespan: 30 Days (Rolling session).
    - Scope: Root-domain (.rpsleague.fi), HttpOnly, Secure, SameSite=Lax.
    - Security: HMAC-signed using SHA-256 with the server's SESSION_SECRET. Verified in constant time (timingSafeEqual) before granting access to identity or voting actions.

--- RATE LIMITING & ATTACK MITIGATION ---
Sliding-window in-memory rate limiters protect the system at the IP subnet boundary:
- Identity Creation: Maximum 5 new identities per hour per IP.
- Recovery Attempts: Maximum 10 recovery verification attempts per hour per IP (anti brute-force).
- AI Oracle Queries: 5 queries per minute with escalating violation cooldowns (1m, 5m, 15m, 60m).
- IPs are processed transiently in memory for rate tracking and are never stored in database logs.
`
