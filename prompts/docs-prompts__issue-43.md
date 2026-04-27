You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Add a purpose comment at the top of README.md explaining that this repository is a starter template for production-ready React applications with a scalable feature-based architecture.

## SCOPE
### In scope
- Modify README.md to include a clear purpose comment at the top
- Ensure the comment accurately reflects the repository's role as a starter template for React apps
- Use language consistent with the existing README style and tone
### Out of scope
- Changing any other documentation content beyond adding the purpose comment
- Modifying source code or project files other than README.md
- Altering existing architectural descriptions or technical details

## TECHNICAL CONTEXT
- The repository is a React 18 + TypeScript template using Vite 7 bundler
- Feature-based architecture with business domains under src/features/*
- Routing with React Router v6 using loaders
- Data fetching and caching with TanStack Query v5
- State management with Zustand and persisted auth store
- Forms with React Hook Form and Yup validation
- UI primitives built with Base UI and Tailwind CSS v4
- API integration using Axios with optional MSW mocking
- Testing with Playwright for end-to-end tests
- CI/CD pipelines using GitHub Actions and AWS Amplify

## CONSTRAINTS
- Do not introduce barrel files; import files directly
- Maintain consistency with existing README formatting and conventions
- Ensure the added comment does not disrupt existing README content structure
- Follow the project’s style guidelines for documentation

## ASSUMPTIONS
- The README.md file is the primary documentation entry point for the repository
- The purpose comment should be concise and informative
- No additional tooling or configuration changes are required to add the comment
- The existing README content accurately reflects the current state of the project

## ACCEPTANCE CRITERIA
- README.md contains a clear purpose comment at the very top
- The comment explicitly states that the repo is a starter template for production-ready React apps
- The comment mentions the scalable feature-based architecture
- The addition does not alter or remove any existing README content
- The formatting of the README remains consistent and readable

## EXECUTION PLAN
- Open README.md in the repository root
- Insert a comment at the very top of the file describing the purpose of the repository
- Ensure the comment states that this repo is a starter template for production-ready React apps
- Include mention of the scalable feature-based architecture in the comment
- Review the README.md to confirm no existing content is removed or disrupted
- Commit the change with a descriptive message referencing the purpose comment addition
- Push the commit to the repository

## RISK AREAS
- Accidentally modifying or deleting existing README content
- Inconsistent formatting that could reduce readability
- Misrepresenting the repository’s purpose in the comment

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate