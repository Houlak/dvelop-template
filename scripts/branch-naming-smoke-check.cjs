#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const {
  getAmplifyBuildCommand,
  isGithubE2EPushBranch,
  validateBranchName,
  verifyAmplifyConfig,
  verifyE2EWorkflowConfig,
} = require('./branch-naming-rules.cjs');

function parseArgs(argv) {
  const args = {
    runSmokeMatrix: false,
    skipCurrentBranch: false,
    branch: '',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--smoke') {
      args.runSmokeMatrix = true;
    } else if (item === '--skip-current-branch') {
      args.skipCurrentBranch = true;
    } else if (item === '--branch') {
      args.branch = argv[i + 1] || '';
      i += 1;
    }
  }

  return args;
}

function resolveBranchName(inputBranch) {
  if (inputBranch) return inputBranch;
  if (process.env.BRANCH_NAME) return process.env.BRANCH_NAME;
  if (process.env.GITHUB_HEAD_REF) return process.env.GITHUB_HEAD_REF;
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  if (process.env.AWS_BRANCH) return process.env.AWS_BRANCH;

  try {
    return execSync('git branch --show-current', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function runConfigChecks(repoRoot) {
  const amplifyPath = path.join(repoRoot, 'amplify.yml');
  const workflowPath = path.join(repoRoot, '.github', 'workflows', 'e2e-tests.yml');

  const amplifyContent = fs.readFileSync(amplifyPath, 'utf8');
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');

  const amplifyResult = verifyAmplifyConfig(amplifyContent);
  const workflowResult = verifyE2EWorkflowConfig(workflowContent);

  if (!amplifyResult.valid) {
    throw new Error(
      `Amplify branch build mapping check failed. Missing: ${amplifyResult.missing.join(', ')}`,
    );
  }

  if (!workflowResult.valid) {
    throw new Error(
      `GitHub Actions branch trigger check failed. Missing: ${workflowResult.missing.join(', ')}`,
    );
  }

  console.log('✓ Configuration checks passed for GitHub Actions and AWS Amplify.');
}

function assertSmokeCase(caseName, condition, message) {
  if (!condition) {
    throw new Error(`[${caseName}] ${message}`);
  }
}

function runSmokeMatrix() {
  const smokeCases = [
    { name: 'main', valid: true },
    { name: 'develop', valid: true },
    { name: 'qa', valid: true },
    { name: 'dev', valid: true },
    { name: 'feature/login-redirect', valid: true },
    { name: 'bugfix/auth-loop', valid: true },
    { name: 'hotfix/prod-login', valid: true },
    { name: 'chore/update-docs', valid: true },
    { name: 'release/2026-04-branch-flow', valid: true },
    { name: 'Feature/login-redirect', valid: false },
    { name: 'feature/Login-redirect', valid: false },
    { name: 'feature/login_redirect', valid: false },
    { name: 'feature/login/redirect', valid: false },
    { name: 'unknown/login-redirect', valid: false },
    { name: 'feature/', valid: false },
  ];

  for (const smokeCase of smokeCases) {
    const result = validateBranchName(smokeCase.name);
    assertSmokeCase(
      smokeCase.name,
      result.valid === smokeCase.valid,
      `expected valid=${smokeCase.valid}, got valid=${result.valid} (${result.reason})`,
    );

    if (result.valid) {
      const amplifyBuild = getAmplifyBuildCommand(smokeCase.name);
      if (smokeCase.name === 'main') {
        assertSmokeCase(smokeCase.name, amplifyBuild === 'yarn run build:prod', 'expected prod build');
      }
      if (smokeCase.name === 'qa') {
        assertSmokeCase(smokeCase.name, amplifyBuild === 'yarn run build:qa', 'expected qa build');
      }
      if (smokeCase.name === 'dev') {
        assertSmokeCase(smokeCase.name, amplifyBuild === 'yarn run build:dev', 'expected dev build');
      }

      const shouldTriggerE2E = isGithubE2EPushBranch(smokeCase.name);
      if (smokeCase.name === 'main' || smokeCase.name === 'develop') {
        assertSmokeCase(smokeCase.name, shouldTriggerE2E, 'expected GitHub E2E push trigger');
      }
    }
  }

  console.log(`✓ Smoke matrix passed (${smokeCases.length} branch name scenarios).`);
}

function runCurrentBranchCheck(rawBranchName) {
  const branchName = resolveBranchName(rawBranchName);

  if (!branchName) {
    throw new Error(
      'Unable to resolve current branch name. Set BRANCH_NAME or pass --branch <branch-name>.',
    );
  }

  const result = validateBranchName(branchName);
  if (!result.valid) {
    throw new Error(`Branch "${branchName}" is invalid. ${result.reason}`);
  }

  const amplifyBuildCommand = getAmplifyBuildCommand(branchName);
  const triggersE2EPush = isGithubE2EPushBranch(branchName);

  console.log(`✓ Branch "${branchName}" matches naming convention.`);
  console.log(`  - Amplify build command: ${amplifyBuildCommand}`);
  console.log(`  - GitHub E2E push workflow trigger: ${triggersE2EPush ? 'yes' : 'no'}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..');

  if (!args.skipCurrentBranch) {
    runCurrentBranchCheck(args.branch);
  }
  runConfigChecks(repoRoot);

  if (args.runSmokeMatrix) {
    runSmokeMatrix();
  }
}

try {
  main();
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
}
