# 🧪 Test Suite

Unit and integration tests covering Arkalon Network identity flows, session security, directory state management, RAG retrieval, and AI oracle telemetry.

## 🛡️ Server Actions Test Coverage

- **Identity Actions**: Validates core identity creation, existing session detection, recovery code restoration, nickname rerolling, and rate limit enforcement for creation and recovery endpoints.
- **Session Validation**: Verifies HMAC token verification, cookie matching, database session lookup, and expiration handling.
- **Interest Telemetry**: Tests private vote submission, upsert logic, vote removal, and retrieval of user interest states.
- **AI Actions**: Validates AI query submission, multi-turn schema parsing, real-money trigger overrides, IP sliding-window rate limiting, prompt caching, and Discord webhook dispatch.
- **Security Utilities**: Validates recovery code generation format, session token signing, constant-time verification, and sliding-window rate limiting.

## 🤖 AI & RAG Intelligence Test Coverage

- **RAG Semantic Retriever**: Tests query keyword scoring, multi-game trigger detection, and fallback default matching across the 16 ecosystem titles.
- **Model Fallback Chain**: Validates graceful failover handling across `gemini-3.5-flash-lite`, `gemini-2.5-flash-lite`, and `gemini-2.5-flash` on HTTP 404, 429, and 500 errors.
- **Context Builder**: Tests dynamic XML context assembly, hardcoded security boundaries, and turn-aware guidance injection for final turns.

## 🖥️ Frontend Test Coverage

- **App Directory**: Verifies single-card expansion behavior, category filtering logic, and dropdown state management.
- **App Card**: Tests rendering of app metadata (name, description, status), CTA button rendering based on status, and proper propagation of the onToggle/onClick event.
- **Hype Selector**: Tests optimistic UI updates, active state toggling (hyped vs not_interested vs null), and loading state placeholders during server action submission.
- **Status Badge**: Tests correct color coding and text rendering for 'online', 'development', and 'coming_soon' statuses.
- **Feedback Form**: Tests form rendering, dynamic category visibility, contextual placeholders, server action submission, status transitions, and pending submission states.
- **Welcome Modal**: Tests conditional rendering, session validation, nickname provisioning, reroll interactions, dismissal flow, and recovery code information.
- **News Modal**: Tests transmission log rendering, item count display, news content output, close actions, and backdrop dismissal behavior.
- **Settings Panel**: Validates panel open/close state, tab switching (identity vs restore), focus trap/Escape key dismissal behavior, procedural nickname rerolls, and recovery code reveal/copy functionality.
- **Arkalon Oracle Terminal**: Verifies suggestion pill execution, adaptive view height, 3-turn sequence enforcement, response rendering, and terminal reset functionality.
- **Recovery Code Entry**: Tests input formatting (auto-lowercase), validation feedback, and submission trigger.
- **Header**: Tests rendering of the settings toggle button, automatic on-arrival identity provisioning, and navigation elements.
- **UI Store**: Tests popup queue management and settings panel state transitions.

## 📊 Coverage Summary

- **Server Actions**: 7 test files covering identity, session, interest, and AI operations
- **AI & RAG Utilities**: 2 test files covering retriever scoring and knowledge chunk mapping
- **Lib Utilities**: 5 test files covering cookie, coreId, rateLimit, recoveryCode, and validateOwnership
- **Components**: 9 test files covering directory, settings, layout, and AI oracle components
- **State Management**: 1 test file for UI store