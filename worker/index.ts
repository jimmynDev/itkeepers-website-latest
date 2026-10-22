import { contactFormRecipient } from '../src/data/contact';
import { inquiryLimits, validateServiceInterests, serviceInterests } from '../src/data/inquiry';
import { policy } from './policy';
export { InquiryGuard } from './guard';

type Email = { to: string; from: string; replyTo: string; subject: string; text: string };
export type Env = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  CONTACT_DELIVERY_ENABLED?: string; CONTACT_VALIDATION_ENABLED?: string; CONTACT_ALLOWED_ORIGIN?: string;
  CONTACT_EMAIL_FROM?: string; TURNSTILE_SECRET_KEY?: string; CONTACT_RATE_HMAC_KEY?: string;
  CONTACT_EMAIL?: { send: (message: Email) => Promise<{ messageId: string }> };
  CONTACT_GUARD?: { idFromName: (name: string) => unknown; get: (id: unknown) => { fetch: (req: Request) => Promise<Response> } };
};
type Dependencies = { fetch: typeof fetch };
const fieldNames = ['name', 'email', 'company', 'phone', 'message'] as const;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const emailAddress = (s: string) => s.length <= 254 && /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(s) && !s.includes('..');
class Rejection extends Error { constructor(public status: number, public code: string) { super(code); } }
function reply(status: number, code: string, accepted = false): Response {
  return Response.json(accepted ? { ok: true, status: 'accepted' } : { ok: false, code }, {
    status, headers: {
      'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
      'X-Frame-Options': 'DENY', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
      ...(status === 405 ? { Allow: 'POST' } : {}),
      ...(status === 429 ? { 'Retry-After': String(policy.clientWindowMs / 1000) } : {}),
    },
  });
}
async function boundedBody(request: Request): Promise<ArrayBuffer> {
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > policy.maxBodyBytes)) throw new Rejection(413, 'request_too_large');
  const reader = request.body?.getReader(); if (!reader) throw new Rejection(400, 'invalid_request');
  const chunks: Uint8Array[] = []; let size = 0;
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, policy.bodyTimeoutMs);
  let ended = false;
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) { ended = true; break; }
      size += value.byteLength;
      if (size > policy.maxBodyBytes) { void reader.cancel().catch(() => {}); throw new Rejection(413, 'request_too_large'); }
      chunks.push(value);
    }
  } finally { clearTimeout(timeout); reader.releaseLock(); }
  // A cancelled stream must not turn a partial, apparently valid body into a submission.
  if (!ended || timedOut) throw new Rejection(408, 'request_timeout');
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes.buffer;
}
async function hmac(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))), n => n.toString(16).padStart(2, '0')).join('');
}
async function within<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  try { return await Promise.race([promise, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), ms); })]); }
  finally { clearTimeout(timer!); }
}
/** Local/staging validation only. No inquiry persistence or email integration is enabled. */
export async function handleContact(request: Request, env: Env, dependencies: Dependencies = { fetch }): Promise<Response> {
  const response = await processInquiry(request, env, dependencies, false);
  if (new URL(request.url).hostname === 'itkeepers.com') response.headers.set('Strict-Transport-Security', 'max-age=86400');
  return response;
}
/** Retained email preparation for future review; not routed by the public Worker. */
export async function handleInquiry(request: Request, env: Env, dependencies: Dependencies = { fetch }): Promise<Response> {
  const response = await processInquiry(request, env, dependencies);
  if (new URL(request.url).hostname === 'itkeepers.com') response.headers.set('Strict-Transport-Security', 'max-age=86400');
  return response;
}
async function processInquiry(request: Request, env: Env, dependencies: Dependencies, emailDelivery = true): Promise<Response> {
  if (request.method !== 'POST') return reply(405, 'method_not_allowed');
  // Disabled means no body read, token verification, storage or provider call.
  if ((emailDelivery ? env.CONTACT_DELIVERY_ENABLED : env.CONTACT_VALIDATION_ENABLED) !== 'true') return reply(503, 'contact_unavailable');
  const origin = env.CONTACT_ALLOWED_ORIGIN;
  const from = env.CONTACT_EMAIL_FROM ?? '';
  if (!origin || !/^https:\/\/itkeepers\.com$|^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    || !env.CONTACT_GUARD || !env.TURNSTILE_SECRET_KEY
    || !env.CONTACT_RATE_HMAC_KEY || env.CONTACT_RATE_HMAC_KEY.length < 32
    || (emailDelivery && (!env.CONTACT_EMAIL || !emailAddress(from) || from.split('@')[1] !== 'itkeepers.com'))) return reply(503, 'contact_unavailable');
  if (new URL(request.url).origin !== origin || request.headers.get('origin') !== origin
    || !['same-origin', null].includes(request.headers.get('sec-fetch-site'))) return reply(403, 'origin_rejected');
  const mime = request.headers.get('content-type') ?? '';
  if (!/^multipart\/form-data\s*;\s*boundary=/i.test(mime)) return reply(415, 'unsupported_content_type');
  // Cloudflare supplies this header at the edge. Never use visitor-controlled X-Forwarded-For.
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip || ip.length > 64 || !/^[0-9a-f:.]+$/i.test(ip)) return reply(503, 'contact_unavailable');
  try {
    const guard = env.CONTACT_GUARD.get(env.CONTACT_GUARD.idFromName('inquiry-global-v1'));
    const callGuard = async (input: object) => {
      const response = await within(guard.fetch(new Request('https://guard.internal/', { method: 'POST', body: JSON.stringify(input) })), 3000);
      if (!response.ok) throw new Error('guard unavailable');
      return response.json() as Promise<any>;
    };
    const client = await hmac(env.CONTACT_RATE_HMAC_KEY, 'client:' + ip);
    const admission = await callGuard({ op: 'attempt', client });
    if (admission.status === 'limited') return reply(429, 'rate_limited');
    if (admission.status !== 'allowed') throw new Error('guard unavailable');
    let form: FormData;
    try { form = await new Request(request.url, { method: 'POST', headers: { 'content-type': mime }, body: await boundedBody(request) }).formData(); }
    catch (error) { if (error instanceof Rejection) throw error; throw new Rejection(400, 'invalid_request'); }
    const allowed = new Set([...fieldNames, 'type', 'form_kind', 'interests', 'website', 'request_id', 'cf-turnstile-response']);
    for (const [name, value] of form) if (!allowed.has(name as any) || typeof value !== 'string' || (name !== 'interests' && form.getAll(name).length !== 1)) throw new Rejection(400, 'invalid_fields');
    const fields = Object.fromEntries(fieldNames.map(name => [name, String(form.get(name) ?? '')])) as Record<typeof fieldNames[number], string>;
    for (const name of fieldNames) {
      if (fields[name].length > inquiryLimits[name] || (name === 'message' ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(fields[name])) throw new Rejection(400, 'invalid_fields');
      fields[name] = fields[name].trim();
    }
    if (!fields.name || !fields.message || !emailAddress(fields.email)) throw new Rejection(400, 'invalid_fields');
    const type = form.get('type'); const kind = form.get('form_kind');
    if (!['general', 'review'].includes(type as string) || !['contact', 'review'].includes(kind as string)
      || (kind === 'review' && type !== 'review') || String(form.get('website') ?? '') !== '') throw new Rejection(400, 'invalid_fields');
    let interests: string[];
    try { interests = validateServiceInterests(form.getAll('interests')); } catch { throw new Rejection(400, 'invalid_fields'); }
    if (form.getAll('interests').length > serviceInterests.length || new Set(form.getAll('interests')).size !== form.getAll('interests').length) throw new Rejection(400, 'invalid_fields');
    const id = String(form.get('request_id') ?? ''); if (!uuid.test(id)) throw new Rejection(400, 'invalid_fields');
    const key = await hmac(env.CONTACT_RATE_HMAC_KEY, 'request:' + id);
    const digest = await hmac(env.CONTACT_RATE_HMAC_KEY, JSON.stringify({ fields, type, kind, interests: [...interests].sort() }));
    const statusResponse = (status: string) => status === 'accepted' ? reply(202, '', true) : status === 'limited' ? reply(429, 'rate_limited') : reply(409, 'check_before_resending');
    // A historical email acceptance must never acknowledge this non-storing endpoint.
    if (emailDelivery) {
      const previous = await callGuard({ op: 'lookup', key, digest });
      if (previous.status !== 'new') return statusResponse(previous.status);
    }
    const token = String(form.get('cf-turnstile-response') ?? '');
    if (!token || token.length > 2048) return reply(400, 'verification_required');
    let verification: any;
    try {
      const response = await dependencies.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
        signal: AbortSignal.timeout(policy.verifyTimeoutMs), redirect: 'error',
      });
      if (!response.ok) throw new Error('verification unavailable');
      verification = await response.json();
    } catch { return reply(503, 'verification_unavailable'); }
    const timestamp = Date.parse(verification?.challenge_ts);
    if (verification?.success !== true || verification.hostname !== new URL(origin).hostname || verification.action !== 'inquiry'
      || !Number.isFinite(timestamp) || Date.now() - timestamp > 300_000 || timestamp - Date.now() > 30_000) return reply(400, 'verification_failed');
    // Validation is not receipt: never store inquiry fields, send email or claim success.
    // Only abuse counters have been persisted. A future approved durable sink is required.
    if (!emailDelivery) return reply(503, 'submission_not_stored');
    const reservation = await callGuard({ op: 'reserve', key, digest });
    if (reservation.status !== 'reserved') return statusResponse(reservation.status);
    const complete = (status: string) => callGuard({ op: 'complete', key, digest, ticket: reservation.ticket, status });
    const labels = interests.map(value => serviceInterests.find(item => item.value === value)!.label);
    try {
      const result = await within(env.CONTACT_EMAIL!.send({
        from, to: contactFormRecipient, replyTo: fields.email,
        subject: type === 'review' ? 'ITKeepers website: free IT review request' : 'ITKeepers website: general inquiry',
        text: [`Name: ${fields.name}`, `Email: ${fields.email}`, `Company: ${fields.company}`, `Phone: ${fields.phone}`,
          `Interest: ${labels.join(', ') || 'Not specified'}`, '', fields.message].join('\n'),
      }), policy.sendTimeoutMs);
      if (!result || typeof result.messageId !== 'string' || !result.messageId.trim()) throw new Error('no acceptance');
      const saved = await complete('accepted');
      if (saved.status !== 'accepted') throw new Error('acceptance state unavailable');
      return reply(202, '', true); // Provider acceptance, never a claim of inbox delivery.
    } catch {
      try { await complete('uncertain'); } catch { /* pending reservation still blocks unsafe retries */ }
      return reply(503, 'acceptance_unconfirmed');
    }
  } catch (error) {
    return error instanceof Rejection ? reply(error.status, error.code) : reply(503, 'contact_unavailable');
  }
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (['/api/contact', '/api/inquiry'].includes(new URL(request.url).pathname)) return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};
