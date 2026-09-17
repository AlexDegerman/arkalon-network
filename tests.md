# 🧪 Test Suite

Unit and integration tests covering Arkalon Network identity flows, session security, directory state management, and private telemetry.

## ⚙️ Backend Test Coverage

- **Identity Actions**: Validates core identity creation, existing session detection, recovery code restoration, and rate limit enforcement for both creation and recovery endpoints.
- **Session Validation**: Verifies HMAC token verification, cookie matching, database session lookup, and expiration handling.
- **Interest Telemetry**: Tests private vote submission, upsert logic, vote removal, and retrieval of user interest states.
- **Security Utilities**: Validates recovery code generation format, session token signing, constant-time verification, and sliding-window rate limiting.

## 💻 Frontend Test Coverage

- **App Directory**: Verifies single-card expansion behavior, category filtering logic, and dropdown state management.
- **Hype Selector**: Tests optimistic UI updates, active state toggling, and loading state placeholders.
- **Settings Panel**: Validates recovery code reveal/copy interactions, restore flow triggering, and focus trap behavior.
- **UI Store**: Tests popup queue management and settings panel state transitions.