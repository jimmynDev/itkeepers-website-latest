import { createStagingHandler } from './staging-handler.ts';
import policy from './release-policy.json' with { type: 'json' };

type Env = {
  STAGING_HOSTNAME?: string;
  RELEASE_COMMIT?: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
};

// Only this RC entry adds a blanket policy. Existing staging/production entries
// never import it. Reuse their established read-only preview protections.
function createReleaseHandler() {
  const staging = createStagingHandler();
  return { async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = env.STAGING_HOSTNAME === policy.hostname;
    const response = await staging.fetch(request, allowed ? env : { ...env, STAGING_HOSTNAME: '' });
    const result = new Response(response.body, response);
    // Covers HTML, PDFs/documents, redirects, errors, HEAD, ranges and 304s.
    result.headers.set('X-Robots-Tag', 'noindex, follow');
    if (/^[a-f0-9]{40}$/.test(env.RELEASE_COMMIT || '')) result.headers.set('X-ITKeepers-Release', env.RELEASE_COMMIT!);
    return result;
  } };
}
export default createReleaseHandler();
