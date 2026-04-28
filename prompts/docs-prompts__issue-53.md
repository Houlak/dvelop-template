You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Implement Issue 53 generated from Make by extending or modifying the project according to the provided context and conventions.

## SCOPE
### In scope
- Adding or modifying React components under src/features or src/pages as needed
- Updating or creating loaders in src/pages to support new data fetching or auth flows
- Extending or creating queryOptions and mutations following the example pattern
- Modifying routing in src/app/router/routes.tsx including protected routes inside ProtectedLayout
- Utilizing Zustand auth store and requireAuthLoader for authentication enforcement
- Using React Hook Form and Yup for any form validation requirements
- Adhering to UI primitives and styling conventions using Tailwind CSS v4 and Base UI components
- Mocking API calls using MSW if applicable, enabling via VITE_USE_MOCKS
- Ensuring error handling uses ErrorPage and NotFoundPage appropriately
- Writing or updating Playwright E2E tests under e2e/ to cover new or changed functionality
- Following naming, import, and directory conventions as described
- Respecting constraints such as no barrel files and single source queryOptions
### Out of scope
- Changing core tooling like Vite, Prettier, or AWS Amplify configurations unless explicitly required
- Altering environment variable keys or .env-cmdrc.json structure
- Modifying unrelated features or legacy code outside the scope of Issue 53
- Implementing backend services beyond the scope of frontend API mocking or client usage
- Changing global architecture patterns or state management approaches
- Adding unit or integration tests outside of co-located component tests or E2E tests
- Adjusting deployment pipelines or static hosting headers

## TECHNICAL CONTEXT
- React 18 with TypeScript in strict mode
- Feature-based architecture with src/features, src/pages, src/shared
- React Router v6 with loaders for data prefetch
- TanStack Query v5 for data fetching and caching with queryOptions factories
- Zustand persisted auth store with requireAuthLoader for protected routes
- React Hook Form and Yup for forms and validation
- Tailwind CSS v4 with Base UI components and Shadcn-inspired UI primitives
- Axios instance configured via import.meta.env with centralized error handling
- Optional MSW for API mocking enabled by VITE_USE_MOCKS and enableMocking()
- Playwright for E2E testing with fixtures and environment variable driven credentials
- No barrel files; direct imports only
- Single source of truth for queries and mutations
- ErrorPage and NotFoundPage for error handling in routing

## CONSTRAINTS
- Do not create or use barrel files; import files directly
- Define queryOptions once and reuse in loaders and components to maintain type safety
- All protected routes must be wrapped in ProtectedLayout and use requireAuthLoader
- Auth mocks validate against environment variables and simulate latency
- Centralize 401 error handling in Axios client interceptor
- Use shared UI primitives and Tailwind tokens; avoid ad-hoc CSS
- Persist auth state using useAuthStore with clearAuth() for clearing
- Co-locate tests next to source files; use semantic selectors in Playwright
- Follow naming conventions for pages, hooks, and components
- Respect existing directory layout and import aliasing

## ASSUMPTIONS
- Issue 53 pertains to frontend feature or bug fix within the React application
- The existing environment variables and mocks are correctly configured
- The developer has access to the full repository and can run yarn commands
- Playwright E2E tests can be run to verify functionality
- No breaking changes to existing APIs or user flows are required unless specified
- The project uses Vite 7 and React 18 as described
- Authentication flow uses Zustand store and is consistent across loaders
- MSW mocking is optional and enabled only when needed
- The team follows the documented architectural and coding conventions

## ACCEPTANCE CRITERIA
- New or modified features are implemented following the feature-based architecture
- All new loaders use queryOptions factories and integrate with TanStack Query
- Protected routes enforce authentication using requireAuthLoader and Zustand store
- Forms use React Hook Form and Yup for validation with schemas co-located
- UI components use shared primitives and Tailwind CSS v4 styling
- API calls use the shared Axios client with centralized error handling
- MSW mocking is enabled if applicable and does not break production builds
- Playwright E2E tests cover new or changed functionality and pass successfully
- No barrel imports are introduced; all imports are direct
- Code changes do not break existing functionality or tests
- Documentation or comments are updated if relevant to Issue 53 changes

## EXECUTION PLAN
- Review Issue 53 details and requirements
- Identify affected features, pages, routes, and services in the codebase
- Implement necessary React components or modify existing ones under src/features or src/pages
- Create or update loaders using queryOptions factories for data fetching
- Modify routing in src/app/router/routes.tsx to add or update routes, ensuring protected routes use ProtectedLayout
- Integrate authentication enforcement using requireAuthLoader and Zustand auth store
- Implement or update forms with React Hook Form and Yup validation schemas
- Use shared UI primitives and Tailwind CSS classes for styling
- Update or add API calls using the shared Axios client; add MSW handlers if mocking is needed
- Test changes locally using yarn dev and run Playwright E2E tests to verify functionality
- Ensure no barrel imports are introduced and naming conventions are followed
- Update documentation or comments if the feature or fix affects usage or developer guidance
- Commit changes with clear messages referencing Issue 53
- Open a pull request for review and address feedback
- Merge after successful review and passing CI/CD pipelines

## RISK AREAS
- Breaking authentication flow if requireAuthLoader or Zustand store usage is incorrect
- Introducing barrel imports that cause circular dependencies or tree-shaking issues
- Incorrect queryOptions usage leading to type safety or caching issues
- Styling inconsistencies if Tailwind or UI primitives are misused
- API mocking conflicts if MSW is improperly enabled or handlers conflict
- E2E test failures due to environment variable misconfiguration or test flakiness
- Unintended side effects on existing routes or features

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate