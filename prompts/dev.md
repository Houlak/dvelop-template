You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a clear comment at the top of the README file explaining the purpose of this repository.

## SCOPE
### In scope
- Modify the README file to include a comment explaining the repository's purpose
- Ensure the comment is concise and informative
- Place the comment at the beginning of the README content
### Out of scope
- Changing any other documentation or source code files
- Altering the existing README content beyond adding the comment
- Updating or modifying project code, tests, or configurations

## TECHNICAL CONTEXT
- The repository is a React 18 + TypeScript template focused on feature-based architecture
- Uses React Router v6 with loaders, TanStack Query v5 for data fetching and caching
- State management with Zustand, forms with React Hook Form and Yup
- UI built with Tailwind CSS v4 and Base UI components
- Mocking support via MSW and Axios for API calls
- The README contains detailed architecture, conventions, and development workflow information

## CONSTRAINTS
- Do not alter existing README content except to add the comment
- The comment must be clear and concise
- Follow existing README formatting conventions
- Ensure the comment does not interfere with markdown rendering

## ASSUMPTIONS
- The README file is written in markdown format
- Adding a comment at the top of the README is acceptable and will be preserved
- No additional tooling or configuration changes are required
- The comment will be visible to all users viewing the README

## ACCEPTANCE CRITERIA
- A comment is added at the very top of the README explaining the repository's purpose
- The comment clearly states that this repo is a production-ready React 18 + TypeScript template with feature-based architecture
- The comment does not modify or remove any existing content
- The README renders correctly with the added comment

## EXECUTION PLAN
- Open the README file in the repository
- Add a comment line at the very top of the file describing the repository purpose, e.g., 'This repository is a production-ready React 18 + TypeScript template focused on feature-based architecture, routing, and data fetching.'
- Save the README file
- Verify that the README renders correctly in markdown viewers
- Commit the change with a descriptive message such as 'Add repository purpose comment to README'

## RISK AREAS
- Accidentally modifying or deleting existing README content
- Formatting issues causing markdown rendering problems
- The comment being unclear or too verbose

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate