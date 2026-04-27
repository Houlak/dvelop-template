import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const BRANCH_CANDIDATES = [
  { name: 'main', expectedGitValid: true, expectedWorkflowTrigger: true, expectedAmplifyCommand: 'yarn run build:prod' },
  {
    name: 'develop',
    expectedGitValid: true,
    expectedWorkflowTrigger: true,
    expectedAmplifyCommand: 'yarn run build:dev',
  },
  { name: 'dev', expectedGitValid: true, expectedWorkflowTrigger: false, expectedAmplifyCommand: 'yarn run build:dev' },
  { name: 'qa', expectedGitValid: true, expectedWorkflowTrigger: false, expectedAmplifyCommand: 'yarn run build:qa' },
  {
    name: 'feature/auth-login',
    expectedGitValid: true,
    expectedWorkflowTrigger: false,
    expectedAmplifyCommand: 'yarn run build:dev',
  },
  {
    name: 'bugfix/fix-auth-loader',
    expectedGitValid: true,
    expectedWorkflowTrigger: false,
    expectedAmplifyCommand: 'yarn run build:dev',
  },
  {
    name: 'hotfix/security-patch-2026-04-27',
    expectedGitValid: true,
    expectedWorkflowTrigger: false,
    expectedAmplifyCommand: 'yarn run build:dev',
  },
  {
    name: `feature/very-long-${'x'.repeat(64)}`,
    expectedGitValid: true,
    expectedWorkflowTrigger: false,
    expectedAmplifyCommand: 'yarn run build:dev',
  },
  { name: 'feature/space in name', expectedGitValid: false, expectedWorkflowTrigger: false },
  { name: 'feature/branch~name', expectedGitValid: false, expectedWorkflowTrigger: false },
  { name: 'feature/branch:name', expectedGitValid: false, expectedWorkflowTrigger: false },
  { name: 'feature/trailing-slash/', expectedGitValid: false, expectedWorkflowTrigger: false },
];

const DEFAULT_FILES = {
  workflow: '.github/workflows/e2e-tests.yml',
  amplify: 'amplify.yml',
  exampleWorkflow: '.github/workflows/build-react-frontend-template.yml.example',
  routes: 'src/app/router/routes.tsx',
  authLoader: 'src/app/router/auth.loader.ts',
};

function leadingSpacesCount(value) {
  const match = value.match(/^\s*/);
  return match ? match[0].length : 0;
}

function normalizeBranchToken(token) {
  return token.trim().replace(/,$/, '').replace(/^['"]|['"]$/g, '');
}

function parseInlineBranches(value) {
  if (!value.startsWith('[') || !value.endsWith(']')) {
    return [];
  }

  return value
    .slice(1, -1)
    .split(',')
    .map((token) => normalizeBranchToken(token))
    .filter(Boolean);
}

function parseBlockBranches(lines, branchesLineIndex) {
  const branchesLine = lines[branchesLineIndex] ?? '';
  const branchesIndent = leadingSpacesCount(branchesLine);
  const branches = [];

  let index = branchesLineIndex + 1;
  while (index < lines.length) {
    const rawLine = lines[index];
    const lineIndent = leadingSpacesCount(rawLine);
    const trimmed = rawLine.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (lineIndent <= branchesIndent) {
      break;
    }

    if (trimmed.startsWith('- ')) {
      branches.push(normalizeBranchToken(trimmed.slice(2)));
    }

    index += 1;
  }

  return branches;
}

export function parseWorkflowBranchTriggers(yamlContent) {
  const lines = yamlContent.split(/\r?\n/);
  const result = {
    push: [],
    pull_request: [],
  };

  let inOnBlock = false;
  let onIndent = -1;
  let currentEvent = null;
  let currentEventIndent = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const indent = leadingSpacesCount(line);

    if (!inOnBlock && trimmed === 'on:') {
      inOnBlock = true;
      onIndent = indent;
      currentEvent = null;
      currentEventIndent = -1;
      continue;
    }

    if (!inOnBlock) {
      continue;
    }

    if (indent <= onIndent) {
      inOnBlock = false;
      currentEvent = null;
      currentEventIndent = -1;
      continue;
    }

    const eventMatch = trimmed.match(/^([a-z_]+):\s*$/i);
    if (eventMatch && Object.hasOwn(result, eventMatch[1])) {
      currentEvent = eventMatch[1];
      currentEventIndent = indent;
      continue;
    }

    if (!currentEvent || indent <= currentEventIndent) {
      continue;
    }

    const branchesMatch = trimmed.match(/^branches:\s*(.*)$/);
    if (!branchesMatch) {
      continue;
    }

    const rawValue = branchesMatch[1].trim();
    if (rawValue) {
      const inlineBranches = parseInlineBranches(rawValue);
      if (inlineBranches.length > 0 && result[currentEvent]) {
        result[currentEvent] = inlineBranches;
      }
      continue;
    }

    const blockBranches = parseBlockBranches(lines, index);
    if (blockBranches.length > 0 && result[currentEvent]) {
      result[currentEvent] = blockBranches;
    }
  }

  return result;
}

export function parseAmplifyAwsBranchBuildRules(yamlContent) {
  const normalized = yamlContent.replace(/\s+/g, ' ');
  const rules = {};

  const branchConditionRegex =
    /(if|elif)\s+\[\s*"\$\{AWS_BRANCH\}"\s*=\s*"([^"]+)"\s*\];\s*then\s*([^;]+);/g;

  let match = branchConditionRegex.exec(normalized);
  while (match) {
    rules[match[2]] = match[3].trim();
    match = branchConditionRegex.exec(normalized);
  }

  const fallbackMatch = normalized.match(/else\s*([^;]+);\s*fi\s*;?/);
  const fallbackCommand = fallbackMatch ? fallbackMatch[1].trim() : null;

  return {
    rules,
    fallbackCommand,
    awsBranchQuoted: /"\$\{AWS_BRANCH\}"/.test(yamlContent),
  };
}

