export const LONG_LIVED_BRANCHES = new Set(['main', 'develop', 'dev', 'qa']);

export const WORK_BRANCH_PREFIXES = new Set([
  'feature',
  'bugfix',
  'hotfix',
  'chore',
  'docs',
  'refactor',
  'test',
]);

const SEGMENT = '[a-z0-9]+(?:-[a-z0-9]+)*';

export const RELEASE_BRANCH_REGEX = /^release\/v\d+\.\d+\.\d+$/;

export const WORK_BRANCH_REGEX = new RegExp(
  `^(?:${Array.from(WORK_BRANCH_PREFIXES).join('|')})\\/${SEGMENT}\\/${SEGMENT}(?:\\/${SEGMENT})*$`
);

export function getNamingGuidance() {
  return [
    'Allowed long-lived branches: main, develop, dev, qa',
    'Release branches: release/v<major>.<minor>.<patch>',
    'Work branches: <type>/<feature>/<change> using lowercase kebab-case',
    `Allowed <type> values: ${Array.from(WORK_BRANCH_PREFIXES).join(', ')}`,
  ];
}

export function validateBranchName(branchName) {
  if (!branchName || typeof branchName !== 'string') {
    return {
      isValid: false,
      category: 'invalid',
      reason: 'Branch name is empty.',
      recommendation: 'Use a non-empty branch name that follows project conventions.',
    };
  }

  if (LONG_LIVED_BRANCHES.has(branchName)) {
    return { isValid: true, category: 'long-lived' };
  }

  if (RELEASE_BRANCH_REGEX.test(branchName)) {
    return { isValid: true, category: 'release' };
  }

  if (WORK_BRANCH_REGEX.test(branchName)) {
    return { isValid: true, category: 'work' };
  }

  if (/\s/.test(branchName)) {
    return {
      isValid: false,
      category: 'invalid',
      reason: 'Branch name contains whitespace.',
      recommendation: 'Use lowercase kebab-case path segments separated by "/".',
    };
  }

  if (/[A-Z]/.test(branchName)) {
    return {
      isValid: false,
      category: 'invalid',
      reason: 'Branch name contains uppercase letters.',
      recommendation: 'Use lowercase only: <type>/<feature>/<change>.',
    };
  }

  return {
    isValid: false,
    category: 'invalid',
    reason:
      'Branch name does not match any allowed pattern (long-lived, release, or feature-based work branch).',
    recommendation: `Use main/develop/dev/qa, release/vX.Y.Z, or ${Array.from(
      WORK_BRANCH_PREFIXES
    ).join('|')}/<feature>/<change>.`,
  };
}
