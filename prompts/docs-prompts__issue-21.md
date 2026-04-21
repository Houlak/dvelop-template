You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Remove all occurrences of the text 'Hello world' from markdown files in the repository.

## SCOPE
### In scope
- All markdown (.md) files in the repository
### Out of scope
- Non-markdown files
- Code files (tsx, ts, js, etc.)
- Binary or asset files

## TECHNICAL CONTEXT
- The repository is a React 18 + TypeScript project using Vite 7 bundler
- Markdown files may be used for documentation, including README.md and other docs
- No specific language or framework constraints for this text removal task
- No barrel files should be created or modified
- Follow existing repository conventions for file modifications

## CONSTRAINTS
- Do not alter any content other than removing 'Hello world' text
- Preserve formatting and other content in markdown files
- No introduction of new dependencies or tools
- Ensure no side effects on code or configuration files

## ASSUMPTIONS
- 'Hello world' text appears only in markdown files
- Removal means deleting the exact phrase 'Hello world' wherever it appears
- No replacement text is required
- No changes to other file types are needed

## ACCEPTANCE CRITERIA
- All markdown files contain no instances of the exact phrase 'Hello world'
- No other content or formatting in markdown files is changed
- No build or runtime errors introduced by the changes
- Codebase remains consistent with repository conventions

## EXECUTION PLAN
- Identify all markdown (.md) files in the repository
- Search each markdown file for occurrences of the exact phrase 'Hello world'
- Remove all instances of 'Hello world' from these files without altering other content
- Review changes to ensure only the target text is removed and formatting is preserved
- Run any existing linting or formatting tools to verify no unintended changes
- Commit changes with a descriptive message referencing the removal of 'Hello world' text
- Verify that the repository builds and runs without issues after the change

## RISK AREAS
- Accidental removal of similar but distinct text
- Unintended formatting changes in markdown files
- Missing some occurrences of 'Hello world' if spread across multiple files

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate