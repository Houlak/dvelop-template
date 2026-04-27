You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Remove the phrase 'hello world' from the root README.md file to correct the content.

## SCOPE
### In scope
- Locate the root README.md file in the repository
- Identify and remove all instances of the phrase 'hello world' in the README.md
- Ensure the README.md content remains well-formatted and consistent after removal
### Out of scope
- Modifications to any other documentation files
- Changes to source code or other project files
- Adding or modifying features or tests

## TECHNICAL CONTEXT
- The README.md is located at the root of the repository
- The repository is a React 18 + TypeScript template project
- No specific language or framework constraints affect this task
- The README.md content is in Markdown format
- The phrase 'hello world' appears only in the README.md and needs removal

## CONSTRAINTS
- Do not introduce formatting errors in the README.md
- Do not remove or alter any other content besides the 'hello world' phrase
- Follow existing Markdown conventions and formatting styles

## ASSUMPTIONS
- The phrase 'hello world' is present in the root README.md
- Removing 'hello world' does not affect any functional code or tests
- No other files need to be changed for this task
- The README.md is under version control and changes will be committed

## ACCEPTANCE CRITERIA
- The root README.md no longer contains the phrase 'hello world'
- The README.md renders correctly with no formatting issues
- No other content in the README.md is altered
- The change is committed and pushed to the repository

## EXECUTION PLAN
- Open the root README.md file in a text editor
- Search for all occurrences of the phrase 'hello world'
- Remove each instance carefully without disturbing surrounding text or formatting
- Review the entire README.md to ensure formatting and content integrity
- Save the changes to README.md
- Run a Markdown preview or linter to verify formatting correctness
- Commit the changes with a descriptive message referencing the removal of 'hello world'
- Push the commit to the repository

## RISK AREAS

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate