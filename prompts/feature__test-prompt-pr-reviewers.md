You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Create a test Pull Request (PR) for reviewers to validate the review process and integration with the houlak/dvelop-template repository.

## SCOPE
### In scope
- Creating a test PR in the houlak/dvelop-template repository
- Ensuring the PR follows the repository's architectural and coding conventions
- Verifying the PR integrates with the existing React 18, Vite, Zustand, and TanStack Query stack
- Testing the PR with existing Playwright end-to-end tests if applicable
### Out of scope
- Implementing new features or bug fixes unrelated to the test PR
- Modifying backend services or API endpoints
- Changing deployment or CI/CD configurations
- Altering existing authentication logic beyond mock credentials

## TECHNICAL CONTEXT
- TypeScript 5, React 18, Vite 7 with ESM-only build
- React Router v6 with loaders and protected routes guarded by Zustand auth store
- TanStack Query v5 for data caching and invalidation with default staleTime of 5 minutes
- Zustand persisted store for authentication state
- Axios instance for HTTP requests with environment-specific backend URL
- Tailwind CSS v4 with shadcn-inspired UI components and class variance authority
- Playwright for end-to-end testing with authenticated fixtures and semantic selectors
- AWS Amplify for CI/CD and static hosting deployment
- Environment variables managed via env-cmd and .env-cmdrc.json profiles
- Mocking enabled conditionally via MSW and enableMocking() function

## CONSTRAINTS
- Follow repository conventions: no barrel files, colocate tests, centralize queries in *.queries.ts
- Use loaders for data prefetching and expose mutations as hooks with sensible defaults
- Maintain formatter conventions: 2 spaces indentation, printWidth 110, organize imports on save
- Tailwind and shadcn components rely on CSS variables defined in globals.css; extend @theme block for new tokens
- Mocked authentication only accepts credentials matching config.testEmail and config.testPassword
- Enable mocking only when VITE_USE_MOCKS is 'true' and before app bootstrap
- Reuse shared Axios instance for API services
- Do not add unit or component tests in this PR; follow README guidance for future tests

## ASSUMPTIONS
- The repository is accessible and the user has permissions to create PRs
- The environment variables are properly configured for local development and testing
- Mock authentication is sufficient for the test PR without backend integration
- Playwright tests are set up and can be run to validate the PR
- Developers are familiar with the repository's architecture and coding standards
- The PR will not introduce breaking changes or affect production stability

## ACCEPTANCE CRITERIA
- A test PR is created and visible in the houlak/dvelop-template repository
- The PR adheres to the repository's architectural and coding conventions
- The PR passes all existing Playwright end-to-end tests without failures
- Mock authentication works as expected within the PR context
- No formatting or linting errors are present in the PR
- The PR does not introduce any new warnings or errors in the build process
- The PR does not affect existing deployment or CI/CD pipelines

## EXECUTION PLAN
- Clone or fork the houlak/dvelop-template repository
- Create a new branch for the test PR
- Implement minimal changes or additions to simulate a PR (e.g., a trivial code change or documentation update)
- Ensure all code follows repository conventions and formatting rules
- Run local tests including Playwright end-to-end tests to verify no regressions
- If mocking is needed, enable it by setting VITE_USE_MOCKS to 'true' and calling enableMocking() before app bootstrap
- Commit changes and push the branch to the remote repository
- Open a Pull Request targeting the main branch with a descriptive title and description
- Request reviewers and monitor for feedback
- Address any review comments if applicable
- Merge the PR after approval and successful checks

## RISK AREAS
- Potential misconfiguration of environment variables causing test failures
- Unintended changes affecting authentication or routing logic
- Formatting or linting errors causing CI/CD pipeline failures
- Playwright tests flakiness or failures unrelated to the PR changes
- Mocking setup not correctly applied leading to inconsistent test results

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate