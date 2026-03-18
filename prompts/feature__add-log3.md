You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a simple log message that greets when the app starts up.

## SCOPE
### In scope
- Modify the app bootstrap file src/main.tsx to include a console log greeting on app startup
- Ensure the log appears once when the React app is initialized
- Follow existing code conventions and formatting rules
### Out of scope
- Adding complex logging infrastructure or external logging services
- Changing any UI components or pages
- Modifying authentication or API logic
- Adding tests for this trivial logging change

## TECHNICAL CONTEXT
- The app is a React 18 SPA bootstrapped with Vite, entry point is src/main.tsx
- TypeScript 5 is used throughout the codebase
- The app uses React.StrictMode and global providers configured in src/app/providers
- Logging should be done via console.log for simplicity
- Code formatting conventions: 2 spaces indentation, printWidth 110, organize imports on save
- No barrel exports should be created or modified
- The app supports optional MSW mocking enabled via enableMocking() in main.tsx
- The app uses environment variables mapped in src/app/config/env.ts but none are needed for this task

## CONSTRAINTS

## ASSUMPTIONS
- The log should be a simple console.log statement with a friendly greeting message
- The log should appear only once when the app is launched
- No additional dependencies or packages are required
- The change should not affect app functionality or user experience

## ACCEPTANCE CRITERIA
- When the app starts, the browser console shows a greeting log message
- The greeting log appears only once per app load
- The app continues to function normally without errors
- Code changes follow the project's formatting and import conventions

## EXECUTION PLAN
- Open src/main.tsx where the React app is bootstrapped
- Add a console.log statement with a greeting message before or after the ReactDOM.render or createRoot call
- Ensure the log message is clear and friendly, e.g. 'Hello! App has started.'
- Verify no other code is affected and formatting rules are respected
- Run the app locally with yarn dev and confirm the log appears once in the browser console
- Commit the change with a descriptive message referencing the task

## RISK AREAS
- Minimal risk as this is a non-intrusive console log addition
- Potential for multiple logs if placed inside components or hooks instead of the bootstrap file
- Ensure no accidental side effects or import changes occur

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate