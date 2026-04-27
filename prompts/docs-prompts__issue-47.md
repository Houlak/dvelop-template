You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Perform a smoke test to verify the creation of a pull request (PR) and the creation of a route file prompts/docs-prompts__issue-<n>.md in the repository houlak/dvelop-template.

## SCOPE
### In scope
- Create a new route file under prompts/docs-prompts__issue-<n>.md
- Create a pull request to add the new route file
- Verify that the PR creation process works correctly
- Verify that the route file is created with the correct naming convention
- Ensure the route is wired correctly in the router configuration
### Out of scope
- Implementing new feature functionality beyond route creation
- Modifying existing business logic or API services
- Writing unit or integration tests beyond the smoke test
- Changing authentication or authorization flows
- Adjusting styling or UI components

## TECHNICAL CONTEXT
- React 18 + TypeScript with strict mode
- React Router v6 with loaders for routing
- TanStack Query v5 for data fetching and caching
- Zustand persisted auth store for authentication state
- Route files follow the pattern FeaturePage/FeaturePage.tsx + FeaturePage.loader.ts
- Routes are defined centrally in src/app/router/routes.tsx
- Protected routes are grouped under ProtectedLayout and use requireAuthLoader
- No barrel files allowed; import files directly
- PR creation and route file naming must follow conventions
- MSW mocking can be enabled with VITE_USE_MOCKS=true
- Use existing queryClient instance when adding loaders
- Environment variables managed via .env-cmdrc.json and Vite env

## CONSTRAINTS
- No barrel files; import route files directly
- Route files must follow naming conventions
- Protected routes require authentication loader cooperation
- PR creation must integrate with existing repo workflows
- Route file must be created under prompts/docs-prompts__issue-<n>.md
- Follow existing architectural layering and routing conventions
- Use existing queryOptions and loaders patterns for data fetching
- Maintain consistency with existing state management and auth flow

## ASSUMPTIONS
- The repository uses React Router v6 with loaders as described
- The PR creation process is automated or semi-automated and can be triggered
- The environment variables for testing and auth are properly configured
- The route file naming pattern is strictly followed
- The smoke test will be run in a local or CI environment with access to the repo
- The existing router configuration can be extended safely
- The user has permissions to create branches and PRs in the repository

## ACCEPTANCE CRITERIA
- A new route file prompts/docs-prompts__issue-<n>.md is created following naming conventions
- A pull request is successfully created to add the new route file
- The PR passes basic validation checks (e.g., CI pipelines triggered)
- The new route is correctly wired in src/app/router/routes.tsx
- The route is accessible and does not break existing routing
- The smoke test verifies that the PR and route creation process completes without errors

## EXECUTION PLAN
- Identify the issue number <n> to use in the route file name
- Create the new route file prompts/docs-prompts__issue-<n>.md with minimal content
- Add the new route entry in src/app/router/routes.tsx under the appropriate layout
- Commit the changes to a new branch named appropriately for the issue
- Push the branch to the remote repository
- Create a pull request targeting the main development branch
- Verify that the PR creation triggers CI pipelines and passes initial checks
- Manually or automatically test that the new route is accessible and does not cause errors
- Confirm that the PR and route creation process completes successfully as a smoke test

## RISK AREAS
- Incorrect route file naming causing routing or import errors
- Failure to wire the route correctly in the router configuration
- PR creation failing due to permission or branch conflicts
- CI pipelines failing due to missing dependencies or configuration
- Authentication loader blocking access if route is protected without proper setup

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate