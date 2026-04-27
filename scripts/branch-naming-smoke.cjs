#!/usr/bin/env node

const { execSync } = require('node:child_process');
const { validateBranchName } = require('./branch-naming-rules.cjs');

function getUniqueBranches() {
  const output = execSync(
    "git for-each-ref --format='%(refname)|%(refname:short)' refs/heads refs/remotes",
    { encoding: 'utf8' },
  ).trim();

  if (!output) {
    return [];
  }

  const branchMap = new Map();

  for (const line of output.split('\n')) {
    const [fullRef, shortRef] = line.split('|');

    if (!fullRef || !shortRef) {
      continue;
    }

    if (fullRef.endsWith('/HEAD')) {
      continue;
    }

    const isRemote = fullRef.startsWith('refs/remotes/');
    const branchName = isRemote ? shortRef.split('/').slice(1).join('/') : shortRef;

    if (!branchName) {
      continue;
    }

    if (!branchMap.has(branchName)) {
      branchMap.set(branchName, {
        branchName,
        refs: [],
      });
    }

    branchMap.get(branchName).refs.push(shortRef);
  }

  return Array.from(branchMap.values()).sort((a, b) => a.branchName.localeCompare(b.branchName));
}

function printSummary(validationResults) {
  const violations = validationResults.filter((item) => !item.result.valid);

  console.log('Branch naming smoke test');
  console.log(`Checked ${validationResults.length} unique branch name(s).`);

  if (violations.length === 0) {
    console.log('No branch naming violations found.');
    return 0;
  }

  console.log(`Found ${violations.length} branch naming violation(s):`);

  for (const violation of violations) {
    const refs = violation.refs.join(', ');
    console.log(`- ${violation.branchName}`);
    console.log(`  refs: ${refs}`);
    console.log(`  rule: ${violation.result.rule}`);
    console.log(`  reason: ${violation.result.reason}`);
  }

  return violations.length;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const strict = args.has('--strict');

  const branches = getUniqueBranches();
  const validationResults = branches.map((branch) => ({
    ...branch,
    result: validateBranchName(branch.branchName),
  }));

  const violationCount = printSummary(validationResults);

  if (strict && violationCount > 0) {
    process.exitCode = 1;
    return;
  }

  process.exitCode = 0;
}

main();