export function resolveAmplifyBuildCommand(branchName, amplifyRules) {
  if (!amplifyRules || !amplifyRules.rules) {
    return null;
  }

  return amplifyRules.rules[branchName] ?? amplifyRules.fallbackCommand;
}

export function isValidGitBranchName(branchName) {
  try {
    execFileSync('git', ['check-ref-format', '--branch', branchName], {
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

export function evaluateBranchCandidates(
  branchCandidates,
  workflowTriggers,
  amplifyRules,
  gitBranchValidator = isValidGitBranchName,
) {
  const pushBranches = new Set(workflowTriggers.push);
  const prBranches = new Set(workflowTriggers.pull_request);

  return branchCandidates.map((candidate) => {
    const gitValid = gitBranchValidator(candidate.name);
    const triggersPush = pushBranches.has(candidate.name);
    const triggersPullRequest = prBranches.has(candidate.name);
    const amplifyCommand = resolveAmplifyBuildCommand(candidate.name, amplifyRules);

    return {
      ...candidate,
      gitValid,
      triggersPush,
      triggersPullRequest,
      amplifyCommand,
      matchesExpectedGitValidity:
        typeof candidate.expectedGitValid === 'boolean' ? candidate.expectedGitValid === gitValid : true,
      matchesExpectedWorkflowTrigger:
        typeof candidate.expectedWorkflowTrigger === 'boolean'
          ? candidate.expectedWorkflowTrigger === triggersPush && candidate.expectedWorkflowTrigger === triggersPullRequest
          : true,
      matchesExpectedAmplifyCommand: candidate.expectedAmplifyCommand
        ? candidate.expectedAmplifyCommand === amplifyCommand
        : true,
    };
  });
}

export function evaluateProtectedRoutingIndependence(routesContent, authLoaderContent) {
  const hasProtectedLayout = routesContent.includes('element: <ProtectedLayout />');
  const hasRequireAuthLoader = /loader:\s*requireAuthLoader/.test(routesContent);
  const authLoaderHasBranchDependency =
    /AWS_BRANCH|GITHUB_REF|BRANCH_NAME|process\.env\.BRANCH/i.test(authLoaderContent);

  return {
    hasProtectedLayout,
    hasRequireAuthLoader,
    authLoaderHasBranchDependency,
    passed: hasProtectedLayout && hasRequireAuthLoader && !authLoaderHasBranchDependency,
  };
}

export function evaluateE2ESecretWiring(workflowContent) {
  const hasTestEmailSecret = /VITE_TEST_EMAIL:\s*\$\{\{\s*secrets\.VITE_TEST_EMAIL\s*\}\}/.test(workflowContent);
  const hasTestPasswordSecret =
    /VITE_TEST_PASSWORD:\s*\$\{\{\s*secrets\.VITE_TEST_PASSWORD\s*\}\}/.test(workflowContent);

  return {
    hasTestEmailSecret,
    hasTestPasswordSecret,
    passed: hasTestEmailSecret && hasTestPasswordSecret,
  };
}

export function buildConsistencyWarnings({ workflowTriggers, amplifyRules, exampleWorkflowTriggers }) {
  const warnings = [];
  const e2eBranches = new Set([...workflowTriggers.push, ...workflowTriggers.pull_request]);
  const amplifyBranches = new Set(Object.keys(amplifyRules.rules));
  const exampleBranches = new Set([
    ...exampleWorkflowTriggers.push,
    ...exampleWorkflowTriggers.pull_request,
  ]);

  if (e2eBranches.has('develop') && !amplifyBranches.has('develop')) {
    warnings.push(
      'E2E workflow uses `develop` while Amplify does not have an explicit `develop` mapping (falls back to default build).',
    );
  }

  if (amplifyBranches.has('dev') && !e2eBranches.has('dev')) {
    warnings.push(
      'Amplify has explicit `dev` mapping, but E2E workflow does not trigger on `dev`.',
    );
  }

  if (exampleBranches.has('dev') && e2eBranches.has('develop')) {
    warnings.push('Workflow naming differs between `dev` and `develop` across CI examples and active workflows.');
  }

  return warnings;
}

function toUnique(items) {
  return [...new Set(items)];
}

function formatPassFail(value) {
  return value ? 'PASS' : 'FAIL';
}

function buildMarkdownReport({
  now,
  workflowTriggers,
  amplifyRules,
  branchEvaluations,
  routeCheck,
  secretCheck,
  warnings,
  failures,
}) {
  const triggerBranches = toUnique([...workflowTriggers.push, ...workflowTriggers.pull_request]);
  const amplifyMappedBranches = Object.keys(amplifyRules.rules);

  const rows = branchEvaluations.map((item) => {
    return `| \`${item.name}\` | ${formatPassFail(item.gitValid)} | ${formatPassFail(item.triggersPush)} | ${formatPassFail(item.triggersPullRequest)} | \`${item.amplifyCommand ?? 'n/a'}\` | ${formatPassFail(item.matchesExpectedGitValidity && item.matchesExpectedWorkflowTrigger && item.matchesExpectedAmplifyCommand)} |`;
  });

  const warningLines = warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join('\n') : '- None';
  const failureLines = failures.length > 0 ? failures.map((failure) => `- ${failure}`).join('\n') : '- None';

  return `# Branch Naming Smoke Test Report\n\n- Date: ${now.toISOString()}\n- Scope: CI/CD branch naming safety for GitHub Actions + AWS Amplify\n\n## Summary\n- Result: **${failures.length > 0 ? 'FAILED' : 'PASSED'}**\n- Evaluated branches: ${branchEvaluations.length}\n- GitHub Actions trigger branches: ${triggerBranches.map((name) => `\`${name}\``).join(', ') || 'none'}\n- Amplify explicit branch mappings: ${amplifyMappedBranches.map((name) => `\`${name}\``).join(', ') || 'none'}\n- Amplify fallback build: \`${amplifyRules.fallbackCommand ?? 'n/a'}\`\n\n## Candidate Matrix\n| Branch | Git Name Valid | Push Trigger | PR Trigger | Amplify Build | Expected Behavior |\n| --- | --- | --- | --- | --- | --- |\n${rows.join('\n')}\n\n## Safety Checks\n- Protected routing wiring intact: ${formatPassFail(routeCheck.passed)}\n- Auth loader branch-independent: ${formatPassFail(!routeCheck.authLoaderHasBranchDependency)}\n- E2E secret wiring intact (\`VITE_TEST_EMAIL\`, \`VITE_TEST_PASSWORD\`): ${formatPassFail(secretCheck.passed)}\n- \`AWS_BRANCH\` quoted in Amplify shell condition: ${formatPassFail(amplifyRules.awsBranchQuoted)}\n\n## Warnings\n${warningLines}\n\n## Failures\n${failureLines}\n`;
}

function ensureDirectoryForFile(filePath) {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });
}

