import { readFile, writeFile } from 'node:fs/promises';
/** Only an explicitly enabled contact build needs the Turnstile resource origins. */
export function contactHeaders(source, enabled) {
  if (!enabled) return source;
  if (!source.includes("script-src 'self';") || !source.includes("frame-src 'none';")) throw new Error('Review contact CSP against changed base policy.');
  return source.replace("script-src 'self';", "script-src 'self' https://challenges.cloudflare.com;")
    .replace("frame-src 'none';", 'frame-src https://challenges.cloudflare.com;');
}
export function contactBuildHeaders() {
  return { name: 'approved-contact-build-headers', hooks: { 'astro:build:done': async ({ dir }) => {
    const home = await readFile(new URL('index.html', dir), 'utf8');
    const contact = await readFile(new URL('contact/index.html', dir), 'utf8');
    if (![home, contact].some(html => html.includes('data-inquiry-delivery="backend"'))) return;
    const target = new URL('_headers', dir);
    await writeFile(target, contactHeaders(await readFile(target, 'utf8'), true));
  } } };
}
