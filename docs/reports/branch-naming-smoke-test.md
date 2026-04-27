# Branch Naming Smoke Test Report

- Date: 2026-04-27T18:43:11.539Z
- Scope: CI/CD branch naming safety for GitHub Actions + AWS Amplify

## Summary
- Result: **PASSED**
- Evaluated branches: 12
- GitHub Actions trigger branches: `main`, `develop`
- Amplify explicit branch mappings: `main`, `qa`, `dev`
- Amplify fallback build: `yarn run build:dev`

## Candidate Matrix
| Branch | Git Name Valid | Push Trigger | PR Trigger | Amplify Build | Expected Behavior |
| --- | --- | --- | --- | --- | --- |
| `main` | PASS | PASS | PASS | `yarn run build:prod` | PASS |
| `develop` | PASS | PASS | PASS | `yarn run build:dev` | PASS |
| `dev` | PASS | FAIL | FAIL | `yarn run build:dev` | PASS |
| `qa` | PASS | FAIL | FAIL | `yarn run build:qa` | PASS |
| `feature/auth-login` | PASS | FAIL | FAIL | `yarn run build:dev` | PASS |
| `bugfix/fix-auth-loader` | PASS | FAIL | FAIL | `yarn run build:dev` | PASS |
| `hotfix/security-patch-2026-04-27` | PASS | FAIL | FAIL | `yarn run build:dev` | PASS |
| `feature/very-long-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | PASS | FAIL | FAIL | `yarn run build:dev` | PASS |
| `feature/space in name` | FAIL | FAIL | FAIL | `yarn run build:dev` | PASS |
| `feature/branch~name` | FAIL | FAIL | FAIL | `yarn run build:dev` | PASS |
| `feature/branch:name` | FAIL | FAIL | FAIL | `yarn run build:dev` | PASS |
| `feature/trailing-slash/` | FAIL | FAIL | FAIL | `yarn run build:dev` | PASS |

## Safety Checks
- Protected routing wiring intact: PASS
- Auth loader branch-independent: PASS
- E2E secret wiring intact (`VITE_TEST_EMAIL`, `VITE_TEST_PASSWORD`): PASS
- `AWS_BRANCH` quoted in Amplify shell condition: PASS

## Warnings
- E2E workflow uses `develop` while Amplify does not have an explicit `develop` mapping (falls back to default build).
- Amplify has explicit `dev` mapping, but E2E workflow does not trigger on `dev`.
- Workflow naming differs between `dev` and `develop` across CI examples and active workflows.

## Failures
- None
