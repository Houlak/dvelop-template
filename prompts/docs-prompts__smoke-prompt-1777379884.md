You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Perform a smoke test of the branch naming flow to ensure it aligns with the project's conventions and does not introduce integration issues.

## SCOPE
### In scope
- Verification of branch naming conventions adherence
- Validation of integration with CI/CD pipelines (GitHub Actions, AWS Amplify)
- Basic functional check of branch-related workflows (e.g., PR creation, build triggers)
- Review of any branch naming impacts on environment-specific builds and deployments
### Out of scope
- Deep functional testing of application features
- Unit or integration testing of unrelated modules
- Changes to existing authentication or routing logic
- Extensive performance or security testing

## TECHNICAL CONTEXT
- React 18 + TypeScript with strict mode
- Vite 7 bundler
- React Router v6 with loaders
- TanStack Query v5 for data fetching and caching
- Zustand for state management with persisted auth store
- Tailwind CSS v4 and Base UI for styling and UI components
- Axios for HTTP requests with centralized error handling
- MSW for optional API mocking
- Playwright for end-to-end testing
- GitHub Actions and AWS Amplify for CI/CD pipelines
- Branch naming conventions impact build and deployment workflows as defined in amplify.yml and GitHub Actions workflows

## CONSTRAINTS
- No barrel file imports; direct imports only
- Protected routes must use ProtectedLayout and requireAuthLoader
- Query options must be defined once and reused for type safety
- Auth state persistence via Zustand with clearAuth for clearing
- Branch naming must be compatible with environment-specific build triggers
- MSW mocking enabled only when VITE_USE_MOCKS=true and enableMocking() is called
- Prettier formatting and import organization enforced

## ASSUMPTIONS
- Branch naming conventions are documented and enforced in CI/CD workflows
- Environment variables for testing (VITE_TEST_EMAIL, VITE_TEST_PASSWORD) are set correctly
- Developers have access to the repository and CI/CD pipeline configurations
- Smoke test will be performed in a local or staging environment with representative settings
- No breaking changes to existing routing or auth flows are introduced by branch naming
- Playwright tests can be used to verify basic branch-related workflows if applicable

## ACCEPTANCE CRITERIA
- Branch names conform to the established naming conventions without exceptions
- CI/CD pipelines trigger builds and deployments correctly based on branch names
- No build or deployment failures occur due to branch naming issues
- Smoke test verifies that protected routes remain accessible only after authentication
- No regressions introduced in routing, authentication, or environment variable handling
- Documentation or README updates reflect any branch naming guidelines if needed

## EXECUTION PLAN
- Review existing branch naming conventions and CI/CD workflow configurations
- Create test branches following the naming conventions and some violating them
- Push branches to remote and observe CI/CD pipeline triggers and behavior
- Run Playwright smoke tests focusing on login, protected routes, and environment-specific behavior
- Verify build outputs and deployment logs in AWS Amplify for each test branch
- Check for any errors or warnings related to branch naming in logs and pipeline runs
- Document findings and update branch naming guidelines if gaps are found
- Communicate results to the development team and update README or docs if necessary

## RISK AREAS
- Misconfiguration in CI/CD workflows causing builds to fail unexpectedly
- Branch naming conflicts with environment variable or deployment logic
- Unintended side effects on authentication or routing due to branch naming
- Incomplete or outdated documentation leading to inconsistent branch naming
- Potential delays in deployment if pipelines are triggered incorrectly

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate