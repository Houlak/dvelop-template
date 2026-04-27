const RESERVED_BRANCHES = new Set(['main', 'develop', 'dev', 'qa']);

const FEATURE_BRANCH_PATTERN =
  /^(feature|bugfix|hotfix|chore|refactor|docs|test)\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

const RELEASE_BRANCH_PATTERN = /^release\/v?\d+\.\d+\.\d+(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

function validateBranchName(branchName) {
  if (!branchName || typeof branchName !== 'string') {
    return {
      valid: false,
      rule: 'non-empty-string',
      reason: 'Branch name must be a non-empty string.',
    };
  }

  if (RESERVED_BRANCHES.has(branchName)) {
    return {
      valid: true,
      rule: 'reserved-branches',
      reason: 'Matches a reserved long-lived branch.',
    };
  }

  if (!/^[a-z0-9./-]+$/.test(branchName)) {
    return {
      valid: false,
      rule: 'allowed-characters',
      reason: 'Use lowercase letters, numbers, dots, hyphens, and slashes only.',
    };
  }

  if (branchName.includes('//') || branchName.startsWith('/') || branchName.endsWith('/')) {
    return {
      valid: false,
      rule: 'slash-shape',
      reason: 'Do not start/end with "/" and avoid empty path segments.',
    };
  }

  if (FEATURE_BRANCH_PATTERN.test(branchName)) {
    return {
      valid: true,
      rule: 'work-branch-pattern',
      reason: 'Matches <type>/<feature-area>/<short-description>.',
    };
  }

  if (RELEASE_BRANCH_PATTERN.test(branchName)) {
    return {
      valid: true,
      rule: 'release-branch-pattern',
      reason: 'Matches release/<semver>.',
    };
  }

  return {
    valid: false,
    rule: 'naming-pattern',
    reason:
      'Expected main|develop|dev|qa or <type>/<feature-area>/<short-description> where type is feature|bugfix|hotfix|chore|refactor|docs|test, or release/<semver>.',
  };
}

module.exports = {
  RESERVED_BRANCHES,
  FEATURE_BRANCH_PATTERN,
  RELEASE_BRANCH_PATTERN,
  validateBranchName,
};
