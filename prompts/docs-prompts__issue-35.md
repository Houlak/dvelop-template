You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Remove all occurrences of 'Hello world' from markdown documentation files in the repository.

## SCOPE
### In scope
- Locate all markdown (.md) files in the repository
- Identify and remove all instances of the exact phrase 'Hello world' from these markdown files
- Ensure no other content is altered or removed
- Commit changes with a clear message indicating removal of 'Hello world' from markdown docs
### Out of scope
- Removing 'Hello world' from non-markdown files
- Refactoring or modifying any code or non-markdown documentation
- Adding or modifying tests
- Changing project configuration or build scripts

## TECHNICAL CONTEXT
- The repository is a React 18 + TypeScript template using Vite 7 bundler
- Markdown files are used for documentation and likely located at the root or in docs folders
- No specific language or framework constraints affect this task
- No barrel files or complex import patterns affect markdown editing
- The project uses Git for version control

## CONSTRAINTS
- Do not modify any content other than removing 'Hello world' occurrences
- Maintain the original formatting and structure of markdown files
- Ensure that the removal does not break markdown syntax or links
- Follow repository conventions for commits and code changes

## ASSUMPTIONS
- All markdown files are UTF-8 encoded and accessible
- The phrase 'Hello world' appears exactly as is (case sensitive) and should be removed wherever found
- No automated tests are required for this task
- The repository has no special tooling that automatically regenerates markdown files

## ACCEPTANCE CRITERIA
- All markdown files contain no instances of the phrase 'Hello world'
- No other content in markdown files is changed
- Changes are committed with a descriptive commit message
- No markdown syntax errors are introduced by the removals

## EXECUTION PLAN
- Search the repository for all files with the .md extension
- For each markdown file, scan for occurrences of the exact phrase 'Hello world'
- Remove all occurrences of 'Hello world' from the file content
- Verify that the markdown file remains valid and well-formed after removal
- Repeat for all markdown files containing the phrase
- Test locally by previewing markdown files to ensure no formatting issues
- Commit all changes with a message such as 'Remove all Hello world occurrences from markdown docs'
- Push changes to the repository

## RISK AREAS
- Accidentally removing similar but not exact phrases
- Breaking markdown formatting by removing text without adjusting surrounding content
- Missing some markdown files or occurrences
- Committing unrelated changes unintentionally

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate