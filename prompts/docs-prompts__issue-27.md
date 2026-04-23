You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Remove all occurrences of the phrase 'Hello world' from markdown documentation files in the repository.

## SCOPE
### In scope
- All markdown (.md) files in the repository, including README and documentation files
- Removing every instance of the exact phrase 'Hello world' regardless of case or surrounding context
### Out of scope
- Non-markdown files such as code, configuration, or other asset files
- Other phrases or text modifications beyond 'Hello world'
- Refactoring or modifying any code or functionality

## TECHNICAL CONTEXT
- The repository is a React 18 + TypeScript project using Vite, with a feature-based architecture
- Markdown files are used for documentation and guides, including README.md
- No specific language or framework constraints affect markdown editing
- No barrel files or complex import structures apply to markdown files
- Markdown files may contain multiple occurrences of 'Hello world' that need removal

## CONSTRAINTS
- Do not alter any content other than removing 'Hello world' occurrences
- Preserve the formatting and structure of markdown files after removal
- Ensure no partial words or unrelated text are removed
- Maintain UTF-8 encoding and line endings consistent with existing files

## ASSUMPTIONS
- All markdown files are UTF-8 encoded and editable
- The phrase 'Hello world' appears as a standalone phrase and not as part of other words
- No automated tooling currently modifies markdown files for this purpose
- No additional text replacement or content changes are requested

## ACCEPTANCE CRITERIA
- All markdown files contain no instances of the exact phrase 'Hello world'
- No other content or formatting in markdown files is changed
- The repository builds and runs without errors after changes
- Documentation remains readable and structurally intact

## EXECUTION PLAN
- Identify all markdown (.md) files in the repository, including README.md and any docs/
- For each markdown file, scan the content for occurrences of the exact phrase 'Hello world'
- Remove all occurrences of 'Hello world' from the file content without affecting other text
- Save the updated markdown files preserving original encoding and line endings
- Run a validation script or manual check to confirm no 'Hello world' remains in any markdown file
- Commit the changes with a descriptive message referencing the removal task
- Optionally, run repository build and tests to ensure no side effects

## RISK AREAS
- Accidentally removing partial matches or similar phrases
- Breaking markdown formatting if removal is not done carefully
- Missing some markdown files if not all are scanned
- Encoding or line ending changes causing diffs or issues

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate