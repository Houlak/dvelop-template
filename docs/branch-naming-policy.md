# Branch Naming Policy and Smoke Test

## Why this exists
This repository did not previously define a branch naming standard, while CI/CD already depends on specific branch names (`main`, `develop`, `dev`, `qa`). This document defines lightweight naming rules and a smoke test process to keep branch naming predictable.

## Branch naming convention

### Reserved long-lived branches
- `main`
- `develop`
- `dev`
- `qa`

### Work branches
Use:

```text
<type>/<feature-area>/<short-description>
```

Allowed `type` values:
- `feature`
- `bugfix`
- `hotfix`
- `chore`
- `refactor`
- `docs`
- `test`

Examples:
- `feature/auth/login-form`
- `bugfix/example/query-cache-race`
- `chore/shared/update-dependencies`

### Release branches
Use:

```text
release/<semver>
```

Examples:
- `release/1.4.0`
- `release/v2.0.0-rc1`

### Character rules
- lowercase letters, numbers, `.`, `-`, `/`
- no spaces
- no uppercase
- no empty path segments (for example `feature//login`)

## Smoke test

### Scripts
- `yarn test:branch-naming:smoke`: reports violations and exits `0`
- `yarn test:branch-naming:smoke:strict`: reports violations and exits `1` when any branch violates policy
- `yarn test:branch-naming:unit`: runs unit checks for naming rule logic

### What gets checked
- Local branches (`refs/heads/*`)
- Remote-tracking branches (`refs/remotes/*`, excluding symbolic `HEAD` refs)

## Findings (April 27, 2026)

### Smoke test result
- Checked branch names: 2
- Violations: 1
- Violating branch: `agent/openai-mohqn89a` (does not match the defined work-branch pattern)

### Repository inconsistency found
- `.github/workflows/e2e-tests.yml` targets `main` and `develop`
- `amplify.yml` and `.github/workflows/build-react-frontend-template.yml.example` use `dev`, `qa`, and `main`

This means trunk naming is currently mixed between `develop` and `dev`.

## Recommendations
1. Standardize on a single non-production trunk branch name (`develop` or `dev`) across GitHub Actions and Amplify.
2. Keep `test:branch-naming:smoke` as a local pre-push check.
3. Optionally add `test:branch-naming:smoke:strict` as a non-blocking CI informational step first, then make it required after branch cleanup.
