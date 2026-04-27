# Branch Naming Smoke Test

## Purpose

Validate that branch names are compatible with Git references, GitHub Actions filters, and AWS Amplify branch-based build selection without changing application logic or CI/CD configuration.

## Command

```bash
yarn smoke:branch-naming
```

Optional remote push validation (requires `curl` or `gh`):

```bash
RUN_REMOTE_PUSH=1 yarn smoke:branch-naming
```

## What the smoke test validates

1. Reads `.github/workflows/e2e-tests.yml` and confirms push/PR filters target `main` and `develop`.
2. Creates and deletes temporary local branches for representative valid patterns:
   - `feature/*`
   - `bugfix/*`
   - `hotfix/*`
   - `chore/*`
   - `release/*`
   - nested and long branch names
3. Verifies invalid branch names are rejected by Git ref formatting rules.
4. Confirms `amplify.yml` branch mapping stays consistent:
   - `main -> build:prod`
   - `qa -> build:qa`
   - `dev -> build:dev`
   - fallback -> `build:dev`
5. Confirms workflow test secrets and protected-route authentication wiring remain intact.

## Latest execution

- Date (UTC): `2026-04-27T18:32:49Z`
- Result: `PASS`

Trigger matrix observed during smoke test:

- `main`: push `yes`, pull_request `yes`, amplify `build:prod`
- `develop`: push `yes`, pull_request `yes`, amplify `build:dev`
- `dev`: push `no`, pull_request `no`, amplify `build:dev`
- `qa`: push `no`, pull_request `no`, amplify `build:qa`
- `feature/smoke-*`: push `no`, pull_request `no`, amplify `build:dev`

## Notes

- The smoke test is intentionally local and non-destructive: temporary branches are created and removed in the same run.
- This validates branch-name compatibility and trigger logic without changing project conventions.
- Remote push mode validates real GitHub Actions behavior for temporary branches and then deletes them.
- In this execution environment, remote mode was not run because `curl`/`gh` are unavailable.
