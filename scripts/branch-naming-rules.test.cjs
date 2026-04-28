const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  getAmplifyBuildCommand,
  isGithubE2EPushBranch,
  validateBranchName,
  verifyAmplifyConfig,
  verifyE2EWorkflowConfig,
} = require('./branch-naming-rules.cjs');

test('validateBranchName accepts long-lived and short-lived conventions', () => {
  assert.equal(validateBranchName('main').valid, true);
  assert.equal(validateBranchName('develop').valid, true);
  assert.equal(validateBranchName('qa').valid, true);
  assert.equal(validateBranchName('dev').valid, true);
  assert.equal(validateBranchName('feature/login-redirect').valid, true);
  assert.equal(validateBranchName('bugfix/auth-loop').valid, true);
  assert.equal(validateBranchName('chore/update-docs').valid, true);
});

test('validateBranchName rejects malformed names', () => {
  assert.equal(validateBranchName('').valid, false);
  assert.equal(validateBranchName('feature/Login').valid, false);
  assert.equal(validateBranchName('Feature/login').valid, false);
  assert.equal(validateBranchName('feature/login_redirect').valid, false);
  assert.equal(validateBranchName('feature/login/extra').valid, false);
  assert.equal(validateBranchName('random/login').valid, false);
});

test('amplify build command mapping matches environment branches', () => {
  assert.equal(getAmplifyBuildCommand('main'), 'yarn run build:prod');
  assert.equal(getAmplifyBuildCommand('qa'), 'yarn run build:qa');
  assert.equal(getAmplifyBuildCommand('dev'), 'yarn run build:dev');
  assert.equal(getAmplifyBuildCommand('feature/some-branch'), 'yarn run build:dev');
});

test('github e2e trigger mapping matches workflow targets', () => {
  assert.equal(isGithubE2EPushBranch('main'), true);
  assert.equal(isGithubE2EPushBranch('develop'), true);
  assert.equal(isGithubE2EPushBranch('dev'), false);
  assert.equal(isGithubE2EPushBranch('feature/test-branch'), false);
});

test('repository workflow and amplify configs keep required branch mappings', () => {
  const repoRoot = path.resolve(__dirname, '..');
  const workflowContent = fs.readFileSync(
    path.join(repoRoot, '.github', 'workflows', 'e2e-tests.yml'),
    'utf8',
  );
  const amplifyContent = fs.readFileSync(path.join(repoRoot, 'amplify.yml'), 'utf8');

  const workflowResult = verifyE2EWorkflowConfig(workflowContent);
  const amplifyResult = verifyAmplifyConfig(amplifyContent);

  assert.equal(
    workflowResult.valid,
    true,
    `Expected e2e workflow branch mapping to be valid, missing: ${workflowResult.missing.join(', ')}`,
  );
  assert.equal(
    amplifyResult.valid,
    true,
    `Expected amplify branch mapping to be valid, missing: ${amplifyResult.missing.join(', ')}`,
  );
});
