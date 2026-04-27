You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Perform a smoke test to verify the creation of a pull request and the creation of a route file prompts/docs-prompts__issue-<n>.md in the repository Houlak/dvelop-template.

## SCOPE
### In scope
- Create a new route file prompts/docs-prompts__issue-<n>.md
- Create a pull request for the new route file
- Verify that the route creation and PR creation processes work as expected
- Follow repository conventions for routing and pull request creation
### Out of scope
- Implementing new features beyond route creation
- Modifying existing business logic or UI components
- Extensive testing beyond smoke test scope
- Changes to CI/CD pipelines or deployment configurations

## TECHNICAL CONTEXT
- React 18 + TypeScript with feature-based architecture
- Routing managed by React Router v6 with loaders in src/app/router/routes.tsx
- Use of TanStack Query v5 for data fetching and caching
- Authentication enforced via Zustand persisted store and requireAuthLoader
- Route files follow the pattern FeaturePage/FeaturePage.tsx + FeaturePage.loader.ts
- No barrel files; import components and utilities directly
- Pull requests created according to repository guidelines
- Environment variables managed via .env-cmdrc.json and Vite env variables
- MSW mocking optionally enabled with VITE_USE_MOCKS=true
- Testing conventions include Playwright for E2E tests located in e2e/

## CONSTRAINTS
- No barrel files allowed; imports must be direct
- Protected routes must be grouped inside ProtectedLayout and use requireAuthLoader
- Query options must be defined once and reused for loaders and components
- Auth mocks validate against environment-configured credentials
- 401 error handling centralized in Axios client interceptor
- Route files must follow naming conventions and directory layout
- Pull request creation must follow repository and GitHub workflow conventions
- Smoke test scope limited to route and PR creation verification

## ASSUMPTIONS
- The repository is set up with the described architecture and conventions
- Environment variables for testing (VITE_TEST_EMAIL, VITE_TEST_PASSWORD) are configured
- Developer has access rights to create branches and pull requests in the repository
- The CI/CD pipeline and GitHub Actions are configured to run on PR creation
- The route creation process involves adding entries to src/app/router/routes.tsx
- The smoke test environment has the necessary dependencies installed
- MSW mocking can be enabled if needed for testing

## ACCEPTANCE CRITERIA
- A new route file prompts/docs-prompts__issue-<n>.md is created following repository conventions
- A pull request is successfully created containing the new route file
- The pull request passes initial CI checks without errors
- The new route is accessible and does not break existing routes
- The smoke test verifies that the PR and route creation process completes without failures

## EXECUTION PLAN
- Create a new branch from the main development branch
- Add a new route file prompts/docs-prompts__issue-<n>.md following naming and directory conventions
- Update src/app/router/routes.tsx to include the new route if applicable
- Ensure the new route uses requireAuthLoader if it is protected
- Test locally to verify the route loads without errors
- Commit changes with a descriptive message referencing the issue
- Push the branch to the remote repository
- Create a pull request targeting the main development branch
- Verify that the pull request triggers CI workflows and passes smoke tests
- Review the pull request to ensure compliance with repository guidelines
- Merge the pull request upon successful verification

## RISK AREAS
- Incorrect route file naming or placement causing routing errors
- Failure to update router configuration leading to inaccessible routes
- Authentication loader misconfiguration causing unauthorized access issues
- CI pipeline failures due to environment or configuration mismatches
- Pull request creation errors due to permission or branch conflicts

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate