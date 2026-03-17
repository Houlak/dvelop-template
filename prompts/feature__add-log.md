You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a simple log message that greets when the app starts up.

## SCOPE
### In scope
- Modify the app bootstrap file src/main.tsx to include a console log greeting on startup.
- Ensure the log appears once when the React app is initialized.
- Follow existing code style and conventions in the project.
### Out of scope
- Adding complex logging infrastructure or external logging services.
- Changing authentication, routing, or other unrelated features.
- Adding tests for the log message as no testing conventions currently cover this.
- Modifying deployment or build configurations.

## TECHNICAL CONTEXT
- The app is a React 18 SPA bootstrapped with Vite, entry point is src/main.tsx.
- The app uses TypeScript 5 and React 18 with React.StrictMode.
- Global CSS is applied in src/main.tsx before rendering.
- The app uses a QueryProvider and router instance created by getRoutes(queryClient).
- Logging should be done via console.log for simplicity.
- The project uses 2 spaces indentation and printWidth 110 formatting conventions.
- No barrel files should be created or modified.
- The app bootstrap code is the appropriate place for startup logs.

## CONSTRAINTS
- Maintain existing formatting and import organization conventions.
- Do not introduce new dependencies or complex logging frameworks.
- The log must only appear once on app startup.
- Follow the README guidelines about code organization and conventions.

## ASSUMPTIONS
- The app bootstrap file src/main.tsx is the correct place to add startup logs.
- Console.log is acceptable for simple logging in this context.
- No existing startup logs currently exist that conflict with this addition.
- The environment variable VITE_USE_MOCKS or other env vars do not affect this logging.
- The project uses TypeScript and React as described in the README.

## ACCEPTANCE CRITERIA
- When the app starts, a console log message greeting the user is printed once.
- The log message is simple and clear, e.g. 'Hello! App has started.'
- No runtime errors or warnings are introduced by adding the log.
- The code changes comply with the project's formatting and import conventions.
- The log does not appear multiple times or on route changes, only on initial app bootstrap.

## EXECUTION PLAN
- Open src/main.tsx, the React app bootstrap file.
- Add a console.log statement with a greeting message before or after the ReactDOM.render call.
- Ensure the log is placed so it runs once on app startup.
- Verify formatting and import order comply with project conventions.
- Run the app locally with yarn dev and confirm the log appears once in the browser console.
- Check that no errors or warnings appear in the console.
- Commit the change with a descriptive message referencing the task.

## RISK AREAS
- Placing the log inside a component or hook could cause multiple logs on re-renders.
- Incorrect placement might cause the log to not appear or appear multiple times.
- Formatting or import changes could violate project conventions if not carefully done.

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate