import { createStagingHandler } from './staging-handler.ts';
import policy from './rc-policy.json' with { type: 'json' };

type Env = {
  STAGING_HOSTNAME?: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
};

// Only this RC entry adds a blanket policy. Existing staging/production entries
// never import it. Reuse their established read-only preview protections.
function createRcHandler() {
  const staging = createStagingHandler();
  return { async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = env.STAGING_HOSTNAME === policy.hostname;
    const response = await staging.fetch(request, allowed ? env : { ...env, STAGING_HOSTNAME: '' });
    const result = new Response(response.body, response);
    // Covers HTML, PDFs/documents, redirects, errors, HEAD, ranges and 304s.
    result.headers.set('X-Robots-Tag', 'noindex, follow');
    return result;
  } };
}
export default createRcHandler();
