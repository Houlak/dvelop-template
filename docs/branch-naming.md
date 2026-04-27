# Branch Naming Conventions

## Goal

Ensure branch names are predictable, feature-oriented, and compatible with existing GitHub Actions and Amplify workflows.

## Allowed Branch Types

### Long-lived environment branches

- `main`
- `develop`
- `dev`
- `qa`

### Release branches

- `release/v<major>.<minor>.<patch>`
- Example: `release/v1.4.0`

### Work branches (feature-based)

- `<type>/<feature>/<change>`
- `<type>` must be one of: `feature`, `bugfix`, `hotfix`, `chore`, `docs`, `refactor`, `test`
- `<feature>` and `<change>` must use lowercase kebab-case segments
- Additional nested change segments are allowed

Examples:

- `feature/auth/login-form`
- `bugfix/example/fix-loader-timeout`
- `refactor/shared/api-client-cleanup`
- `docs/architecture/update-structure-guide`

## Smoke Test

Run an informational smoke check:

```bash
yarn test:smoke:branch-naming
```

Run strict mode (non-zero exit code when violations exist):

```bash
yarn test:smoke:branch-naming:strict
```

Run rule unit tests:

```bash
yarn test:unit:branch-naming
```

## Current Audit

Last audited: `2026-04-27`

Audit scope:

- Local and remote branches resolved from `refs/heads/*` and `refs/remotes/*`
- Validation performed with `scripts/branch-name-smoke-check.mjs`

Findings:

- `main`: compliant (`long-lived`)
- `origin/main`: compliant (`long-lived`)
- `agent/prompt-smoke-branch-naming-1777326728-cc410221`: non-compliant (does not match allowed branch patterns)

## Recommendations

- Keep current long-lived branches unchanged to avoid workflow disruption.
- For new task branches, adopt `<type>/<feature>/<change>` consistently.
- If automation branches with `agent/*` are expected, rename generated automation branches to an approved `<type>/...` pattern or explicitly document `agent/<feature>/<change>` as an allowed exception and update the validator.
