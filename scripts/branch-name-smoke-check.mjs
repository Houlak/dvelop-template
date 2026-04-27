#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { getNamingGuidance, validateBranchName } from './branchNamingRules.mjs';

function parseArgs(argv) {
  return {
    strict: argv.includes('--strict'),
    json: argv.includes('--json'),
  };
}

function listGitRefs() {
  const output = execFileSync('git', ['for-each-ref', '--format=%(refname)', 'refs/heads', 'refs/remotes'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseRef(ref) {
  if (ref.startsWith('refs/heads/')) {
    const branch = ref.replace('refs/heads/', '');
    return {
      scope: 'local',
      displayName: branch,
      branchName: branch,
      ref,
    };
  }

  if (ref.startsWith('refs/remotes/')) {
    const remotePath = ref.replace('refs/remotes/', '');
    if (remotePath.endsWith('/HEAD')) {
      return null;
    }

    const firstSlash = remotePath.indexOf('/');
    if (firstSlash === -1) {
      return null;
    }

    const remote = remotePath.slice(0, firstSlash);
    const branch = remotePath.slice(firstSlash + 1);

    return {
      scope: `remote:${remote}`,
      displayName: `${remote}/${branch}`,
      branchName: branch,
      ref,
    };
  }

  return null;
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const refs = listGitRefs();
  const branches = refs.map(parseRef).filter(Boolean);

  const results = branches.map((branch) => {
    const validation = validateBranchName(branch.branchName);
    return {
      ...branch,
      ...validation,
    };
  });

  const invalid = results.filter((result) => !result.isValid);
  const valid = results.filter((result) => result.isValid);

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          strictMode: args.strict,
          checkedBranches: results.length,
          validBranches: valid.length,
          invalidBranches: invalid.length,
          rules: getNamingGuidance(),
          results,
        },
        null,
        2
      )
    );
  } else {
    console.log('Branch Naming Smoke Test');
    console.log('========================');
    console.log('');
    console.log('Rules:');
    for (const rule of getNamingGuidance()) {
      console.log(`- ${rule}`);
    }

    console.log('');
    console.log(`Branches checked: ${results.length}`);
    console.log(`Valid: ${valid.length}`);
    console.log(`Invalid: ${invalid.length}`);
    console.log('');

    for (const result of results) {
      const status = result.isValid ? 'PASS' : 'FAIL';
      const details = result.isValid ? result.category : result.reason;
      console.log(`[${status}] ${result.displayName} (${result.scope}) - ${details}`);

      if (!result.isValid) {
        console.log(`       Recommendation: ${result.recommendation}`);
      }
    }

    console.log('');
    if (invalid.length > 0) {
      console.log(
        args.strict
          ? 'Result: violations found (strict mode enabled, returning exit code 1).'
          : 'Result: violations found (informational mode, returning exit code 0).'
      );
    } else {
      console.log('Result: all branch names match the convention.');
    }
  }

  if (args.strict && invalid.length > 0) {
    process.exitCode = 1;
  }
}

try {
  run();
} catch (error) {
  console.error('Unable to execute branch naming smoke test.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