function readFile(rootDir, relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

export function runSmokeTest(options = {}) {
  const rootDir = options.rootDir ?? process.cwd();
  const workflowContent = readFile(rootDir, DEFAULT_FILES.workflow);
  const amplifyContent = readFile(rootDir, DEFAULT_FILES.amplify);
  const exampleWorkflowContent = readFile(rootDir, DEFAULT_FILES.exampleWorkflow);
  const routesContent = readFile(rootDir, DEFAULT_FILES.routes);
  const authLoaderContent = readFile(rootDir, DEFAULT_FILES.authLoader);

  const workflowTriggers = parseWorkflowBranchTriggers(workflowContent);
  const amplifyRules = parseAmplifyAwsBranchBuildRules(amplifyContent);
  const exampleWorkflowTriggers = parseWorkflowBranchTriggers(exampleWorkflowContent);

  const branchEvaluations = evaluateBranchCandidates(
    options.branchCandidates ?? BRANCH_CANDIDATES,
    workflowTriggers,
    amplifyRules,
    options.gitBranchValidator,
  );

  const routeCheck = evaluateProtectedRoutingIndependence(routesContent, authLoaderContent);
  const secretCheck = evaluateE2ESecretWiring(workflowContent);
  const warnings = buildConsistencyWarnings({ workflowTriggers, amplifyRules, exampleWorkflowTriggers });

  const failures = [];

  const expectedTriggerBranches = ['main', 'develop'];
  const expectedTriggerSet = new Set(expectedTriggerBranches);
  const pushMatchesExpected =
    workflowTriggers.push.length === expectedTriggerBranches.length &&
    workflowTriggers.push.every((branchName) => expectedTriggerSet.has(branchName));
  const prMatchesExpected =
    workflowTriggers.pull_request.length === expectedTriggerBranches.length &&
    workflowTriggers.pull_request.every((branchName) => expectedTriggerSet.has(branchName));

  if (!pushMatchesExpected || !prMatchesExpected) {
    failures.push('E2E workflow does not include expected `main` + `develop` triggers for both push and pull_request.');
  }

  const mismatchedCandidates = branchEvaluations.filter(
    (item) => !(item.matchesExpectedGitValidity && item.matchesExpectedWorkflowTrigger && item.matchesExpectedAmplifyCommand),
  );

  if (mismatchedCandidates.length > 0) {
    failures.push(`Unexpected branch evaluation outcome for: ${mismatchedCandidates.map((item) => item.name).join(', ')}`);
  }

  if (!routeCheck.passed) {
    failures.push('Protected route wiring check failed.');
  }

  if (!secretCheck.passed) {
    failures.push('E2E test secret wiring check failed.');
  }

  if (!amplifyRules.awsBranchQuoted) {
    failures.push('Amplify `AWS_BRANCH` is not safely quoted in shell conditions.');
  }

  const now = options.now ?? new Date();
  const reportMarkdown = buildMarkdownReport({
    now,
    workflowTriggers,
    amplifyRules,
    branchEvaluations,
    routeCheck,
    secretCheck,
    warnings,
    failures,
  });

  return {
    now,
    workflowTriggers,
    amplifyRules,
    branchEvaluations,
    routeCheck,
    secretCheck,
    warnings,
    failures,
    passed: failures.length === 0,
    reportMarkdown,
  };
}

function parseReportPathArg(argv, defaultPath) {
  const reportFlagIndex = argv.indexOf('--report');
  if (reportFlagIndex === -1) {
    return defaultPath;
  }

  const nextValue = argv[reportFlagIndex + 1];
  return nextValue ? nextValue : defaultPath;
}

function runFromCli() {
  const argv = process.argv.slice(2);
  const strict = argv.includes('--strict');
  const writeReport = !argv.includes('--no-report');

  const result = runSmokeTest();
  const reportPath = parseReportPathArg(argv, 'docs/reports/branch-naming-smoke-test.md');

  if (writeReport) {
    const absoluteReportPath = path.resolve(process.cwd(), reportPath);
    ensureDirectoryForFile(absoluteReportPath);
    fs.writeFileSync(absoluteReportPath, result.reportMarkdown, 'utf8');
    console.log(`Branch naming smoke report written to ${reportPath}`);
  }

  console.log(`Smoke test result: ${result.passed ? 'PASSED' : 'FAILED'}`);

  if (result.failures.length > 0) {
    console.log('Failures:');
    for (const failure of result.failures) {
      console.log(`- ${failure}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of result.warnings) {
      console.log(`- ${warning}`);
    }
  }

  if (!result.passed || (strict && result.warnings.length > 0)) {
    process.exit(1);
  }
}

const entryFilePath = fileURLToPath(import.meta.url);
const currentScriptPath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (entryFilePath === currentScriptPath) {
  runFromCli();
}
