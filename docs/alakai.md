# Alakai Project Context Guide

This repository provides a production-ready React 18 + TypeScript template centered on feature-based architecture, React Router loaders, and TanStack Query. The goal of this document is to give an AI coding assistant enough context to extend the project safely.

## Architecture Overview
- **Feature-based layering**: Business domains live under `src/features/*`; route entry points live in `src/pages/*`; cross-cutting utilities/components reside in `src/shared/*`.
- **Routing + data prefetch**: `src/app/router/routes.tsx` creates the router with React Router v6. Loaders (e.g., `ExamplePage.loader.ts`) prefetch data using a shared `QueryClient`. Protected sections are grouped under `ProtectedLayout` and gate access through the `requireAuthLoader`, which inspects the persisted Zustand auth store.
- **Data fetching & caching**: TanStack Query v5 (`QueryProvider`) centralizes cache configuration (5‑minute `staleTime`, no window refetch). Every query is defined once via `queryOptions` factories (e.g., `exampleQueryOptions`) so loaders and components share type-safe definitions.
- **State management**: Authentication state is managed with a persisted Zustand store (`src/features/auth/store/auth.store.ts`). Loaders access `useAuthStore.getState()` to remain framework-agnostic.
- **Forms & validation**: Forms use React Hook Form + Yup. Validation schemas are kept alongside the component (see `LoginForm` and `ExamplePage`).
- **UI layer**: Shadcn-inspired UI primitives composed with Base UI (`@base-ui/react`) and Tailwind CSS v4 are stored in `src/shared/components/ui`.
- **Mocking & API integration**: `src/shared/services/api/client.ts` exposes an Axios instance configured via `import.meta.env`. Optional MSW support (`mockService.ts`) can be enabled when `VITE_USE_MOCKS=true`.
- **Error handling**: `ErrorPage` acts as the router `errorElement` for loader/action failures; `NotFoundPage` covers unmatched routes.

## Key Modules and Responsibilities

| Path | Responsibility | Notes for AI assistant |
| --- | --- | --- |
| `src/main.tsx` | Bootstraps React in strict mode, loads global styles, and renders `<App />`. | Any global initialization (e.g., MSW) should happen here before `root.render`. |
| `src/App.tsx` | Wraps the application in `AppProviders` and mounts the router created by `getRoutes(queryClient)`. | Pass the existing `queryClient` when introducing new loaders. |
| `src/app/config/env.ts` | Exposes runtime configuration sourced from Vite env variables. | Keep keys in sync with `.env-cmdrc.json`. |
| `src/app/providers/QueryProvider.tsx` | Single `QueryClient` instance and configuration. | Update `defaultOptions` here when adjusting global cache behavior. |
| `src/app/router/routes.tsx` | Central router definition, protected route grouping, loader wiring, and redirects. | Add new routes here; protected routes go inside the `ProtectedLayout` block. |
| `src/app/router/auth.loader.ts` | Loader enforcing authentication using the Zustand store. | Redirects to `/login?redirect=…`; ensure new protected loaders cooperate with this flow. |
| `src/features/auth/*` | Auth API mock, types, login/logout hooks, persisted store, and `LoginForm`. | `authApi.login` currently mocks the backend and validates against `VITE_TEST_*` credentials. |
| `src/features/example/*` | Example feature showcasing queryOptions + mutation invalidation pattern. | Use as reference for real features. |
| `src/pages/*` | Route-level components and loaders. `ExamplePage` demonstrates loader data hydration, form submission, and navigation. | Each page maintains `Page.tsx` + `Page.loader.ts` pairing. |
| `src/shared/components/ui/*` | Tailwind + Base UI powered primitives (`Button`, `Card`, `Field`, etc.). | Import directly from the component file; avoid barrels. |
| `src/shared/lib/utils.ts` | Utility helpers (currently `cn`). | Extend here for additional shared helpers. |
| `src/shared/services/api/client.ts` | Axios instance with response interceptor that normalizes API errors. | Replace `// Add logout logic` when wiring 401 handling. |
| `src/shared/services/api/mockService.ts` | MSW handlers and `enableMocking()` helper. | Opt-in by invoking `enableMocking()` before rendering the app and setting `VITE_USE_MOCKS=true`. |
| `src/shared/services/api/usersService.ts` | Example service illustrating multiple mocking strategies. | Uses a placeholder import (`./axios`) and mock data; adapt to the actual client before production use. |
| `src/shared/styles/globals.css` | Tailwind v4 entrypoint + CSS variables for the design system. | Extend using Tailwind’s new `@theme` syntax. |
| `e2e/**/*` | Playwright end-to-end specs, fixtures, and config. | Uses `env-cmd` environments; fixtures provide authenticated contexts. |
| `.env-cmdrc.json` | Central environment map for local/dev/qa/prod. | `yarn dev` reads the `local` block automatically. |
| `amplify.yml` & `customHttp.yml` | AWS Amplify build pipeline and additional HTTP headers. | Adjust when deployment requirements change. |

## Tech Stack
- **Language & framework**: React 18 + TypeScript (strict mode), Vite 7 bundler.
- **Routing & data layer**: React Router v6 (loaders), TanStack Query v5 for caching/invalidation, Axios for HTTP.
- **State & forms**: Zustand (with `persist` middleware) for auth; React Hook Form + Yup for validation.
- **UI & styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin), Shadcn-style components built on Base UI, `class-variance-authority`, `tailwind-merge`, Lucide icons.
- **Tooling**: Env management with `env-cmd`, Prettier formatting (`.prettierrc`), optional MSW for API mocking, Playwright for E2E tests, GitHub Actions + AWS Amplify for CI/CD.

## Code Organization Patterns
- **Directory layout**: 
  ```
  src/
    app/        # global config, providers, router
    features/   # business logic grouped by domain
    pages/      # route entry components + loaders
    shared/     # UI primitives, services, utils, styles
    assets/     # static assets (e.g., logo.png)
  ```
- **Naming conventions**: 
  - Pages follow `FeaturePage/FeaturePage.tsx` + `FeaturePage.loader.ts`.
  - Hooks reside in `hooks/` with `useX` naming; API calls go under `api/`.
  - UI components are PascalCase; Tailwind classes live inline.
- **Imports**: Vite alias `@` points to `src`, with shadcn shortcuts (`@/shared/components`, etc.). Avoid barrel exports per project guidelines; import files directly.
- **Styles**: Tailwind utility-first classes, design tokens defined via CSS variables in `globals.css`.
- **Testing files**: Playwright specs end in `.spec.ts`. Future unit/component tests should be co-located next to their source (e.g., `Component.test.tsx`).

## Testing Conventions
- **E2E tests**: Located in `e2e/`, orchestrated by Playwright (`playwright.config.ts`).
  - `e2e/auth/login.spec.ts` covers login validation, success, and redirect mechanics.
  - `e2e/example/example-page.spec.ts` verifies protected route behavior using the authenticated fixture.
  - `e2e/fixtures/auth.fixture.ts` logs in via UI using credentials from environment variables, exposing an `authenticatedPage`.
  - Configuration auto-starts `yarn dev` and targets `http://localhost:5173`; retries are enabled on CI.
- **Credentials for tests**: Ensure `VITE_TEST_EMAIL` and `VITE_TEST_PASSWORD` are set (env-cmd loads them from `.env-cmdrc.json` in `local` profile by default).
- **Additional guidance**: Although Jest/RTL tests are not present, README and STRUCTURE docs expect co-located tests and direct imports (no barrels). Follow that pattern when adding unit/integration tests.

## Development Workflow
1. **Install dependencies**: `yarn install`.
2. **Run locally**: `yarn dev` (env-cmd injects the `local` environment; Vite serves on port 5173).
3. **Environment variables**: Configure `.env-cmdrc.json` or set shell envs. Core keys:
   - `VITE_BACKEND_URL`
   - `VITE_ENV_NAME`
   - `PUBLIC_URL`
   - `VITE_TEST_EMAIL`, `VITE_TEST_PASSWORD` (used by auth mocks and Playwright).
4. **Mocking APIs**: To use MSW, set `VITE_USE_MOCKS=true` and call `enableMocking()` before rendering (e.g., in `main.tsx`).
5. **Build outputs**:
   - `yarn build` (uses current env),
   - `yarn build:dev|build:qa|build:prod` for targeted environments (driven by env-cmd),
   - AWS Amplify (`amplify.yml`) chooses the build script based on `AWS_BRANCH`.
6. **Testing**:
   - `yarn test:e2e` (default env),
   - Environment-specific variants (`yarn test:e2e:local`, `...:dev`, etc.) to align with remote configs,
   - `yarn test:e2e:ui` for interactive debugging, `yarn test:e2e:report` to inspect the HTML report.
7. **CI/CD**:
   - `.github/workflows/e2e-tests.yml` runs Playwright on pushes/PRs to `main` and `develop`, uploading reports and screenshots on failure.
   - Example build workflow (`build-react-frontend-template.yml.example`) illustrates environment-specific builds.
8. **Formatting & IDE support**: Prettier configuration (`printWidth: 110`, `singleQuote: true`); `.vscode/settings.json` enforces import organization and consistent formatting.

## Important Constraints & Guidelines
- **No barrel files**: Import directly from concrete files to avoid circular dependencies and improve tree-shaking.
- **Query options single source**: Define queries once with `queryOptions` (see `example.queries.ts`) and reuse in loaders and components to maintain type safety.
- **Protected routing**: Always wire authenticated routes through `ProtectedLayout` + `requireAuthLoader`. The loader expects `useAuthStore` to hold persisted credentials (`auth-storage` key).
- **Auth mocks**: `authApi.login` validates against env-configured credentials and simulates latency. Update when integrating a real backend; remember to propagate changes to E2E fixtures.
- **Error handling**: Centralize 401 handling inside `client.ts` interceptor (`// Add logout logic`) to keep individual services thin.
- **Services placeholders**: Some templates (e.g., `usersService.ts`) reference stubbed imports—replace `./axios` with the shared client or real endpoints before use.
- **Styling consistency**: Reuse shared UI primitives (`Button`, `Card`, `Field`, etc.) and Tailwind tokens; avoid ad-hoc CSS unless extending the design system.
- **State persistence**: `useAuthStore` persists to localStorage. Clearing auth should use `clearAuth()` to ensure storage + state stay in sync.
- **Testing philosophy**: Co-locate component tests when added; prefer semantic selectors in Playwright (already showcased).

## Deployment Notes
- **AWS Amplify**: Build commands are environment-aware via `amplify.yml`; outputs deploy from the `dist/` directory. Ensure corresponding env vars exist in Amplify.
- **Static hosting headers**: `customHttp.yml` enforces cache-control for `index.html`, MIME type for `.wasm`, and security headers (X-Frame-Options, HSTS, Server suppression). Keep aligned with hosting provider requirements.
- **Public assets**: Place static files in `public/`; `index.html` injects `/src/main.tsx` and standard PWA metadata.

Armed with the above, an AI assistant can add features, extend the auth flow, or adjust infrastructure while respecting the project’s architectural and operational conventions.
