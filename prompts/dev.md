You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a new console.log statement that outputs a message when the server is started, integrated into the existing React 18 + TypeScript project.

## SCOPE
### In scope
- Modify the server startup code to include a console.log indicating server start
- Ensure the console.log is added in the appropriate initialization file, likely src/main.tsx or related startup module
- Maintain existing project conventions and structure
- Verify no impact on existing functionality or tests
### Out of scope
- Changing any routing, authentication, or UI components
- Modifying backend API logic or services
- Adding new tests or modifying existing tests
- Altering build or deployment configurations

## TECHNICAL CONTEXT
- React 18 + TypeScript project using Vite 7 bundler
- Project uses feature-based architecture with src/main.tsx bootstrapping React in strict mode
- Global initialization such as MSW mocking happens in src/main.tsx before root.render
- No barrel files are used; imports must be direct
- Console.log should be added in a way consistent with existing initialization patterns

## CONSTRAINTS
- Do not introduce barrel imports
- Follow existing project conventions for file placement and import style
- Do not affect existing authentication or routing flows
- Console.log must be simple and not interfere with app startup
- No changes to testing or deployment configurations

## ASSUMPTIONS
- The server start corresponds to the React app initialization in src/main.tsx
- Adding console.log in src/main.tsx before root.render is appropriate
- No backend server code changes are needed
- The environment is local development or similar where console output is visible

## ACCEPTANCE CRITERIA
- A console.log message is printed exactly once when the server/app starts
- The message clearly indicates the server has started
- No runtime errors or warnings are introduced
- The existing app functionality remains unchanged
- The console.log follows the project’s coding style and placement conventions

## EXECUTION PLAN
- Locate the main entry point for app startup, likely src/main.tsx
- Add a console.log statement with a clear message indicating server start before the React root.render call
- Ensure the console.log is not inside any conditional that would prevent it from running on startup
- Run the app locally with yarn dev to verify the console.log appears once on startup
- Check that no errors or warnings appear in the console
- Confirm that the app renders and functions as before
- Commit the change with a descriptive message

## RISK AREAS

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate