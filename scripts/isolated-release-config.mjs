import { isDeepStrictEqual } from 'node:util';
import policy from '../worker/isolated-release-policy.json' with { type: 'json' };

/** Reject target drift and extra capabilities without logging configuration values. */
export function assertIsolatedConfig(config) {
  if (policy.name !== 'itkeepers-v2-rc-20261102' ||
      policy.accountId !== 'eabf58c0ea3cf8629b95c29042124f72' ||
      policy.hostname !== policy.name + '.jimnassar99.workers.dev' ||
      policy.origin !== 'https://' + policy.hostname)
    throw new Error('Review the fixed November 2 isolated policy.');
  const expected = {
    name: policy.name, account_id: policy.accountId, main: 'worker/isolated-release.ts',
    compatibility_date: '2026-10-30', send_metrics: false, workers_dev: true,
    preview_urls: false, routes: [],
    vars: { STAGING_HOSTNAME: policy.hostname, CONTACT_VALIDATION_ENABLED: 'false', CONTACT_DELIVERY_ENABLED: 'false' },
    assets: { directory: './dist-isolated-release', binding: 'ASSETS', run_worker_first: true },
    observability: { enabled: false }
  };
  if (!isDeepStrictEqual(config, expected))
    throw new Error('The isolated configuration differs from the exact reviewed target or capabilities.');
}
