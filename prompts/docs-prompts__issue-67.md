You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Investigate and fix the local end-to-end (e2e) test issue, create a prompt pull request (PR) for the fix, and implement the necessary code changes to resolve the problem.

## SCOPE
### In scope
- Diagnose the failing or problematic e2e tests located in the e2e/ directory
- Analyze the interaction between the e2e tests and the authentication flow, especially considering the use of Zustand persisted auth store and Playwright fixtures
- Modify or add code in the e2e tests or related fixtures to fix the issue
- Update or add loaders, mocks, or API client code if needed to support the fix
- Create a pull request with the fix and relevant test updates
- Ensure the fix respects the existing architecture, conventions, and constraints described in the README
### Out of scope
- Changing the core architecture or tech stack of the project
- Adding new features unrelated to the e2e test issue
- Refactoring unrelated parts of the codebase
- Modifying deployment configurations or AWS Amplify pipeline
- Writing unit or integration tests beyond what is necessary to fix the e2e issue

## TECHNICAL CONTEXT
- React 18 + TypeScript with strict mode
- React Router v6 with loaders for data prefetch
- TanStack Query v5 for data fetching and caching
- Zustand persisted auth store for authentication state
- React Hook Form + Yup for form validation
- Playwright for end-to-end testing with fixtures providing authenticated contexts
- MSW optional mocking enabled via VITE_USE_MOCKS environment variable
- Axios instance with centralized error handling and 401 logout logic placeholder
- No barrel files; direct imports required
- E2E tests located in e2e/ directory, using env-cmd for environment variables
- Authentication flow enforced via requireAuthLoader and ProtectedLayout

## CONSTRAINTS
- No barrel files allowed; imports must be direct to avoid circular dependencies
- All protected routes must use requireAuthLoader and ProtectedLayout for authentication gating
- Query options must be defined once and reused for type safety
- Auth mocks validate against environment variables VITE_TEST_EMAIL and VITE_TEST_PASSWORD
- E2E tests rely on environment variables set via .env-cmdrc.json local profile
- Any changes must maintain compatibility with existing Playwright fixtures and auth mocks
- Centralized 401 error handling must remain in the Axios client interceptor
- State persistence must use clearAuth() to clear authentication state properly

## ASSUMPTIONS
- The local environment is set up with all necessary environment variables including VITE_TEST_EMAIL and VITE_TEST_PASSWORD
- Playwright tests are configured to run against the local dev server at http://localhost:5173
- MSW mocking can be enabled if needed by setting VITE_USE_MOCKS=true and calling enableMocking()
- The e2e issue is reproducible locally and related to authentication or routing protections
- Existing loaders and queryOptions are correctly implemented and can be extended or fixed as needed
- The developer has access to create branches and PRs in the Houlak/dvelop-template repository

## ACCEPTANCE CRITERIA
- The local e2e tests run successfully without failures related to the previously identified issue
- The fix is implemented following the project’s architectural and coding conventions
- A pull request is created with a clear description of the issue and the implemented fix
- The PR passes all CI checks including Playwright e2e tests and code formatting
- No regressions are introduced in authentication flows or protected routing
- Documentation or comments are updated if necessary to clarify the fix or testing approach

## EXECUTION PLAN
- Reproduce the e2e issue locally by running the Playwright tests under e2e/ directory
- Analyze test logs and failures to identify root cause, focusing on authentication, routing, or data loading
- Review related loaders, auth store usage, and mocks to find inconsistencies or missing handling
- Update or fix the e2e test code, fixtures, or mocks to address the issue
- If needed, adjust loaders or API client code to ensure proper auth enforcement and error handling
- Run all e2e tests locally to confirm the fix resolves the issue without side effects
- Create a feature branch and commit the changes with descriptive messages
- Open a pull request targeting the main branch with a detailed description of the problem and solution
- Request reviews and address any feedback
- Merge the PR after passing all CI checks

## RISK AREAS
- Potential for breaking authentication flow if requireAuthLoader or Zustand store usage is modified incorrectly
- Risk of introducing flaky tests if Playwright fixtures are not properly synchronized with auth state
- Possibility of missing environment variable configurations causing test failures
- Changes to Axios client interceptor could affect global error handling if not carefully implemented

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate