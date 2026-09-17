#  Test Suite

Unit and integration tests covering Arkalon Network identity flows, session security, directory state management, and private telemetry.

## 🛡️ Server Actions Test Coverage

- **Identity Actions**: Validates core identity creation, existing session detection, recovery code restoration, and rate limit enforcement for both creation and recovery endpoints.
- **Session Validation**: Verifies HMAC token verification, cookie matching, database session lookup, and expiration handling.
- **Interest Telemetry**: Tests private vote submission, upsert logic, vote removal, and retrieval of user interest states.
- **Security Utilities**: Validates recovery code generation format, session token signing, constant-time verification, and sliding-window rate limiting.

## ️ Frontend Test Coverage

- **App Directory**: Verifies single-card expansion behavior, category filtering logic, and dropdown state management.
- **App Card**: Tests rendering of app metadata (name, description, status), CTA button rendering based on status, and proper propagation of the onToggle/onClick event.
- **Hype Selector**: Tests optimistic UI updates, active state toggling (hyped vs not_interested vs null), and loading state placeholders during server action submission.
- **Status Badge**: Tests correct color coding and text rendering for 'online', 'development', and 'coming_soon' statuses.
- **Settings Panel**: Validates panel open/close state, tab switching (identity vs restore), focus trap/Escape key dismissal behavior, and recovery code reveal/copy functionality.
- **Recovery Code Entry**: Tests input formatting (auto-lowercase), validation feedback, and submission trigger.
- **Header**: Tests rendering of the settings toggle button and navigation elements.
- **UI Store**: Tests popup queue management and settings panel state transitions.

## 📊 Coverage Summary

- **Server Actions**: 6 test files covering identity, session, and interest operations
- **Lib Utilities**: 5 test files covering cookie, coreId, rateLimit, recoveryCode, and validateOwnership
- **Components**: 8 test files covering directory, settings, and layout components
- **State Management**: 1 test file for UI store