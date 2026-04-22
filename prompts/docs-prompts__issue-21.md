You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Generate a detailed prompt to implement issue #21 in the houlak/dvelop-template React 18 + TypeScript project, ensuring alignment with the existing architecture, conventions, and constraints.

## SCOPE
### In scope
- Understanding the project architecture and conventions as described in the README
- Identifying relevant modules and files to modify or extend for issue #21
- Ensuring new code respects feature-based layering, protected routing, and query options patterns
- Incorporating state management with Zustand and form validation with React Hook Form + Yup if applicable
- Following UI styling and component usage guidelines with Tailwind CSS v4 and Base UI primitives
- Maintaining error handling and API mocking strategies consistent with existing patterns
- Adhering to testing conventions for E2E and potential unit/component tests
- Respecting constraints such as no barrel files and single source of query options
- Preparing acceptance criteria and execution steps for the implementation
### Out of scope
- Changing the overall tech stack or architecture
- Implementing unrelated features or refactoring unrelated modules
- Modifying deployment pipelines or environment configurations unless directly related to issue #21
- Adding new third-party dependencies without justification
- Writing the actual code or tests beyond the prompt generation

## TECHNICAL CONTEXT
- React 18 with TypeScript in strict mode
- Feature-based architecture with src/features, src/pages, src/shared directories
- React Router v6 with loaders for data prefetching
- TanStack Query v5 for data fetching and caching with single source queryOptions
- Zustand persisted store for authentication state management
- React Hook Form and Yup for forms and validation
- Tailwind CSS v4 and Base UI primitives for UI components
- Axios instance with response interceptor for API calls
- Optional MSW for API mocking enabled via VITE_USE_MOCKS
- Playwright for E2E testing with environment variables for credentials
- No barrel files; direct imports only
- Protected routes grouped under ProtectedLayout with requireAuthLoader

## CONSTRAINTS
- No barrel files allowed; import directly from concrete files
- Query options must be defined once and reused for type safety
- All protected routes must use requireAuthLoader and ProtectedLayout
- Auth mocks validate against environment variables and simulate latency
- Centralize 401 error handling in Axios interceptor in client.ts
- Use shared UI primitives and Tailwind tokens; avoid ad-hoc CSS
- Persist auth state with useAuthStore and clear with clearAuth()
- Co-locate tests next to source files; prefer semantic selectors in Playwright
- Follow naming conventions for pages, hooks, and components
- Respect existing directory layout and import aliases

## ASSUMPTIONS
- Issue #21 relates to a feature or enhancement within the existing React + TypeScript template
- The implementer has access to the full repository and environment variables
- The existing architecture and conventions are to be strictly followed
- Testing and deployment pipelines are already configured and do not require modification
- MSW mocking can be enabled if needed for development or testing
- The prompt will guide an AI assistant or developer to implement the issue correctly

## ACCEPTANCE CRITERIA
- A clear and comprehensive prompt is generated describing the implementation task for issue #21
- The prompt references relevant modules, files, and architectural patterns to be used
- Constraints and conventions are explicitly stated to avoid deviation
- The prompt includes guidance on testing and validation of the implemented feature
- The prompt is actionable and enables safe extension of the project without breaking existing functionality

## EXECUTION PLAN
- Review the issue #21 description and requirements in detail
- Analyze the README and project context to identify relevant architecture and modules
- Map out which features, pages, or shared components are affected or need extension
- Draft the prompt including objective, scope, technical context, constraints, and assumptions
- Define acceptance criteria to validate the implementation
- Outline step-by-step instructions or considerations for the implementer or AI assistant
- Include any risk areas or potential challenges if applicable
- Validate the prompt for completeness and clarity before delivery

## RISK AREAS

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate