#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKFLOW_FILE="$ROOT_DIR/.github/workflows/e2e-tests.yml"
AMPLIFY_FILE="$ROOT_DIR/amplify.yml"
ROUTES_FILE="$ROOT_DIR/src/app/router/routes.tsx"
AUTH_LOADER_FILE="$ROOT_DIR/src/app/router/auth.loader.ts"
REMOTE_NAME="${REMOTE_NAME:-origin}"
RUN_REMOTE_PUSH="${RUN_REMOTE_PUSH:-0}"
REMOTE_WAIT_SECONDS="${REMOTE_WAIT_SECONDS:-8}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2
  exit 1
fi

if [[ ! -f "$WORKFLOW_FILE" || ! -f "$AMPLIFY_FILE" ]]; then
  echo "Required CI/CD files are missing" >&2
  exit 1
fi

extract_branches() {
  local event="$1"
  local file="$2"

  awk -v event="$event" '
    function print_inline_list(line,   list, n, i) {
      gsub(/.*\[/, "", line)
      gsub(/\].*/, "", line)
      gsub(/,/, " ", line)
      n = split(line, list, /[[:space:]]+/)
      for (i = 1; i <= n; i++) {
        if (list[i] != "") print list[i]
      }
    }

    /^[[:space:]]*[A-Za-z_]+:/ {
      if ($1 == event ":") {
        in_event = 1
        in_branches = 0
        next
      }

      if (in_event && $1 != "branches:") {
        in_event = 0
        in_branches = 0
      }
    }

    in_event && /^[[:space:]]*branches:/ {
      if ($0 ~ /\[/) {
        print_inline_list($0)
        in_branches = 0
      } else {
        in_branches = 1
      }
      next
    }

    in_event && in_branches {
      if ($0 ~ /^[[:space:]]*-[[:space:]]+/) {
        line = $0
        gsub(/^[[:space:]]*-[[:space:]]+/, "", line)
        gsub(/[[:space:]]+$/, "", line)
        if (line != "") print line
      } else {
        in_branches = 0
      }
    }
  ' "$file"
}

contains_branch() {
  local target="$1"
  shift

  local branch
  for branch in "$@"; do
    if [[ "$branch" == "$target" ]]; then
      return 0
    fi
  done
  return 1
}

amplify_build_for_branch() {
  local branch="$1"

  if [[ "$branch" == "main" ]]; then
    echo "build:prod"
  elif [[ "$branch" == "qa" ]]; then
    echo "build:qa"
  elif [[ "$branch" == "dev" ]]; then
    echo "build:dev"
  else
    echo "build:dev"
  fi
}

mapfile -t push_branches < <(extract_branches push "$WORKFLOW_FILE")
mapfile -t pr_branches < <(extract_branches pull_request "$WORKFLOW_FILE")

if [[ "${#push_branches[@]}" -eq 0 || "${#pr_branches[@]}" -eq 0 ]]; then
  echo "Unable to resolve workflow branch filters from $WORKFLOW_FILE" >&2
  exit 1
fi

stamp="$(date -u +%Y%m%d%H%M%S)"

valid_branches=(
  "feature/smoke-branch-${stamp}"
  "bugfix/smoke_branch-${stamp}"
  "hotfix/smoke.branch.${stamp}"
  "chore/smoke-branch-validation-${stamp}"
  "release/2026.04.27-${stamp}"
  "feature/${stamp}/nested"
  "feature/${stamp}-$(printf 'x%.0s' {1..40})"
)

invalid_branches=(
  "feature/smoke branch ${stamp}"
  "feature//double-slash-${stamp}"
  "feature/.leading-dot-${stamp}"
  "feature/trailing-dot-${stamp}."
  "feature/trailing-lock-${stamp}.lock"
  "feature:colon-${stamp}"
  "feature/question-${stamp}?"
)

printf "== Branch Naming Smoke Test ==\n"
printf "Timestamp (UTC): %s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf "Repository: %s\n\n" "$ROOT_DIR"

printf "[1/5] Workflow Branch Filters\n"
printf '%s\n' "- push branches: ${push_branches[*]}"
printf '%s\n\n' "- pull_request branches: ${pr_branches[*]}"

printf "[2/5] Valid Branch Name Creation/Deletion Smoke Test\n"
for branch in "${valid_branches[@]}"; do
  git check-ref-format --branch "$branch" >/dev/null

  git branch "$branch" >/dev/null
  git branch -D "$branch" >/dev/null

  if contains_branch "$branch" "${push_branches[@]}" || contains_branch "$branch" "${pr_branches[@]}"; then
    gha_status="TRIGGERS"
  else
    gha_status="SKIPPED"
  fi

  printf '%s\n' "- $branch => valid, create/delete: ok, GitHub Actions: $gha_status, Amplify command: $(amplify_build_for_branch "$branch")"
done
printf "\n"

printf "[3/5] Invalid Branch Name Rejection Smoke Test\n"
for branch in "${invalid_branches[@]}"; do
  if git check-ref-format --branch "$branch" >/dev/null 2>&1; then
    printf '%s\n' "- $branch => UNEXPECTEDLY VALID"
    exit 1
  fi
  printf '%s\n' "- $branch => rejected (expected)"
done
printf "\n"

printf "[4/5] CI/CD Invariants\n"
if grep -Fq 'branches: [ main, develop ]' "$WORKFLOW_FILE"; then
  printf '%s\n' "- e2e workflow branch filters unchanged: ok"
else
  printf '%s\n' "- e2e workflow branch filters unchanged: FAILED"
  exit 1
fi

if grep -Fq 'if [ "${AWS_BRANCH}" = "main" ]; then yarn run build:prod;' "$AMPLIFY_FILE" \
  && grep -Fq 'elif [ "${AWS_BRANCH}" = "qa" ]; then yarn run build:qa;' "$AMPLIFY_FILE" \
  && grep -Fq 'elif [ "${AWS_BRANCH}" = "dev" ]; then yarn run build:dev;' "$AMPLIFY_FILE" \
  && grep -Fq 'else yarn run build:dev; fi;' "$AMPLIFY_FILE"; then
  printf '%s\n' "- amplify branch-to-build mapping unchanged: ok"
else
  printf '%s\n' "- amplify branch-to-build mapping unchanged: FAILED"
  exit 1
fi

if grep -Fq 'VITE_TEST_EMAIL: ${{ secrets.VITE_TEST_EMAIL }}' "$WORKFLOW_FILE" \
  && grep -Fq 'VITE_TEST_PASSWORD: ${{ secrets.VITE_TEST_PASSWORD }}' "$WORKFLOW_FILE"; then
  printf '%s\n' "- test env vars in workflow unchanged: ok"
else
  printf '%s\n' "- test env vars in workflow unchanged: FAILED"
  exit 1
fi

if grep -Fq 'loader: requireAuthLoader' "$ROUTES_FILE" \
  && grep -Fq 'return redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`);' "$AUTH_LOADER_FILE"; then
  printf '%s\n' "- protected routing/auth loader still intact: ok"
else
  printf '%s\n' "- protected routing/auth loader still intact: FAILED"
  exit 1
fi
printf "\n"

printf "[5/5] Deterministic Trigger Matrix\n"
for branch in main develop dev qa "feature/smoke-${stamp}"; do
  if contains_branch "$branch" "${push_branches[@]}"; then
    push_trigger="yes"
  else
    push_trigger="no"
  fi

  if contains_branch "$branch" "${pr_branches[@]}"; then
    pr_trigger="yes"
  else
    pr_trigger="no"
  fi

  printf '%s\n' "- $branch => push:$push_trigger, pull_request:$pr_trigger, amplify:$(amplify_build_for_branch "$branch")"
done

printf "\nSmoke test completed successfully.\n"

if [[ "$RUN_REMOTE_PUSH" == "1" ]]; then
  if ! command -v curl >/dev/null 2>&1 && ! command -v gh >/dev/null 2>&1; then
    echo "RUN_REMOTE_PUSH=1 requires either curl or GitHub CLI (gh) to inspect workflow runs." >&2
    exit 1
  fi

  remote_url="$(git remote get-url "$REMOTE_NAME" 2>/dev/null || true)"
  if [[ -z "$remote_url" ]]; then
    echo "RUN_REMOTE_PUSH=1 was requested, but remote '$REMOTE_NAME' was not found." >&2
    exit 1
  fi

  if [[ "$remote_url" =~ ^https://x-access-token:([^@]+)@github.com/([^/]+/[^/.]+)(.git)?$ ]]; then
    github_token="${BASH_REMATCH[1]}"
    github_repo="${BASH_REMATCH[2]}"
    token_source="remote-token"
  elif [[ "$remote_url" =~ ^https://github.com/([^/]+/[^/.]+)(.git)?$ ]] && command -v gh >/dev/null 2>&1; then
    github_token=""
    github_repo="${BASH_REMATCH[1]}"
    token_source="gh-auth"
  else
    echo "RUN_REMOTE_PUSH=1 could not resolve a GitHub repo/auth combination from remote '$REMOTE_NAME'." >&2
    exit 1
  fi

  printf "\n[6/6] Optional Remote Push Smoke Test (GitHub Actions)\n"
  printf '%s\n' "- remote: $REMOTE_NAME"
  printf '%s\n' "- repo: $github_repo"
  printf '%s\n' "- wait after push: ${REMOTE_WAIT_SECONDS}s"
  printf '%s\n' "- api auth source: ${token_source}"

  remote_branches=(
    "feature/remote-smoke-${stamp}"
    "bugfix/remote-smoke-${stamp}"
    "hotfix/remote-smoke-${stamp}"
  )

  for branch in "${remote_branches[@]}"; do
    git push "$REMOTE_NAME" "HEAD:refs/heads/$branch" >/dev/null
    sleep "$REMOTE_WAIT_SECONDS"

    if [[ -n "$github_token" ]] && command -v curl >/dev/null 2>&1; then
      response="$(
        curl -fsSL \
          -H "Authorization: Bearer $github_token" \
          -H "Accept: application/vnd.github+json" \
          "https://api.github.com/repos/$github_repo/actions/workflows/e2e-tests.yml/runs?branch=$branch&event=push&per_page=1"
      )"
    elif command -v gh >/dev/null 2>&1; then
      response="$(
        gh api \
          "/repos/$github_repo/actions/workflows/e2e-tests.yml/runs" \
          --field branch="$branch" \
          --field event=push \
          --field per_page=1
      )"
    else
      echo "No compatible GitHub API client found for remote checks." >&2
      git push "$REMOTE_NAME" --delete "$branch" >/dev/null || true
      exit 1
    fi

    total_count="$(printf '%s' "$response" | sed -n 's/.*"total_count":[[:space:]]*\\([0-9][0-9]*\\).*/\\1/p' | head -n 1)"
    total_count="${total_count:-0}"

    if [[ "$total_count" == "0" ]]; then
      printf '%s\n' "- $branch => pushed, no workflow run (expected for non-main/non-develop)"
    else
      printf '%s\n' "- $branch => pushed, workflow run count: $total_count"
    fi

    git push "$REMOTE_NAME" --delete "$branch" >/dev/null
  done

  printf "\nRemote push smoke test completed successfully.\n"
fi
