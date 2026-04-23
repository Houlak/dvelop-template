You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a console.log statement that outputs a message when the server is started to provide a simple runtime indication of server startup.

## SCOPE
### In scope
- Modify the server startup entry point to include a console.log statement
- Ensure the log message is clear and concise indicating server start
- Follow existing project conventions for placement and style of logging
### Out of scope
- Changing server startup logic beyond adding the log
- Adding complex logging frameworks or external dependencies
- Modifying client-side React code or UI components
- Changing authentication, routing, or API logic

## TECHNICAL CONTEXT
- The project is a React 18 + TypeScript template using Vite 7 bundler
- Server startup code is not explicitly detailed but likely resides in the backend or dev server scripts
- No specific backend language or framework is identified in the repo context
- The project uses React Router v6, TanStack Query v5, Zustand for state, Axios for HTTP, and MSW for mocking
- The main React entry point is src/main.tsx which bootstraps the React app and global initialization
- No barrel files are used; imports are direct
- Logging should be minimal and consistent with existing conventions

## CONSTRAINTS
- No barrel files allowed; import directly from concrete files
- Keep changes minimal and focused on adding a simple console.log
- Do not introduce new dependencies or complex logging mechanisms
- Respect existing project architecture and conventions
- Ensure no disruption to existing server or client startup processes

## ASSUMPTIONS
- The server startup entry point is accessible and modifiable
- Adding a console.log at server start is sufficient for runtime indication
- The project uses a Node.js or similar environment where console.log is appropriate
- No additional configuration or environment variables are required for logging
- The log message will be visible in the standard output where the server runs

## ACCEPTANCE CRITERIA
- A console.log statement is added that outputs a clear message when the server starts
- The log message appears exactly once per server start
- No errors or side effects occur due to the added log
- The change respects the project’s no-barrel import policy and coding conventions
- The server continues to start and function normally after the change

## EXECUTION PLAN
- Identify the server startup script or entry point file (e.g., main server file or dev server script)
- Add a console.log statement at the point where the server successfully starts listening or initializes
- Use a clear and concise message such as 'Server started successfully' or similar
- Test locally to confirm the log appears once on server start and no errors occur
- Commit the change following project commit message conventions
- Optionally, document the addition if project documentation covers runtime logs

## RISK AREAS

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate