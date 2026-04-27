const test = require('node:test');
const assert = require('node:assert/strict');
const { validateBranchName } = require('./branch-naming-rules.cjs');

test('accepts reserved long-lived branches', () => {
  assert.equal(validateBranchName('main').valid, true);
  assert.equal(validateBranchName('develop').valid, true);
  assert.equal(validateBranchName('dev').valid, true);
  assert.equal(validateBranchName('qa').valid, true);
});

test('accepts feature-based branch patterns', () => {
  assert.equal(validateBranchName('feature/auth/login-form').valid, true);
  assert.equal(validateBranchName('bugfix/users/reset-password').valid, true);
  assert.equal(validateBranchName('chore/shared/update-deps').valid, true);
});

test('accepts release semver branches', () => {
  assert.equal(validateBranchName('release/1.2.3').valid, true);
  assert.equal(validateBranchName('release/v2.0.0-rc1').valid, true);
});

test('rejects invalid branch names', () => {
  assert.equal(validateBranchName('Feature/Auth/Login').valid, false);
  assert.equal(validateBranchName('feature/auth').valid, false);
  assert.equal(validateBranchName('feature/auth/login_form').valid, false);
  assert.equal(validateBranchName('main/hotfix').valid, false);
});
