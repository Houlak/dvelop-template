You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Generate a detailed prompt to implement the issue #26 in the houlak/dvelop-template repository, ensuring alignment with the existing architecture, conventions, and tech stack.

## SCOPE
### In scope
- Understanding the current project architecture and conventions as described in the README.
- Leveraging React 18 + TypeScript with React Router v6 loaders and TanStack Query v5.
- Following the feature-based layering and protected routing patterns.
- Using Zustand for auth state management and React Hook Form + Yup for forms and validation.
- Incorporating UI components from the shared UI primitives with Tailwind CSS v4 and Base UI.
- Ensuring API integration and mocking follow existing patterns with Axios and MSW.
- Adhering to testing conventions using Playwright for E2E tests and co-located unit/component tests.
- Respecting constraints such as no barrel files, single source query options, and centralized error handling.
### Out of scope
- Changing the core tech stack or architecture.
- Implementing unrelated features or modules outside the scope of issue #26.
- Modifying deployment configurations unless directly related to the issue.
- Altering environment variable management beyond what is necessary for the issue.

## TECHNICAL CONTEXT
- React 18 + TypeScript with strict mode enabled.
- React Router v6 with loaders for data prefetching.
- TanStack Query v5 for data fetching and caching with a shared QueryClient.
- Zustand persisted store for authentication state management.
- React Hook Form combined with Yup for form handling and validation.
- Tailwind CSS v4 with Base UI components inspired by Shadcn UI.
- Axios instance configured with environment variables and centralized error handling.
- Mock Service Worker (MSW) support enabled conditionally via environment variables.
- Playwright for end-to-end testing with authenticated fixtures and semantic selectors.
- Project structure with feature-based layering and no barrel file imports.

## CONSTRAINTS
- No barrel files allowed; imports must be direct to avoid circular dependencies and improve tree-shaking.
- Query options must be defined once and reused to maintain type safety.
- Protected routes must be wrapped with ProtectedLayout and use requireAuthLoader for authentication enforcement.
- Auth mocks validate against environment-configured credentials and simulate latency; updates must propagate to E2E fixtures.
- Centralized 401 error handling must be implemented in the Axios client interceptor.
- UI styling must reuse shared primitives and Tailwind tokens; avoid ad-hoc CSS unless extending the design system.
- State persistence for auth must use clearAuth() to keep localStorage and state in sync.
- Testing must follow co-location and semantic selector conventions.

## ASSUMPTIONS
- Issue #26 relates to a feature or fix that fits within the existing architecture and tech stack.
- The developer has access to environment variables and can configure them as needed.
- MSW mocking can be enabled if required by the implementation.
- The existing queryOptions factories and loaders can be extended or reused.
- E2E tests will be updated or added to cover new or changed functionality.
- No breaking changes to existing APIs or user flows are introduced.

## ACCEPTANCE CRITERIA
- A clear and detailed prompt is generated that guides the implementation of issue #26.
- The prompt references relevant architectural patterns, tech stack details, and coding conventions.
- The prompt includes instructions on how to handle routing, state management, API integration, and UI composition.
- Testing strategies and requirements are outlined to ensure coverage and maintainability.
- Constraints and assumptions are explicitly stated to avoid scope creep or architectural violations.
- The prompt enables safe extension of the project without introducing regressions.

## EXECUTION PLAN
- Review the README and project context to fully understand the architecture and conventions.
- Analyze the specifics of issue #26 to identify required changes and affected modules.
- Map the issue requirements to existing patterns such as feature-based layering, loaders, and queryOptions.
- Draft the prompt including objective, scope, technical context, constraints, assumptions, and acceptance criteria.
- Include detailed guidance on routing, state management, API mocking, UI components, and testing.
- Validate the prompt against the project’s constraints and conventions to ensure compliance.
- Deliver the prompt for use by developers or AI assistants to implement the issue.

## RISK AREAS
- Misalignment with existing architectural patterns leading to integration issues.
- Overlooking constraints such as no barrel files or centralized error handling.
- Insufficient testing coverage causing regressions or undetected bugs.
- Incorrect assumptions about environment variables or mocking capabilities.
- Ambiguities in the prompt that could lead to inconsistent implementations.

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate