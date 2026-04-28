const GITHUB_E2E_BRANCHES = new Set(['main', 'develop']);
const LONG_LIVED_BRANCHES = new Set(['main', 'develop', 'dev', 'qa']);
const SHORT_LIVED_PREFIXES = new Set(['feature', 'bugfix', 'hotfix', 'chore', 'release']);
const SHORT_LIVED_SUFFIX_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const AMPLIFY_BUILD_COMMAND_BY_BRANCH = Object.freeze({
  main: 'yarn run build:prod',
  qa: 'yarn run build:qa',
  dev: 'yarn run build:dev',
});

function normalizeBranchName(rawBranchName) {
  return String(rawBranchName || '').trim().replace(/^refs\/heads\//, '');
}

function validateBranchName(rawBranchName) {
  const branchName = normalizeBranchName(rawBranchName);

  if (!branchName) {
    return {
      valid: false,
      branchName,
      reason: 'Branch name is empty.',
    };
  }

  if (LONG_LIVED_BRANCHES.has(branchName)) {
    return {
      valid: true,
      branchName,
      reason: 'Long-lived branch.',
    };
  }

  const segments = branchName.split('/');
  if (segments.length !== 2) {
    return {
      valid: false,
      branchName,
      reason:
        'Short-lived branches must use "<type>/<kebab-case-description>" with exactly one slash.',
    };
  }

  const [prefix, suffix] = segments;
  if (!SHORT_LIVED_PREFIXES.has(prefix)) {
    return {
      valid: false,
      branchName,
      reason: `Unsupported branch prefix "${prefix}". Allowed prefixes: ${Array.from(
        SHORT_LIVED_PREFIXES,
      ).join(', ')}.`,
    };
  }

  if (!SHORT_LIVED_SUFFIX_REGEX.test(suffix)) {
    return {
      valid: false,
      branchName,
      reason: 'Branch suffix must be lowercase kebab-case (letters, numbers, hyphens).',
    };
  }

  return {
    valid: true,
    branchName,
    reason: 'Short-lived branch name format is valid.',
  };
}

function isGithubE2EPushBranch(rawBranchName) {
  const branchName = normalizeBranchName(rawBranchName);
  return GITHUB_E2E_BRANCHES.has(branchName);
}

function getAmplifyBuildCommand(rawBranchName) {
  const branchName = normalizeBranchName(rawBranchName);
  return AMPLIFY_BUILD_COMMAND_BY_BRANCH[branchName] || 'yarn run build:dev';
}

function verifyE2EWorkflowConfig(workflowContent) {
  const content = String(workflowContent || '');

  const pushMain =
    /push:[\s\S]*?branches:\s*\[[^\]]*\bmain\b[^\]]*\]/m.test(content) ||
    /push:[\s\S]*?branches:\s*(?:\r?\n\s*-\s*[a-z0-9/_-]+)*\r?\n\s*-\s*main\b/m.test(content);
  const pushDevelop =
    /push:[\s\S]*?branches:\s*\[[^\]]*\bdevelop\b[^\]]*\]/m.test(content) ||
    /push:[\s\S]*?branches:\s*(?:\r?\n\s*-\s*[a-z0-9/_-]+)*\r?\n\s*-\s*develop\b/m.test(content);
  const prMain =
    /pull_request:[\s\S]*?branches:\s*\[[^\]]*\bmain\b[^\]]*\]/m.test(content) ||
    /pull_request:[\s\S]*?branches:\s*(?:\r?\n\s*-\s*[a-z0-9/_-]+)*\r?\n\s*-\s*main\b/m.test(
      content,
    );
  const prDevelop =
    /pull_request:[\s\S]*?branches:\s*\[[^\]]*\bdevelop\b[^\]]*\]/m.test(content) ||
    /pull_request:[\s\S]*?branches:\s*(?:\r?\n\s*-\s*[a-z0-9/_-]+)*\r?\n\s*-\s*develop\b/m.test(
      content,
    );

  const missing = [];

  if (!pushMain) missing.push('push -> main');
  if (!pushDevelop) missing.push('push -> develop');
  if (!prMain) missing.push('pull_request -> main');
  if (!prDevelop) missing.push('pull_request -> develop');

  return {
    valid: missing.length === 0,
    missing,
  };
}

function verifyAmplifyConfig(amplifyContent) {
  const content = String(amplifyContent || '');
  const requiredMappings = [
    { branch: 'main', command: 'yarn run build:prod' },
    { branch: 'qa', command: 'yarn run build:qa' },
    { branch: 'dev', command: 'yarn run build:dev' },
  ];

  const missing = [];

  for (const mapping of requiredMappings) {
    const hasBranchCondition = new RegExp(`AWS_BRANCH\\}"\\s*=\\s*"${mapping.branch}"`).test(content);
    const hasBuildCommand = content.includes(mapping.command);

    if (!hasBranchCondition || !hasBuildCommand) {
      missing.push(`${mapping.branch} -> ${mapping.command}`);
    }
  }

  const hasFallback = /else\s+yarn run build:dev;\s*fi;?/m.test(content);
  if (!hasFallback) {
    missing.push('fallback -> yarn run build:dev');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

module.exports = {
  AMPLIFY_BUILD_COMMAND_BY_BRANCH,
  GITHUB_E2E_BRANCHES,
  LONG_LIVED_BRANCHES,
  SHORT_LIVED_PREFIXES,
  getAmplifyBuildCommand,
  isGithubE2EPushBranch,
  normalizeBranchName,
  validateBranchName,
  verifyAmplifyConfig,
  verifyE2EWorkflowConfig,
};
