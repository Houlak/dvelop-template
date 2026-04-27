import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseWorkflowBranchTriggers,
  parseAmplifyAwsBranchBuildRules,
  resolveAmplifyBuildCommand,
  evaluateBranchCandidates,
  buildConsistencyWarnings,
  evaluateProtectedRoutingIndependence,
  evaluateE2ESecretWiring,
} from './branch-naming-smoke-test.mjs';

test('parseWorkflowBranchTriggers parses inline and block branch arrays', () => {
  const inlineWorkflow = `
name: Test
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
`;

  const blockWorkflow = `
name: Test
on:
  pull_request:
    branches:
      - dev
      - qa
      - main
`;

  const inlineResult = parseWorkflowBranchTriggers(inlineWorkflow);
  assert.deepEqual(inlineResult.push, ['main', 'develop']);
  assert.deepEqual(inlineResult.pull_request, ['main', 'develop']);

  const blockResult = parseWorkflowBranchTriggers(blockWorkflow);
  assert.deepEqual(blockResult.push, []);
  assert.deepEqual(blockResult.pull_request, ['dev', 'qa', 'main']);
});

test('parseAmplifyAwsBranchBuildRules extracts explicit and fallback commands', () => {
  const amplifyConfig = `
build:
  commands:
    - if [ "\${AWS_BRANCH}" = "main" ]; then yarn run build:prod;
      elif [ "\${AWS_BRANCH}" = "qa" ]; then yarn run build:qa;
      elif [ "\${AWS_BRANCH}" = "dev" ]; then yarn run build:dev;
      else yarn run build:dev; fi;
`;

  const rules = parseAmplifyAwsBranchBuildRules(amplifyConfig);

  assert.deepEqual(rules.rules, {
    main: 'yarn run build:prod',
    qa: 'yarn run build:qa',
    dev: 'yarn run build:dev',
  });
  assert.equal(rules.fallbackCommand, 'yarn run build:dev');
  assert.equal(rules.awsBranchQuoted, true);
  assert.equal(resolveAmplifyBuildCommand('feature/test', rules), 'yarn run build:dev');
});

test('evaluateBranchCandidates compares candidate expectations against runtime decisions', () => {
  const candidates = [
    {
      name: 'main',
      expectedGitValid: true,
      expectedWorkflowTrigger: true,
      expectedAmplifyCommand: 'yarn run build:prod',
    },
    {
      name: 'feature/test',
      expectedGitValid: true,
      expectedWorkflowTrigger: false,
      expectedAmplifyCommand: 'yarn run build:dev',
    },
    {
      name: 'invalid branch',
      expectedGitValid: false,
      expectedWorkflowTrigger: false,
      expectedAmplifyCommand: 'yarn run build:dev',
    },
  ];

  const workflow = { push: ['main', 'develop'], pull_request: ['main', 'develop'] };
  const amplifyRules = {
    rules: { main: 'yarn run build:prod', qa: 'yarn run build:qa', dev: 'yarn run build:dev' },
    fallbackCommand: 'yarn run build:dev',
  };

  const gitBranchValidator = (name) => !name.includes(' ');

  const evaluation = evaluateBranchCandidates(candidates, workflow, amplifyRules, gitBranchValidator);
  const failedRows = evaluation.filter(
    (row) => !(row.matchesExpectedGitValidity && row.matchesExpectedWorkflowTrigger && row.matchesExpectedAmplifyCommand),
  );

  assert.equal(failedRows.length, 0);
});

test('buildConsistencyWarnings detects dev/develop drift between workflows', () => {
  const warnings = buildConsistencyWarnings({
    workflowTriggers: { push: ['main', 'develop'], pull_request: ['main', 'develop'] },
    amplifyRules: {
      rules: {
        main: 'yarn run build:prod',
        dev: 'yarn run build:dev',
      },
      fallbackCommand: 'yarn run build:dev',
    },
    exampleWorkflowTriggers: { push: [], pull_request: ['dev', 'qa', 'main'] },
  });

  assert.equal(warnings.length, 3);
});

test('evaluateProtectedRoutingIndependence validates auth loader wiring and branch independence', () => {
  const routes = `
children: [
  {
    element: <ProtectedLayout />,
    loader: requireAuthLoader,
  }
]
`;

  const authLoader = `
export async function requireAuthLoader() {
  return null;
}
`;

  const result = evaluateProtectedRoutingIndependence(routes, authLoader);
  assert.equal(result.passed, true);
});

test('evaluateE2ESecretWiring requires both e2e secret env variables', () => {
  const workflowContent = `
env:
  VITE_TEST_EMAIL: \${{ secrets.VITE_TEST_EMAIL }}
  VITE_TEST_PASSWORD: \${{ secrets.VITE_TEST_PASSWORD }}
`;

  const result = evaluateE2ESecretWiring(workflowContent);
  assert.equal(result.passed, true);
});
