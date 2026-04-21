You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Generate a detailed prompt to implement issue #21 in the houlak/dvelop-template repository, ensuring alignment with the existing React 18 + TypeScript feature-based architecture and project conventions.

## SCOPE
### In scope
- Understanding the current project architecture and conventions as described in the README
- Identifying relevant modules and files impacted by issue #21
- Defining clear acceptance criteria for the implementation
- Outlining an execution plan with concrete steps to implement the issue
- Highlighting technical context relevant to the implementation
- Enumerating constraints and assumptions based on the project guidelines
### Out of scope
- Actual coding or implementation of issue #21
- Testing beyond defining acceptance criteria
- Deployment or CI/CD pipeline modifications unless directly related to issue #21
- Changes to unrelated features or modules

## TECHNICAL CONTEXT
- React 18 with TypeScript in strict mode
- Feature-based architecture with business domains under src/features/* and route entry points under src/pages/*
- React Router v6 with loaders for data prefetching
- TanStack Query v5 for data fetching and caching with shared queryOptions factories
- Authentication state managed via persisted Zustand store in src/features/auth/store/auth.store.ts
- Forms using React Hook Form and Yup for validation
- UI primitives built with Base UI and Tailwind CSS v4 in src/shared/components/ui
- Axios instance configured in src/shared/services/api/client.ts with centralized error handling
- Optional MSW support for API mocking enabled via VITE_USE_MOCKS environment variable
- No barrel files; direct imports required
- Protected routes grouped under ProtectedLayout and guarded by requireAuthLoader
- Testing conventions using Playwright for E2E tests located in e2e/ directory

## CONSTRAINTS
- Maintain single source of truth for queryOptions to ensure type safety
- All protected routes must use requireAuthLoader and be nested inside ProtectedLayout
- No barrel files allowed; imports must be direct to avoid circular dependencies
- Authentication mocks validate against environment variables VITE_TEST_EMAIL and VITE_TEST_PASSWORD
- Error handling for 401 responses centralized in Axios interceptor in client.ts
- State persistence must use clearAuth() to clear auth state and localStorage
- UI styling must use shared UI primitives and Tailwind CSS tokens; avoid ad-hoc CSS
- Testing files must be co-located with source files and use semantic selectors in Playwright
- MSW mocking enabled only when VITE_USE_MOCKS=true and enableMocking() is called before app render

## ASSUMPTIONS
- Issue #21 relates to a feature or bug fix within the existing React + TypeScript codebase
- The implementer has access to environment variables and can configure them as needed
- The implementer is familiar with the project’s architectural patterns and conventions
- The project’s existing tooling and dependencies (e.g., React Router, TanStack Query, Zustand) are up to date and functioning
- Testing infrastructure using Playwright is set up and can be leveraged for acceptance criteria validation
- No major refactoring of unrelated modules is required to implement issue #21

## ACCEPTANCE CRITERIA
- Implementation aligns with the feature-based architecture and respects the layering conventions
- New or modified routes are added inside src/app/router/routes.tsx with appropriate loaders and protection
- Query options are defined or reused following the single source pattern for type safety
- Authentication flows integrate with the persisted Zustand store and use requireAuthLoader for protection
- Forms use React Hook Form and Yup validation schemas co-located with components
- API calls use the shared Axios client with proper error handling and mocking support if applicable
- UI components use shared primitives and Tailwind CSS classes inline without barrels
- No barrel imports are introduced; all imports are direct
- Tests are added or updated following the Playwright E2E conventions and co-location guidelines
- Documentation or comments are updated to reflect changes related to issue #21

## EXECUTION PLAN
- Review the description and requirements of issue #21 to understand the feature or fix needed
- Identify the relevant feature domain under src/features/* or page under src/pages/* impacted by the issue
- Plan the necessary route additions or modifications in src/app/router/routes.tsx, ensuring protected routes use ProtectedLayout and requireAuthLoader
- Define or reuse queryOptions factories for data fetching with TanStack Query to maintain type safety
- Implement or update loaders and components to handle data fetching, form validation, and state management according to conventions
- Integrate authentication state using the persisted Zustand store and ensure proper redirection and protection flows
- Use the shared Axios client for API interactions, adding or updating mocks in src/shared/services/api/mockService.ts if needed
- Apply UI changes using shared UI primitives and Tailwind CSS classes inline, avoiding any barrel imports
- Add or update Playwright E2E tests in the e2e/ directory to cover new or changed functionality, using semantic selectors
- Verify no barrel files are introduced and all imports are direct
- Update documentation or comments to reflect the implementation details related to issue #21
- Perform local testing and validation to ensure acceptance criteria are met before finalizing the implementation

## RISK AREAS
- Potential for introducing barrel imports contrary to project constraints
- Misalignment with authentication flow causing unauthorized access or redirect issues
- Incorrect or inconsistent use of queryOptions leading to type safety issues
- Breaking existing routes or loaders by improper modifications in router configuration
- Insufficient test coverage or improper test setup causing regressions
- State persistence issues if clearAuth() is not used properly when clearing auth state
- UI inconsistencies if shared primitives or Tailwind tokens are not used correctly

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate