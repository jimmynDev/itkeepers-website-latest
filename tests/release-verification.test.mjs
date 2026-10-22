import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

// Invalid/unauthorized origins must fail before any HTTP request or output file.
test('release smoke checker requires explicit remote permission and rejects ambiguous origins', () => {
  const cases = [
    ['--base', 'https://itkeepers.com'],
    ['--base', 'http://example.test', '--local-fixture'],
    ['--base', 'https://itkeepers.com@evil.test', '--allow-production'],
    ['--base', 'https://itkeepers.com/#fragment', '--allow-production'],
    ['--base', 'http://127.0.0.1:4377/path', '--local-fixture'],
  ];
  for (const args of cases) {
    const result = spawnSync('python', ['-X', 'utf8', 'scripts/verify-release.py', ...args, '--output', 'unused-invalid-release-output.json'], { encoding: 'utf8', timeout: 5000 });
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /error:/);
  }
});
