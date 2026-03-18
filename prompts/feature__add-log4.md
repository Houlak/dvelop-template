You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a simple log message that greets when the application starts up.

## SCOPE
### In scope
- Modify the application bootstrap file src/main.tsx to include a console log greeting on app startup.
- Ensure the log message appears once when the React app is initialized.
- Follow existing code conventions and formatting rules.
### Out of scope
- Changing any UI components or pages other than the bootstrap entry point.
- Adding complex logging infrastructure or external logging services.
- Modifying authentication, routing, or API logic.

## TECHNICAL CONTEXT
- The app is a React 18 SPA bootstrapped with Vite, entry point at src/main.tsx.
- TypeScript 5 is used as the language.
- The app uses React.StrictMode and global providers configured in src/app/providers.
- The main.tsx file applies global CSS and invokes reportWebVitals.
- Logging should be a simple console.log statement.
- Follow existing formatter conventions: 2 spaces indentation, printWidth 110.
- No barrel exports; import components directly from source files.
- The app uses environment variables via import.meta.env mapped in src/app/config/env.ts.

## CONSTRAINTS
- Do not introduce any new dependencies or packages.
- Keep the log message simple and non-intrusive.
- Ensure the log only appears once per app startup.
- Maintain existing code style and formatting.
- Do not affect app performance or user experience.

## ASSUMPTIONS
- The developer has access to modify src/main.tsx.
- Console output is acceptable for simple logging.
- No additional configuration is needed for this log.
- The app is started via yarn dev or equivalent Vite command.

## ACCEPTANCE CRITERIA
- A console log greeting message is printed once when the app starts.
- The log message clearly indicates the app has been initialized.
- No errors or warnings are introduced by the change.
- Code changes conform to the project's formatting and style guidelines.
- The app continues to function normally after the change.

## EXECUTION PLAN
- Open src/main.tsx, the React app bootstrap file.
- Add a console.log statement with a greeting message near the top or after initial imports.
- Ensure the log runs once when the app initializes, before or after ReactDOM.render or createRoot().render call.
- Run yarn dev to start the app locally and verify the log message appears in the browser console.
- Run existing tests and linting to confirm no regressions or style violations.
- Commit the change with a descriptive message referencing the addition of the startup greeting log.
- Push the change and optionally open a pull request for review.

## RISK AREAS
- Accidentally placing the log inside a component causing multiple logs on re-renders.
- Breaking the app bootstrap by modifying unrelated code.
- Introducing formatting or linting errors.
- Logging sensitive information by mistake (should be avoided).

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate