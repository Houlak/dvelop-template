You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a clear comment at the top of the README file explaining the purpose of this repository.

## SCOPE
### In scope
- Modify the README file to include a comment explaining the repository's purpose
- Ensure the comment is concise and informative
- Use the existing README content to summarize the repository's purpose
### Out of scope
- Changing any other documentation files
- Modifying source code or implementation
- Adding new features or tests

## TECHNICAL CONTEXT
- The repository is a React 18 + TypeScript template with feature-based architecture
- Uses React Router v6 with loaders and TanStack Query v5 for data fetching and caching
- State management via Zustand with persisted auth store
- UI built with Tailwind CSS v4 and Base UI components
- API integration uses Axios with optional MSW mocking
- The README contains detailed architecture, tech stack, conventions, and workflows

## CONSTRAINTS
- Do not alter existing README content except to add the comment
- The comment must be placed at the very top of the README
- The comment should be formatted as a markdown comment so it is not rendered
- Follow existing documentation style and tone

## ASSUMPTIONS
- The README is in markdown format
- The comment syntax for markdown is <!-- comment -->
- No other files need to be updated
- The repository context and purpose are accurately described in the README

## ACCEPTANCE CRITERIA
- A markdown comment is added at the top of the README
- The comment clearly explains the repository's purpose as a React 18 + TypeScript production-ready template
- The comment does not disrupt the rendering of the README content
- No other content in the README is changed or removed

## EXECUTION PLAN
- Open the README file in the repository root
- Insert a markdown comment at the very top of the file
- Write a concise explanation of the repository's purpose inside the comment
- Save the README file
- Verify that the README renders correctly without showing the comment
- Commit the change with a descriptive message

## RISK AREAS
- Accidentally modifying or deleting existing README content
- Incorrect comment syntax causing the comment to render visibly
- Placement of the comment interfering with markdown parsers or tools

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate