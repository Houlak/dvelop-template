You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a simple log message that greets when the app starts up.

## SCOPE
### In scope
- Modify the app bootstrap code to include a console log greeting on startup.
- Ensure the log appears when the React app is initialized in src/main.tsx.
### Out of scope
- Changing any UI components or pages other than adding the log.
- Adding complex logging infrastructure or external logging services.
- Modifying authentication or routing logic.

## TECHNICAL CONTEXT
- The app is a React 18 SPA bootstrapped with Vite, entry point at src/main.tsx.
- React.StrictMode is used to wrap the app.
- Global CSS is applied in src/main.tsx.
- The app uses TypeScript 5 and Vite 7 with ESM-only build.
- The app uses Zustand for auth state and TanStack Query for data caching.
- The app is deployed as static artifacts built by Vite.
- Logging should be simple and synchronous, using console.log.

## CONSTRAINTS
- Follow existing formatter conventions: 2 spaces indentation, printWidth 110.
- Do not introduce barrel files or break existing import conventions.
- Do not affect existing app startup flow or cause side effects beyond logging.
- Ensure the log only appears once on app startup, not on re-renders.
- Do not add dependencies or change build configurations.

## ASSUMPTIONS
- The app entry point is src/main.tsx where ReactDOM.createRoot is called.
- Adding a console.log before or after root.render is sufficient to log on startup.
- No existing logging mechanism is currently used for startup greetings.
- The environment variable VITE_USE_MOCKS or other env vars do not affect this simple log.
- The app is run in a browser environment where console.log is available.

## ACCEPTANCE CRITERIA
- When the app starts, a console log message 'Hello! App is starting up.' appears once in the browser console.
- No errors or warnings are introduced by adding the log.
- The log message appears before or immediately after the React app renders.
- The existing app functionality and UI remain unchanged.

## EXECUTION PLAN
- Open src/main.tsx where the React app is bootstrapped.
- Add a console.log statement with the greeting message before or after the root.render call.
- Ensure the log message is simple and clear: 'Hello! App is starting up.'
- Run the app locally with yarn dev and verify the log appears once in the browser console.
- Run existing tests and verify no regressions occur.
- Commit the change following existing formatting and import conventions.
- Document the addition briefly in the commit message.

## RISK AREAS
- Accidentally placing the log inside a React component causing multiple logs on re-renders.
- Breaking the app startup flow if the log is added incorrectly.
- Formatting or linting errors if conventions are not followed.

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate