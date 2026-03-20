You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a log statement during the application startup process to aid in debugging and monitoring.

## SCOPE
### In scope
- Identify the appropriate startup entry point in the React application (likely src/main.tsx).
- Add a console log or other logging mechanism to indicate the app has started.
- Ensure the log is visible in the browser console or relevant runtime environment.
- Follow existing code style and conventions for logging and formatting.
### Out of scope
- Adding complex logging frameworks or external monitoring integrations.
- Changing authentication, routing, or other unrelated application logic.
- Modifying backend services or API layers.
- Adding or modifying tests for this logging change.

## TECHNICAL CONTEXT
- The app is a React 18 single-page application bootstrapped with Vite.
- The main entry point is src/main.tsx which bootstraps the React app and applies global CSS.
- The project uses TypeScript 5 and follows strict typing conventions.
- Logging should be consistent with existing practices and not disrupt app startup.
- The environment may use MSW for mocking and AWS Amplify for deployment.
- The project uses ESLint and Prettier with 2 space indentation and print width of 110.

## CONSTRAINTS
- Maintain existing code formatting and import organization conventions.
- Do not introduce barrel files or break existing architectural patterns.
- Ensure the log does not negatively impact startup performance or user experience.
- Follow the README guidelines for code organization and conventions.

## ASSUMPTIONS
- The startup entry point is src/main.tsx as described in the README.
- A simple console.log is sufficient for the logging requirement.
- No additional dependencies or configuration changes are needed for logging.
- The developer has access to modify and deploy changes to the frontend codebase.

## ACCEPTANCE CRITERIA
- A log statement indicating app startup is present in the startup file (src/main.tsx).
- The log appears in the browser console when the app is launched locally.
- The change adheres to the project's formatting and import conventions.
- No runtime errors or warnings are introduced by the logging addition.

## EXECUTION PLAN
- Open src/main.tsx, the React app bootstrap file.
- Add a console.log statement at the top or immediately before ReactDOM.render to indicate startup.
- Verify the log message is clear and concise, e.g., 'App startup initiated'.
- Run the app locally using yarn dev and confirm the log appears in the browser console.
- Check code formatting and run linting to ensure compliance with project standards.
- Commit the change with a descriptive message and push to the repository.

## RISK AREAS
- Potential for the log to be missed if placed incorrectly or if console output is suppressed.
- Minor risk of impacting startup timing if logging is done excessively or synchronously.
- Risk of breaking import or formatting conventions if not carefully applied.

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate