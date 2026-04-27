import assert from 'node:assert/strict';
import test from 'node:test';
import { validateBranchName } from './branchNamingRules.mjs';

test('accepts long-lived branches', () => {
  for (const branch of ['main', 'develop', 'dev', 'qa']) {
    const result = validateBranchName(branch);
    assert.equal(result.isValid, true);
    assert.equal(result.category, 'long-lived');
  }
});

test('accepts release branches', () => {
  const result = validateBranchName('release/v2.4.1');
  assert.equal(result.isValid, true);
  assert.equal(result.category, 'release');
});

test('accepts feature-based work branches', () => {
  const branches = [
    'feature/auth/login-screen',
    'bugfix/users/profile-fetch-timeout',
    'docs/shared/update-readme-links',
    'test/example/add-smoke-check',
  ];

  for (const branch of branches) {
    const result = validateBranchName(branch);
    assert.equal(result.isValid, true, `${branch} should be valid`);
    assert.equal(result.category, 'work');
  }
});

test('rejects branches outside allowed patterns', () => {
  const branches = ['Feature/Auth/Login', 'feature/auth', 'agent/prompt-task', 'feature/auth/login fix'];

  for (const branch of branches) {
    const result = validateBranchName(branch);
    assert.equal(result.isValid, false, `${branch} should be invalid`);
    assert.equal(result.category, 'invalid');
    assert.ok(result.reason);
  }
});
