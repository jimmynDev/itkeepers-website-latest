import indexingPolicy from './public-indexing-policy.json' with { type: 'json' };
type Env = { STAGING_HOSTNAME?: string; ASSETS: { fetch: (request: Request) => Promise<Response> } };
// Static recovery content: never reflect the requested URL or private filenames.
const notFoundPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found | ITKeepers</title><meta name="robots" content="noindex, follow">
<meta name="description" content="This page could not be found. Explore ITKeepers services or contact our team.">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/not-found.css"></head>
<body><a class="skip-link" href="#main-content">Skip to content</a>
<header><a class="brand" href="/" aria-label="ITKeepers home"><img src="/assets/itkeepers-logo.png" alt="ITKeepers" width="1747" height="289"></a></header>
<main id="main-content" tabindex="-1"><p class="eyebrow">404 · Page not found</p><h1>Let’s get you back on track.</h1>
<p>The link may have changed, or this page may no longer be available.</p>
<nav aria-label="Find your next page"><a class="primary" href="/">Back to Home</a><a href="/services/">Explore our services</a><a href="/contact/">Talk to our team</a></nav></main>
<footer>Your IT person is a team.</footer></body></html>`;
// Only build-fingerprinted public assets may outlive a deployment in a browser cache.
// Require the ASSETS binding's explicit immutable policy too: a matching filename
// alone must never turn fallback HTML, redirects, errors or personalized data cacheable.
function immutableAsset(response: Response, pathname: string, request?: Request): boolean {
  if (!request || !['GET', 'HEAD'].includes(request.method) || request.headers.has('Authorization')) return false;
  if (![200, 304].includes(response.status) || response.headers.has('Set-Cookie')) return false;
  const asset = /^\/_astro\/[^/]+\.[A-Za-z0-9_-]{8}\.(js|css|webp)$/.exec(pathname);
  const sharedStyle = /^\/styles\/site-[a-f0-9]{12}\.css$/.test(pathname);
  if (!asset && !sharedStyle) return false;
  const directives = response.headers.get('Cache-Control')?.toLowerCase().split(',').map(value => value.trim()) || [];
  if (!['public', 'max-age=31536000', 'immutable'].every(value => directives.includes(value))) return false;
  if (directives.some(value => /^(?:private|no-store|no-cache)(?:=|$)/.test(value))) return false;
  const type = response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase();
  // A 304 may omit Content-Type; if supplied it must still match the asset type.
  const extension = asset?.[1] || 'css';
  return (response.status === 304 && !type) || (extension === 'css' ? type === 'text/css'
    : extension === 'webp' ? type === 'image/webp' : ['text/javascript', 'application/javascript'].includes(type || ''));
}
function protect(response: Response, pathname = '', request?: Request): Response {
  const result = new Response(response.body, response);
  const canonical = pathname.replace(/\/+/g, '/').replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/+$/, '') + '/';
  if (response.status >= 400 || Object.hasOwn(indexingPolicy.noindex, canonical)) result.headers.set('X-Robots-Tag', 'noindex, follow');
  result.headers.set('Cache-Control', immutableAsset(response, request ? new URL(request.url).pathname : pathname, request)
    ? 'public, max-age=31536000, immutable' : 'private, no-store');
  result.headers.set('X-Content-Type-Options', 'nosniff');
  // Match public/_headers: Formspree domain filtering needs the HTTPS origin,
  // while cross-origin paths/queries and HTTPS-to-HTTP referrers stay suppressed.
  result.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  result.headers.set('X-Frame-Options', 'DENY');
  result.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return result;
}
function error(status: number, body: object | string, allow = 'POST'): Response {
  const response = typeof body === 'string' ? new Response(body, { status }) : Response.json(body, { status });
  response.headers.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  if (status === 405) response.headers.set('Allow', allow);
  return protect(response);
}
export function createStagingHandler() {
  return { async fetch(request: Request, env: Env): Promise<Response> {
    const hostname = env.STAGING_HOSTNAME || '';
    if (!/^[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev$/.test(hostname)
      || new URL(request.url).hostname !== hostname) return error(403, 'Staging hostname unavailable.');
    const path = new URL(request.url).pathname;
    if (['/api/contact', '/api/inquiry'].includes(path)) {
      return error(request.method === 'POST' ? 503 : 405, { ok: false, code: request.method === 'POST' ? 'contact_unavailable' : 'method_not_allowed' });
    }
    if (!['GET', 'HEAD'].includes(request.method)) return error(405, 'Read-only staging.', 'GET, HEAD');
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        void response.body?.cancel();
        const headers = new Headers(response.headers);
        // The representation changed; upstream entity headers no longer apply.
        for (const name of ['Content-Length', 'Content-Encoding', 'ETag', 'Last-Modified', 'Location']) headers.delete(name);
        headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.set('Content-Security-Policy', "default-src 'none'; style-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
        return protect(new Response(request.method === 'HEAD' ? null : notFoundPage, { status: 404, headers }), path);
      }
      return protect(response, decodeURIComponent(path), request);
    }
    catch { return error(503, 'Staging unavailable.'); }
  } };
}
export default createStagingHandler();
