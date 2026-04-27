You are a senior software engineer. Implement the following technical specification.

## OBJECTIVE
Verify that branch naming conventions are correctly enforced and consistent with project guidelines through smoke testing.

## SCOPE
### In scope
- Review existing branch naming conventions documented or implied in the repository
- Create or identify smoke tests that validate branch names against conventions
- Run smoke tests on current branches to detect naming violations
- Document any deviations or inconsistencies found
- Recommend fixes or updates to branch naming policies if needed
### Out of scope
- Implementing full CI/CD pipeline enforcement for branch naming
- Refactoring or renaming existing branches
- Extending testing beyond branch naming conventions
- Modifying unrelated repository configurations or code

## TECHNICAL CONTEXT
- Repository uses Git for version control
- No explicit branch naming convention documented in README or project docs
- Project uses React 18 + TypeScript with Vite bundler
- CI/CD pipelines configured via GitHub Actions and AWS Amplify
- Testing framework includes Playwright for E2E tests, no explicit unit test framework mentioned
- No barrel files allowed; direct imports required
- Branch naming conventions should align with feature-based architecture and workflow practices

## CONSTRAINTS
- No barrel files usage allowed
- Branch naming conventions must be consistent with feature-based architecture
- Testing should be lightweight smoke tests, not full validation suites
- No changes to existing branches or repository structure
- Testing must not interfere with ongoing development workflows

## ASSUMPTIONS
- Branch naming conventions are either implicit or need to be defined based on project structure
- Smoke tests can be implemented as scripts or lightweight checks
- Access to repository branches and CI environment is available for testing
- Developers will update branch naming policies based on smoke test results
- No automated enforcement currently exists for branch naming

## ACCEPTANCE CRITERIA
- Smoke tests exist that validate branch names against defined conventions
- Smoke tests run successfully without errors on current branches
- Any branch naming violations are clearly reported
- Documentation or guidelines for branch naming conventions are created or updated
- No impact on existing CI/CD or development workflows

## EXECUTION PLAN
- Gather any existing implicit or explicit branch naming conventions from project documentation or team input
- Define a clear set of branch naming rules aligned with feature-based architecture and workflow
- Develop a lightweight smoke test script to validate branch names against these rules
- Run the smoke test script against all current branches in the repository
- Analyze results and document any violations or inconsistencies
- Update project documentation to include branch naming conventions and testing approach
- Share findings and recommendations with the development team for adoption
- Integrate smoke test into local developer workflows or CI pipeline as an optional check

## RISK AREAS
- Lack of explicit branch naming conventions may cause ambiguity in test criteria
- Smoke tests may miss edge cases if naming rules are not comprehensive
- Running tests on all branches may require appropriate permissions and could be time-consuming
- Developers may resist adopting new naming conventions or testing steps
- Potential for false positives or negatives in branch name validation

## OUTPUT REQUIREMENTS
- Produce working code (no pseudocode)
- Keep changes minimal and aligned to existing architecture
- Add/adjust unit tests where appropriate