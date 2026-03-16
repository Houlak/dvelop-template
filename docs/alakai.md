# Alakai Frontend Reference

## Architecture Overview
- Single-page React 18 application bootstrapped with Vite (`src/main.tsx`, `src/App.tsx`) and rendered inside React.StrictMode.
- Global providers collected in `src/app/providers` supply cross-cutting services. Currently only `QueryProvider` is active, configuring TanStack Query with 5-minute stale data and disabled refetch-on-focus to stabilize UX.
- Routing is centralized in `src/app/router/routes.tsx` using `createBrowserRouter`. Root routes mount a `ProtectedLayout` group guarded by `requireAuthLoader`, which reads the Zustand auth store and redirects unauthenticated users to `/login`.
- Features own their API/query logic while pages focus on layout: loaders (e.g., `ExamplePage.loader.ts`) prefetch data via React Query `ensureQueryData`, components (e.g., `ExamplePage.tsx`) reuse the same query options for cache hydration, and mutations encapsulate invalidation plus revalidation.
- Authentication state lives in a persisted Zustand store (`src/features/auth/store/auth.store.ts`), allowing both React components and router loaders to read session state synchronously.
- HTTP access is centralized through an Axios instance (`src/shared/services/api/client.ts`) that injects the environment-specific `VITE_BACKEND_URL` and normalizes error messages; optional MSW handlers (`mockService.ts`) can stub endpoints when `VITE_USE_MOCKS` is true.
- UI is composed from shadcn-inspired primitives in `src/shared/components/ui`, layered over Tailwind CSS v4 tokens defined in `src/shared/styles/globals.css` and utility helpers like `cn`.
- Deployment targets static hosting (Vite build artifacts) with AWS Amplify automation (`amplify.yml`), while `customHttp.yml` configures security headers for the CDN.

## Key Modules and Responsibilities
- `src/main.tsx`: Bootstraps the React app, applies global CSS, and invokes `reportWebVitals`.
- `src/App.tsx`: Binds providers to the router instance emitted by `getRoutes(queryClient)`.
- `src/app/config/env.ts`: Maps `import.meta.env` variables into a typed `config` object consumed throughout the app.
- `src/app/router/routes.tsx`: Declares route tree, error boundary (`ErrorPage`), protected child routes, and loader wiring.
- `src/app/router/auth.loader.ts`: Guards protected routes by checking `useAuthStore.getState()`, redirecting to `/login?redirect=...` when unauthenticated.
- `src/features/auth/*`: Contains login API shim (`auth.api.ts`), DTO types, the persisted Zustand store, login/logout hooks, and the validated `LoginForm` component.
- `src/features/example/*`: Demonstrates the query options plus mutation pattern for feature data, feeding `ExamplePage` via loader prefetch.
- `src/pages/*`: Route entry components; notable pages include `LoginPage` (handles redirect-on-success), `ExamplePage` (protected dashboard plus form), `ExampleDetailPage` (dynamic params loader), and fallback pages (`ErrorPage`, `NotFoundPage`).
- `src/shared/components/ui`: Reusable primitive components (Button, Card, Field, Input, etc.) built with `@base-ui/react` and class variance authority, shared across features.
- `src/shared/lib/utils.ts`: Tailwind-aware `cn` helper.
- `src/shared/services/api/client.ts`: Axios instance with error normalization; `mockService.ts` provides MSW handlers; `usersService.ts` illustrates multiple mocking strategies (note the placeholder import `./axios` should point at the configured client).
- `src/shared/types/api.types.ts`: Canonical API response contract.
- `e2e/*`: Playwright test suite with authenticated fixtures, config, and specs for login and protected routes.
- Root configs: `.env-cmdrc.json` defines per-environment variables; `vite.config.js` sets the `@` path alias and Tailwind integration; `tsconfig.json` enforces strict TypeScript; `.prettierrc` and `.vscode/settings.json` document formatting and import preferences.

## Tech Stack
- Language and runtime: TypeScript 5, React 18, Vite 7 (ESM-only build).
- Routing and data: React Router v6 with loaders, TanStack Query v5 for caching and invalidation, Zustand (with `persist`) for auth state.
- Forms and validation: React Hook Form plus Yup resolver, schema-based password policy.
- UI layer: Tailwind CSS v4, shadcn-style components on top of `@base-ui/react`, class-variance-authority, tailwind-merge, Lucide icons ready for use.
- Networking and tooling: Axios for HTTP, optional MSW browser worker for mocks, env-cmd for environment management, web-vitals telemetry hook.
- Testing and QA: Playwright for end-to-end coverage (HTML reporter, auto webServer), ESLint via `react-app` presets, Prettier for formatting.
- DevOps: AWS Amplify CI/CD, custom CDN headers (`customHttp.yml`), Yarn as the package manager.

## Testing Conventions
- End-to-end tests live under `e2e/`, grouped by feature (`auth/`, `example/`) with shared fixtures in `e2e/fixtures`.
- `e2e/fixtures/auth.fixture.ts` extends Playwright's test context with an `authenticatedPage` that performs a UI login using `VITE_TEST_EMAIL` and `VITE_TEST_PASSWORD`.
- Specs use semantic selectors (`getByRole`, `getByLabel`) and rely on Playwright's request routing to mock backend responses when needed.
- `playwright.config.ts` runs tests fully parallel, auto-starts `yarn dev`, retries failed scenarios twice on CI, and captures traces and screenshots on failure.
- Environment-sensitive credentials come from `process.env`; when running via `yarn test:e2e:*`, env-cmd injects values defined in `.env-cmdrc.json`.
- Currently there are no colocated unit or component tests; follow README guidance to colocate future tests beside the code they cover and avoid barrel export patterns.

## Code Organization Patterns
- Feature-first structure: domain logic resides in `src/features/<domain>` with subfolders for `api`, `components`, `hooks`, and `store`, mirroring the recommendations in `STRUCTURE.md`.
- Pages (`src/pages/<PageName>`) own routing layout and UI composition while delegating business logic to feature hooks and components.
- Shared primitives belong to `src/shared/components/ui`; avoid creating barrel exports and import components directly from their source files.
- Global config (`src/app`) handles providers, routing, and environment mapping; keep new providers co-located in `providers`.
- Type aliases and reusable utilities live in `src/shared/types` and `src/shared/lib`.
- Alias resolution: `@/` maps to `src/` (configured in `tsconfig.json` and `vite.config.js`); prefer this for absolute imports from shared or feature directories.
- CSS tokens and Tailwind styles are centralized in `src/shared/styles/globals.css`; Tailwind v4 `@theme` block defines shadcn-compatible variables.
- Persisted auth state stores under the `auth-storage` key in localStorage; loaders access it synchronously via `useAuthStore.getState()`.

## Important Constraints and Guidelines
- Follow README principles: no barrel files, colocate tests, centralize queries in `*.queries.ts`, use loaders for data prefetching, and expose mutations as hooks with sensible defaults.
- Auth login is mocked until a backend is available: only credentials matching `config.testEmail` and `config.testPassword` succeed. Update `.env-cmdrc.json` (or real environment variables) when integrating a real backend.
- QueryClient defaults: `refetchOnWindowFocus` disabled, `staleTime` equals 5 minutes. Override per-query only when necessary to avoid cache thrashing.
- When adding API services, reuse the shared Axios instance; update `usersService.ts` to import from `./client` (or add the missing adapter) before relying on it.
- Maintain formatter conventions (2 spaces, `printWidth: 110`) and enable `source.organizeImports` on save, as enforced by `.vscode/settings.json`.
- Tailwind and shadcn components assume CSS variables defined in `globals.css`; any new theme tokens should extend the existing `@theme` block.
- For mocks, call `enableMocking()` before application bootstrap (for example in `main.tsx`) when `VITE_USE_MOCKS === 'true'`; ensure this guard wraps the worker initialization to avoid running in production.

## Development Workflow
- Setup: `yarn install` (installs dependencies) followed by optional `npx playwright install --with-deps` if browsers are missing.
- Environment management: Commands automatically load variables via env-cmd; adjust `.env-cmdrc.json` for `local`, `dev`, `qa`, and `prod` profiles. Critical keys include `VITE_BACKEND_URL`, `PUBLIC_URL`, `VITE_TEST_EMAIL`, and `VITE_TEST_PASSWORD`.
- Local development: `yarn dev` starts Vite on `http://localhost:5173`. Ensure credentials match the mock auth guard to access protected routes.
- Testing: Use `yarn test:e2e` (headless), `yarn test:e2e:ui`, or scoped scripts per environment (`test:e2e:qa`, etc.). Reports are viewable with `yarn test:e2e:report`.
- Builds: `yarn build` (local env), `yarn build:dev|qa|prod` run with env-specific profiles; `GENERATE_SOURCEMAP` is disabled in production builds.
- Deployment: AWS Amplify executes the appropriate build command based on the branch (`main` -> prod, `qa` -> qa, `dev` -> dev) and serves `dist/`. Security headers from `customHttp.yml` should be mirrored in your hosting or CDN configuration.
- API mocking: Toggle `VITE_USE_MOCKS=true` and invoke `enableMocking()` early in the bootstrap to route HTTP traffic through MSW, or leverage Playwright's request routing in tests.
- Metrics and monitoring: Hook into `reportWebVitals` by passing a handler in `main.tsx` if performance metrics are required.

This document should equip an AI assistant or new contributor with the architectural context, conventions, and workflows needed to confidently extend the project.