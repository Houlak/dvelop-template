You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Implement the feature described in issue #17 by extending the existing React 18 + TypeScript template following the project's architectural and operational conventions.

## SCOPE
### In scope
- Adding or modifying routes in src/app/router/routes.tsx
- Creating or updating loaders and components in src/pages/* following the Page.tsx + Page.loader.ts pattern
- Defining or reusing queryOptions factories for data fetching with TanStack Query
- Extending or creating Zustand stores under src/features/* if state management is required
- Implementing forms and validation using React Hook Form + Yup alongside components
- Using shared UI primitives from src/shared/components/ui for consistent styling
- Wiring authentication and protected routes through ProtectedLayout and requireAuthLoader
- Updating or adding API calls using the Axios instance in src/shared/services/api/client.ts
- Adding or modifying mocks in src/shared/services/api/mockService.ts if needed
- Ensuring new features comply with existing testing conventions and adding Playwright E2E tests in e2e/ if applicable
- Following naming conventions, import rules (no barrels), and styling guidelines
### Out of scope
- Changing core infrastructure like AWS Amplify build pipelines or customHttp.yml headers
- Modifying global environment management beyond adding necessary env variables
- Altering unrelated features or modules not connected to issue #17
- Introducing new languages, frameworks, or major architectural changes
- Writing unit or integration tests outside the scope of the feature unless explicitly required
- Changing the existing authentication flow beyond necessary extensions for the feature

## TECHNICAL CONTEXT
- React 18 with TypeScript in strict mode
- Feature-based architecture with src/features/*, src/pages/*, and src/shared/*
- React Router v6 with loaders for routing and data prefetch
- TanStack Query v5 for data fetching and caching with queryOptions factories
- Zustand persisted store for authentication state management
- React Hook Form + Yup for forms and validation
- Tailwind CSS v4 and Base UI components inspired by Shadcn UI
- Axios instance configured with Vite env variables and centralized error handling
- Optional MSW for API mocking enabled via VITE_USE_MOCKS
- Playwright for end-to-end testing with existing authenticated fixtures
- No barrel files; direct imports only
- Environment variables managed via .env-cmdrc.json and Vite

## CONSTRAINTS
- No barrel files allowed; import directly from concrete files
- All queries must be defined once using queryOptions factories and reused
- Protected routes must be wrapped with ProtectedLayout and use requireAuthLoader
- Authentication mocks validate against VITE_TEST_EMAIL and VITE_TEST_PASSWORD environment variables
- Centralize 401 error handling inside Axios client interceptor
- Use shared UI primitives and Tailwind tokens for styling consistency
- Persist authentication state with useAuthStore and clearAuth() for clearing
- Follow existing naming conventions and directory layout strictly
- Add E2E tests in e2e/ folder following existing patterns if applicable

## ASSUMPTIONS
- Issue #17 details are compatible with the existing React + TypeScript stack
- The feature requires integration with existing routing, state, and API layers
- Environment variables needed for the feature will be added to .env-cmdrc.json and Amplify as required
- MSW mocking can be used during development and testing if enabled
- Playwright E2E tests will be updated or added to cover new feature behavior
- Developers have access to the existing codebase and environment setup
- No breaking changes to existing features or APIs are introduced
- The feature will adhere to the project's coding, styling, and testing conventions

## ACCEPTANCE CRITERIA
- The feature is fully implemented following the project’s architectural guidelines
- New routes and loaders are added or modified correctly in src/app/router/routes.tsx and src/pages/*
- Data fetching uses queryOptions factories and integrates with TanStack Query caching
- Authentication and protected routing are correctly enforced where applicable
- Forms and validation use React Hook Form and Yup schemas co-located with components
- UI components use shared primitives and Tailwind CSS styles consistently
- API calls use the centralized Axios client with proper error handling
- Mocking is supported via MSW if applicable and enabled by environment variables
- Playwright E2E tests cover the new feature’s critical flows and pass successfully
- Code follows naming conventions, import rules, and directory layout without barrels
- No regressions or breaking changes occur in unrelated parts of the application

## EXECUTION PLAN
- Review issue #17 details and map required changes to routes, pages, features, and services
- Add or update routes in src/app/router/routes.tsx, placing protected routes inside ProtectedLayout
- Create or modify page components and their loaders in src/pages/* following the Page.tsx + Page.loader.ts pattern
- Define or reuse queryOptions factories for data fetching and integrate them in loaders and components
- Extend Zustand stores under src/features/* if new state management is needed
- Implement forms with React Hook Form and Yup validation schemas alongside components
- Use shared UI primitives from src/shared/components/ui for all new UI elements
- Integrate API calls through the centralized Axios client in src/shared/services/api/client.ts
- Add or update MSW mocks in src/shared/services/api/mockService.ts if the feature requires mocking
- Ensure authentication flows use requireAuthLoader and Zustand auth store correctly
- Write or update Playwright E2E tests in e2e/ to cover new feature scenarios
- Test the feature locally with yarn dev and run E2E tests with yarn test:e2e
- Review code for adherence to naming, import, styling, and architectural conventions
- Prepare documentation or comments if needed to explain new feature parts
- Submit changes for code review and address feedback
- Merge and deploy following existing CI/CD pipelines and environment configurations

## RISK AREAS
- Incorrect integration with authentication and protected routing causing unauthorized access
- Misuse of queryOptions leading to caching or data consistency issues
- Breaking existing routes or loaders by improper modifications
- Inconsistent UI styling if shared primitives or Tailwind tokens are not used
- API error handling gaps if Axios interceptor is bypassed
- Missing or flaky E2E tests causing undetected regressions
- Environment variable misconfiguration affecting mocks or authentication
- Violations of import rules causing circular dependencies or build issues

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate