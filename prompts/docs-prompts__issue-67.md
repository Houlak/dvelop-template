You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Investigate and resolve the local end-to-end (e2e) test issue, then create a pull request (PR) with the fix and implement the necessary changes in the codebase.

## SCOPE
### In scope
- Diagnose the failing or problematic local e2e tests located in the e2e/ directory
- Analyze test fixtures and environment variable configurations related to e2e tests
- Modify or add Playwright e2e test specs as needed to fix or improve test coverage
- Update or fix any related authentication flows or mocks that affect e2e tests
- Ensure the local development environment is correctly configured for running e2e tests
- Create a PR with the fixes and implementation changes
- Verify that the fix works locally and passes all e2e tests
### Out of scope
- Changes to unit or integration tests outside of e2e tests
- Modifications to backend services or APIs beyond mocks used in testing
- Adjustments to CI/CD pipelines or AWS Amplify deployment configurations
- Refactoring unrelated features or modules
- Adding new features unrelated to the e2e test issue

## TECHNICAL CONTEXT
- React 18 with TypeScript using feature-based architecture
- Playwright for end-to-end testing, with specs in e2e/ directory
- Authentication state managed by Zustand persisted store
- E2E tests use env-cmd environments and require VITE_TEST_EMAIL and VITE_TEST_PASSWORD
- MSW mocking can be enabled with VITE_USE_MOCKS=true and enableMocking() call
- E2E fixtures provide authenticated contexts for tests
- Tests run against local dev server at http://localhost:5173
- E2E tests include login.spec.ts and example-page.spec.ts verifying protected routes
- No barrel files; imports must be direct
- Query options and loaders follow single source pattern
- Error handling centralized in Axios client interceptors

## CONSTRAINTS
- No barrel imports allowed; import files directly
- E2E tests must use semantic selectors and follow existing conventions
- Authentication flows must use requireAuthLoader and Zustand store
- Mocks must align with environment variables for test credentials
- Local environment variables must be set correctly for tests to pass
- PR must maintain existing architectural and coding conventions
- Testing environment must replicate local dev setup accurately

## ASSUMPTIONS
- Local environment has all required environment variables configured
- E2E tests are failing or flaky due to local configuration or code issues
- Authentication mocks and fixtures are up to date with environment variables
- The issue is reproducible locally and not caused by external services
- The developer has access to modify e2e tests and related source code
- The project dependencies are installed and up to date
- The local dev server can be started successfully for testing

## ACCEPTANCE CRITERIA
- Local e2e tests run successfully without failures or flakes
- The fix is committed and pushed in a PR following project conventions
- PR includes updated or new e2e tests if applicable
- Authentication flows in tests work correctly with persisted Zustand store
- No barrel imports introduced in the fix
- The fix does not break existing functionality or tests
- Documentation or comments updated if necessary to clarify test setup
- The PR passes all CI checks including e2e tests on GitHub Actions

## EXECUTION PLAN
- Reproduce the local e2e test issue by running 'yarn test:e2e' locally
- Review failing test logs and identify root cause (e.g., auth, mocks, env vars)
- Verify environment variables VITE_TEST_EMAIL and VITE_TEST_PASSWORD are set
- Check e2e fixtures and authentication mocks for correctness and update if needed
- Inspect Playwright specs (e.g., login.spec.ts, example-page.spec.ts) for test logic issues
- Adjust or add test code to fix failures or improve stability
- Run tests repeatedly to confirm issue resolution
- Review code changes for adherence to no barrel imports and architectural guidelines
- Create a pull request with the fix and detailed description
- Request review and address feedback
- Merge PR after approvals and successful CI runs

## RISK AREAS
- Authentication state persistence causing flaky test failures
- Incorrect or missing environment variables leading to test failures
- Unintended side effects from modifying mocks or fixtures
- Breaking existing tests or functionality due to changes
- Delays in test execution or CI due to environment setup issues

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate