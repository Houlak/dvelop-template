You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Implement retry logic with exponential backoff for API requests using the existing Axios instance to improve resilience against transient failures.

## SCOPE
### In scope
- Modify the Axios instance in src/shared/services/api/client.ts to add retry with backoff
- Ensure retry logic respects existing error normalization and does not interfere with MSW mocking
- Test retry behavior in development and with mocks enabled
- Document the retry behavior and configuration in code comments or relevant documentation
### Out of scope
- Changing authentication logic or auth store
- Modifying unrelated API services or features beyond the Axios client
- Altering UI components or routing logic
- Implementing retries outside of the Axios client (e.g., in React Query hooks)

## TECHNICAL CONTEXT
- TypeScript 5, React 18, Vite 7
- Axios instance centralized in src/shared/services/api/client.ts
- MSW mocking enabled conditionally via VITE_USE_MOCKS and enableMocking()
- TanStack Query v5 used for caching and invalidation
- Error normalization is handled in the Axios client
- No barrel exports; direct imports required
- Strict TypeScript and formatting conventions enforced

## CONSTRAINTS
- Retry logic must not break existing error normalization or cause infinite retry loops
- Retries should have exponential backoff with jitter to avoid thundering herd
- Retry count and backoff parameters should be configurable but default to safe values
- Retry should only apply to idempotent HTTP methods (e.g., GET, HEAD, OPTIONS)
- Must maintain compatibility with MSW mocking and not retry mocked failures unnecessarily
- Code formatting and import organization must follow existing project conventions

## ASSUMPTIONS
- The Axios instance is the single point for HTTP requests and can be safely extended
- Transient network errors and 5xx server errors are the primary targets for retry
- Authentication errors (401, 403) and client errors (4xx) should not be retried
- The team prefers retry logic centralized in the HTTP client rather than in individual queries or mutations
- Existing tests and mocks can be extended or adapted to cover retry scenarios

## ACCEPTANCE CRITERIA
- Axios instance retries failed requests with exponential backoff up to a configurable maximum retry count
- Retries only occur for safe HTTP methods and retryable error conditions
- Retry delays include jitter to reduce simultaneous retries
- No retries occur for authentication or client errors
- Retry logic is covered by automated tests or manual verification steps
- Documentation or code comments clearly explain retry behavior and configuration

## EXECUTION PLAN
- Review the current Axios instance implementation in src/shared/services/api/client.ts
- Design retry logic with exponential backoff and jitter, configurable retry count and delay
- Implement an Axios request/response interceptor or wrapper to apply retry logic
- Ensure retry logic respects HTTP method and error status code constraints
- Test retry behavior locally with and without MSW mocking enabled
- Add or update tests to cover retry scenarios if applicable
- Document the retry implementation and configuration options in code comments
- Perform code review and verify adherence to formatting and import conventions
- Merge changes and monitor for any issues in development or staging environments

## RISK AREAS
- Potential infinite retry loops if error conditions are not properly filtered
- Interference with MSW mocking causing unexpected retries or test failures
- Increased latency or user impact if retry parameters are too aggressive
- Compatibility issues with existing error normalization or Axios interceptors
- Misconfiguration leading to retries on non-idempotent requests causing side effects

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate