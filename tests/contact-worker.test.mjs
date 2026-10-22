import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';
import { contactHeaders } from '../scripts/contact-build-headers.mjs';
const root = new URL('../', import.meta.url);
const cache = new Map();
function load(file) {
  file = path.resolve(file); if (cache.has(file)) return cache.get(file);
  const module = { exports: {} }; cache.set(file, module.exports);
  const context = { module, exports: module.exports, require: name => load(path.resolve(path.dirname(file), name + '.ts')),
    fetch: async () => { throw new Error('Unexpected external request in unit test'); },
    Request, Response, FormData, crypto: webcrypto, URL, TextEncoder, AbortSignal, Uint8Array, ArrayBuffer, Date, setTimeout, clearTimeout };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, context, { filename: file });
  return module.exports;
}
const { handleContact, handleInquiry, InquiryGuard, default: worker } = load(fileURLToPath(new URL('worker/index.ts', root)));
class Storage {
  data = new Map(); queue = Promise.resolve(); alarm;
  async get(key) { return structuredClone(this.data.get(key)); }
  async put(key, value) { this.data.set(key, structuredClone(value)); }
  async setAlarm(value) { this.alarm = value; }
  async deleteAlarm() { this.alarm = undefined; }
  transaction(fn) { const task = this.queue.then(() => fn(this)); this.queue = task.catch(() => {}); return task; }
}
function fixture(options = {}) {
  const storage = new Storage(); const guard = new InquiryGuard({ storage }); const calls = { verify: 0, email: 0, messages: [] };
  const env = { CONTACT_DELIVERY_ENABLED: 'true', CONTACT_ALLOWED_ORIGIN: 'https://itkeepers.com', CONTACT_EMAIL_FROM: 'website@itkeepers.com',
    TURNSTILE_SECRET_KEY: 'synthetic-unit-secret', CONTACT_RATE_HMAC_KEY: 'synthetic-unit-key-not-a-real-secret-32',
    CONTACT_GUARD: { idFromName: n => n, get: () => guard },
    CONTACT_EMAIL: { async send(message) { calls.email++; calls.messages.push(message); if (options.send) return options.send(message); return { messageId: 'synthetic-provider-acceptance' }; } } };
  const deps = { async fetch(url, init) { calls.verify++; assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify'); const body = JSON.parse(init.body); assert.equal(body.secret, env.TURNSTILE_SECRET_KEY); assert.equal(body.remoteip, undefined); return options.verify ? options.verify(url, init) : Response.json({ success: true, hostname: 'itkeepers.com', action: 'inquiry', challenge_ts: new Date().toISOString() }); } };
  return { env, deps, calls, storage, guard };
}
const defaults = () => ({ name: 'QA Test', email: 'qa@example.test', company: '', phone: '', message: 'Synthetic local inquiry only.', type: 'general', form_kind: 'contact', website: '', request_id: webcrypto.randomUUID(), 'cf-turnstile-response': 'synthetic-token' });
function request(fields = defaults(), headers = {}, url = 'https://itkeepers.com/api/inquiry') {
  const body = new FormData(); for (const [key, value] of Object.entries(fields)) for (const v of Array.isArray(value) ? value : [value]) body.append(key, v);
  return new Request(url, { method: 'POST', body, headers: { Origin: 'https://itkeepers.com', 'Sec-Fetch-Site': 'same-origin', 'CF-Connecting-IP': '192.0.2.10', ...headers } });
}
async function send(f, fields, headers, url) { return handleInquiry(request(fields, headers, url), f.env, f.deps); }
async function checkReply(response, status) {
  assert.equal(response.status, status); assert.equal(response.headers.get('cache-control'), 'no-store'); assert.match(response.headers.get('x-robots-tag'), /noindex/);
  assert.equal(response.headers.get('access-control-allow-origin'), null); assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  const body = await response.json(); assert.equal(body.ok, status === 202); return body;
}
test('disabled or incomplete delivery rejects before body, storage, verification or email', async () => {
  for (const override of [{ CONTACT_DELIVERY_ENABLED: 'false' }, { CONTACT_EMAIL: undefined }, { TURNSTILE_SECRET_KEY: '' }, { CONTACT_EMAIL_FROM: 'someone@example.test' }, { CONTACT_RATE_HMAC_KEY: 'short' }]) {
    const f = fixture(); Object.assign(f.env, override); await checkReply(await send(f), 503); assert.equal(f.calls.verify, 0); assert.equal(f.calls.email, 0); assert.equal(f.storage.data.size, 0);
  }
});
test('only POST, exact same origin and bounded multipart requests are accepted', async () => {
  const f = fixture(); for (const method of ['GET', 'OPTIONS', 'PUT']) await checkReply(await handleInquiry(new Request('https://itkeepers.com/api/inquiry', { method }), f.env, f.deps), 405);
  for (const headers of [{ Origin: 'null' }, { Origin: 'https://evil.test' }, { 'Sec-Fetch-Site': 'cross-site' }]) await checkReply(await send(f, defaults(), headers), 403);
  const missing = request(); missing.headers.delete('origin'); await checkReply(await handleInquiry(missing, f.env, f.deps), 403);
  await checkReply(await handleInquiry(new Request('https://itkeepers.com/api/inquiry', { method: 'POST', body: '{}', headers: { Origin: 'https://itkeepers.com', 'Content-Type': 'application/json' } }), f.env, f.deps), 415);
  await checkReply(await send(f, defaults(), { 'Content-Length': '20000' }), 413); assert.equal(f.calls.email, 0);
});
test('streaming body byte limit applies even without Content-Length', async () => {
  const f = fixture(); const r = new Request('https://itkeepers.com/api/inquiry', { method: 'POST', body: new ReadableStream({ start(c) { c.enqueue(new Uint8Array(17000)); c.close(); } }), duplex: 'half', headers: { Origin: 'https://itkeepers.com', 'Content-Type': 'multipart/form-data; boundary=synthetic', 'CF-Connecting-IP': '192.0.2.10' } });
  await checkReply(await handleInquiry(r, f.env, f.deps), 413); assert.equal(f.calls.verify, 0); assert.equal(f.calls.email, 0);
});
test('server rejects invalid fields, controls, duplicate/unknown fields, files and contradictory interests', async () => {
  const cases = [{ name: '' }, { email: 'not-an-email' }, { email: 'qa@example.test\r\nBcc: bad@example.test' }, { name: 'A\nB' }, { message: '\0test' }, { message: '' }, { message: 'a'.repeat(3001) }, { website: 'bot' }, { request_id: 'not-a-uuid' }, { to: 'other@example.test' }, { type: 'other' }, { form_kind: 'review' }, { interests: ['not-sure', 'managed-it'] }, { interests: ['managed-it', 'managed-it'] }, { interests: ['other'] }, { email: ['qa@example.test', 'other@example.test'] }];
  for (const fields of cases) { const f = fixture(); await checkReply(await send(f, { ...defaults(), ...fields }), 400); assert.equal(f.calls.email, 0); }
  const f = fixture(); const r = request(); const body = await r.formData(); body.set('message', new Blob(['file']), 'file.txt'); await checkReply(await handleInquiry(new Request(r.url, { method: 'POST', headers: { Origin: 'https://itkeepers.com', 'CF-Connecting-IP': '192.0.2.10' }, body }), f.env, f.deps), 400);
});
test('Turnstile requires success, expected hostname/action and fresh timestamp', async () => {
  for (const patch of [{ success: false }, { hostname: 'evil.test' }, { action: 'other' }, { challenge_ts: 'bad' }, { challenge_ts: new Date(Date.now() - 301000).toISOString() }, { challenge_ts: new Date(Date.now() + 60000).toISOString() }]) {
    const f = fixture({ verify: () => Response.json({ success: true, hostname: 'itkeepers.com', action: 'inquiry', challenge_ts: new Date().toISOString(), ...patch }) }); await checkReply(await send(f), 400); assert.equal(f.calls.email, 0);
  }
  const f = fixture(); await checkReply(await send(f, { ...defaults(), 'cf-turnstile-response': '' }), 400); assert.equal(f.calls.verify, 0);
});
test('verification dependency failure and unavailable guard fail closed', async () => {
  for (const verify of [() => { throw new Error('synthetic-secret-do-not-echo'); }, () => new Response('unavailable', { status: 503 }), () => new Response('not json')]) {
    const f = fixture({ verify }); const body = await checkReply(await send(f), 503); assert.equal(f.calls.email, 0); assert(!JSON.stringify(body).includes('synthetic-secret'));
  }
  const f = fixture(); f.env.CONTACT_GUARD.get = () => { throw new Error('private'); }; await checkReply(await send(f), 503); assert.equal(f.calls.email, 0);
});
test('provider acceptance uses only fixed destination/sender, safe Reply-To, text body; response never claims inbox delivery', async () => {
  const f = fixture(); const response = await send(f, { ...defaults(), name: 'QA عربى', message: '<script>alert(1)</script>\nSecond line', interests: ['managed-it'] });
  assert.deepEqual(await checkReply(response, 202), { ok: true, status: 'accepted' });
  const m = f.calls.messages[0]; assert.equal(m.to, 'info@itkeepers.com'); assert.equal(m.from, 'website@itkeepers.com'); assert.equal(m.replyTo, 'qa@example.test'); assert.equal(m.html, undefined); assert.match(m.text, /QA عربى/); assert.match(m.text, /<script>/); assert.match(m.text, /Managed IT/);
});
test('provider failure/empty acceptance yields safe failure and prevents automatic duplicate send', async () => {
  for (const send of [() => { throw new Error('raw-private-provider-error'); }, () => undefined, () => ({ messageId: '' })]) {
    const f = fixture({ send }); const data = defaults(); const body = await checkReply(await sendRequest(f, data), 503); assert.equal(body.code, 'acceptance_unconfirmed'); assert(!JSON.stringify(body).includes('private'));
    await checkReply(await sendRequest(f, data), 409); assert.equal(f.calls.email, 1);
  }
  function sendRequest(f, data) { return send(f, data); }
});
test('same request ID is idempotent across IP changes, cannot be reused for changed content', async () => {
  const f = fixture(); const data = defaults(); await checkReply(await send(f, data), 202); await checkReply(await send(f, data, { 'CF-Connecting-IP': '192.0.2.11' }), 202); assert.equal(f.calls.email, 1); assert.equal(f.calls.verify, 1);
  await checkReply(await send(f, { ...data, message: 'Different' }), 409); assert.equal(f.calls.email, 1);
});
test('simultaneous submissions reserve exactly one outbound attempt', async () => {
  const f = fixture({ send: () => new Promise(resolve => setTimeout(() => resolve({ messageId: 'mock' }), 25)) }); const data = defaults(); const responses = await Promise.all([send(f, data), send(f, data)]); assert.equal(f.calls.email, 1); assert(responses.every(r => [202, 409].includes(r.status)));
});
test('shared abuse admission and outbound quotas apply; arbitrary forwarded IP cannot replace platform identity', async () => {
  const f = fixture(); for (let i = 0; i < 5; i++) await checkReply(await send(f), 202); await checkReply(await send(f, defaults(), { 'X-Forwarded-For': '203.0.113.99' }), 429);
  const r = request(); r.headers.delete('cf-connecting-ip'); await checkReply(await handleInquiry(r, f.env, f.deps), 503);
  const g = fixture(); const invoke = data => g.guard.fetch(new Request('https://guard.internal/', { method: 'POST', body: JSON.stringify(data) })).then(r => r.json());
  for (let i = 0; i < 100; i++) assert.equal((await invoke({ op: 'reserve', key: i.toString(16).padStart(64, '0'), digest: 'a'.repeat(64) })).status, 'reserved');
  assert.equal((await invoke({ op: 'reserve', key: 'f'.repeat(64), digest: 'a'.repeat(64) })).status, 'limited');
});
test('guard persists no raw inquiry/IP/token and expiry cleanup removes records', async () => {
  const f = fixture(); await send(f); const stored = JSON.stringify([...f.storage.data]); for (const value of ['QA Test', 'qa@example.test', '192.0.2.10', 'synthetic-token', 'Synthetic local inquiry']) assert(!stored.includes(value));
  const data = await f.storage.get('guard'); for (const entry of [...Object.values(data.requests), ...Object.values(data.counters)]) entry.expires = Date.now() - 1; await f.storage.put('guard', data); await f.guard.alarm(); const cleaned = await f.storage.get('guard'); assert.equal(Object.keys(cleaned.requests).length + Object.keys(cleaned.counters).length, 0); assert.equal(f.storage.alarm, undefined);
});
test('non-API routes still delegate to static assets; CSP remains unchanged in disabled builds', async () => {
  const f = fixture(); const response = await worker.fetch(new Request('https://itkeepers.com/about/'), { ASSETS: { fetch: () => new Response('asset') } }); assert.equal(await response.text(), 'asset');
  const headers = fs.readFileSync(new URL('public/_headers', root), 'utf8'); assert.equal(contactHeaders(headers, false), headers); const enabled = contactHeaders(headers, true); assert.match(enabled, /script-src 'self' https:\/\/challenges.cloudflare.com/); assert.match(enabled, /frame-src https:\/\/challenges.cloudflare.com/); assert(!enabled.includes('unsafe-eval'));
});

test('body, verification and provider timeouts reject safely without creating a second delivery', async () => {
  await Promise.all([
    (async () => {
      const f = fixture({ send: () => new Promise(() => {}) }); const data = defaults(); await checkReply(await send(f, data), 503); await checkReply(await send(f, data), 409); assert.equal(f.calls.email, 1);
    })(),
    (async () => {
      const f = fixture({ verify: (url, init) => new Promise((resolve, reject) => init.signal.addEventListener('abort', () => reject(new Error('mock timeout')), { once: true })) }); await checkReply(await send(f), 503); assert.equal(f.calls.email, 0);
    })(),
    (async () => {
      const f = fixture(); const r = new Request('https://itkeepers.com/api/inquiry', { method: 'POST', body: new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('--synthetic\r\n')); } }), duplex: 'half', headers: { Origin: 'https://itkeepers.com', 'Content-Type': 'multipart/form-data; boundary=synthetic', 'CF-Connecting-IP': '192.0.2.10' } }); await checkReply(await handleInquiry(r, f.env, f.deps), 408); assert.equal(f.calls.email, 0);
    })(),
  ]);
});

test('global admission limit coordinates different clients and survives guard reinstantiation', async () => {
  const f = fixture(); const invoke = (guard, client) => guard.fetch(new Request('https://guard.internal/', { method: 'POST', body: JSON.stringify({ op: 'attempt', client }) })).then(r => r.json());
  for (let i = 0; i < 100; i++) assert.equal((await invoke(f.guard, i.toString(16).padStart(64, '0'))).status, 'allowed');
  const restarted = new InquiryGuard({ storage: f.storage }); assert.equal((await invoke(restarted, 'f'.repeat(64))).status, 'limited');
});

test('a verifier that rejects a reused token cannot authorize a second request ID', async () => {
  const seen = new Set(); const f = fixture({ verify: (url, init) => { const token = JSON.parse(init.body).response; const success = !seen.has(token); seen.add(token); return Response.json({ success, hostname: 'itkeepers.com', action: 'inquiry', challenge_ts: new Date().toISOString() }); } });
  await checkReply(await send(f), 202); await checkReply(await send(f), 400); assert.equal(f.calls.email, 1); assert.equal(f.calls.verify, 2);
});

test('Phase 5.4 native binding and handler share the owner-confirmed fixed recipient while delivery stays off', () => {
  const { contactFormRecipient } = load(fileURLToPath(new URL('src/data/contact.ts', root)));
  assert.equal(contactFormRecipient, 'info@itkeepers.com');
  const config = fs.readFileSync(new URL('wrangler.toml', root), 'utf8');
  const bindings = [...config.matchAll(/^\[\[send_email\]\]([\s\S]*?)(?=^\[|$(?![\s\S]))/gm)];
  assert.equal(bindings.length, 1);
  assert.match(bindings[0][1], /^name\s*=\s*"CONTACT_EMAIL"/m);
  assert.match(bindings[0][1], /^destination_address\s*=\s*"info@itkeepers\.com"/m);
  assert.match(bindings[0][1], /^remote\s*=\s*false/m);
  assert.match(config, /^CONTACT_DELIVERY_ENABLED\s*=\s*"false"/m);
  assert.doesNotMatch(config, /^CONTACT_EMAIL_FROM\s*=/m, 'Do not invent an authenticated sender');
  assert.doesNotMatch(config, /^(?:TURNSTILE_SECRET_KEY|CONTACT_RATE_HMAC_KEY)\s*=/m, 'Secrets are not plaintext config');
});

test('visitor envelope overrides cannot change recipient, sender, CC/BCC or Reply-To', async () => {
  for (const field of ['to', 'from', 'cc', 'bcc', 'replyTo', 'recipient']) {
    const f = fixture(); await checkReply(await send(f, { ...defaults(), [field]: 'other@example.test' }), 400); assert.equal(f.calls.email, 0);
  }
});

test('missing or provider-unauthenticated sender cannot produce acceptance', async () => {
  const missing = fixture(); delete missing.env.CONTACT_EMAIL_FROM;
  await checkReply(await send(missing), 503); assert.equal(missing.calls.verify, 0); assert.equal(missing.calls.email, 0);
  const rejected = fixture({ send: () => { throw Object.assign(new Error('synthetic auth rejection'), { code: 'E_SENDER_DOMAIN_NOT_AVAILABLE' }); } });
  const result = await checkReply(await send(rejected), 503); assert.equal(result.code, 'acceptance_unconfirmed'); assert.equal(result.ok, false);
  assert(!JSON.stringify(result).includes('E_SENDER_DOMAIN_NOT_AVAILABLE'));
});


test('/api/contact is configured and both API routes cannot invoke deferred email delivery', async () => {
  const config = fs.readFileSync(new URL('wrangler.toml', root), 'utf8');
  assert.match(config, /run_worker_first = \["\/api\/contact", "\/api\/inquiry"\]/);
  assert.match(config, /^CONTACT_VALIDATION_ENABLED\s*=\s*"false"/m);
  for (const route of ['/api/contact', '/api/inquiry']) {
    const f = fixture(); // Historical delivery flag is true: still must not enable collection/email.
    const r = request(defaults(), {}, 'https://itkeepers.com' + route);
    const body = await checkReply(await worker.fetch(r, f.env), 503);
    assert.equal(body.code, 'contact_unavailable'); assert.equal(r.bodyUsed, false);
    assert.equal(f.calls.verify, 0); assert.equal(f.calls.email, 0); assert.equal(f.storage.data.size, 0);
    f.env.CONTACT_VALIDATION_ENABLED = 'true';
    // The VM's external fetch stub fails closed. Even with validation enabled and a
    // configured email mock, public routing must never fall through to email send.
    const enabled = await checkReply(await worker.fetch(request(defaults(), {}, 'https://itkeepers.com' + route), f.env), 503);
    assert.equal(enabled.code, 'verification_unavailable'); assert.equal(f.calls.email, 0);
  }
});

function contactFixture(options) {
  const f = fixture(options); f.env.CONTACT_VALIDATION_ENABLED = 'true';
  delete f.env.CONTACT_EMAIL_FROM; delete f.env.CONTACT_EMAIL;
  return f;
}
const submitContact = (f, fields, headers) => handleContact(request(fields, headers, 'https://itkeepers.com/api/contact'), f.env, f.deps);

test('validated contact reaches Worker without email configuration and explicitly refuses receipt', async () => {
  const f = contactFixture(); const body = await checkReply(await submitContact(f), 503);
  assert.deepEqual(body, { ok: false, code: 'submission_not_stored' });
  assert.equal(f.calls.verify, 1); assert.equal(f.calls.email, 0);
  const state = await f.storage.get('guard'); assert.equal(Object.keys(state.requests).length, 0);
  assert(state.counters.global); // Abuse metadata is not durable inquiry storage.
  const stored = JSON.stringify([...f.storage.data]);
  for (const value of ['QA Test', 'qa@example.test', '192.0.2.10', 'synthetic-token', 'Synthetic local inquiry']) assert(!stored.includes(value));
});

test('contact retains schema, honeypot, envelope, origin, method and byte restrictions', async () => {
  for (const fields of [{ email: 'bad' }, { name: '' }, { message: '' }, { website: 'bot' }, { to: 'other@example.test' }, { message: 'a'.repeat(3001) }, { email: ['qa@example.test', 'other@example.test'] }, { interests: ['not-sure', 'managed-it'] }]) {
    const f = contactFixture(); await checkReply(await submitContact(f, { ...defaults(), ...fields }), 400); assert.equal(f.calls.verify, 0);
  }
  const f = contactFixture(); await checkReply(await submitContact(f, defaults(), { Origin: 'https://evil.test' }), 403);
  await checkReply(await submitContact(f, defaults(), { 'Sec-Fetch-Site': 'cross-site' }), 403);
  await checkReply(await submitContact(f, defaults(), { 'Content-Length': '20000' }), 413);
  for (const method of ['GET', 'OPTIONS', 'PUT']) await checkReply(await handleContact(new Request('https://itkeepers.com/api/contact', { method }), f.env, f.deps), 405);
  const json = new Request('https://itkeepers.com/api/contact', { method: 'POST', body: '{}', headers: { Origin: 'https://itkeepers.com', 'Content-Type': 'application/json' } });
  await checkReply(await handleContact(json, f.env, f.deps), 415);
});

test('contact retains Turnstile hostname/action/expiry checks and fails closed on dependency loss', async () => {
  for (const patch of [{ success: false }, { hostname: 'evil.test' }, { action: 'other' }, { challenge_ts: new Date(Date.now() - 301000).toISOString() }]) {
    const f = contactFixture({ verify: () => Response.json({ success: true, hostname: 'itkeepers.com', action: 'inquiry', challenge_ts: new Date().toISOString(), ...patch }) });
    await checkReply(await submitContact(f), 400);
  }
  const missing = contactFixture(); await checkReply(await submitContact(missing, { ...defaults(), 'cf-turnstile-response': '' }), 400);
  const failed = contactFixture({ verify: () => { throw new Error('private-verifier-detail'); } });
  assert.equal((await checkReply(await submitContact(failed), 503)).code, 'verification_unavailable');
  const guard = contactFixture(); guard.env.CONTACT_GUARD.get = () => { throw new Error('private-guard-detail'); };
  assert.equal((await checkReply(await submitContact(guard), 503)).code, 'contact_unavailable'); assert.equal(guard.calls.verify, 0);
});

test('contact retains per-client/global admission limits and cannot reuse legacy accepted state', async () => {
  const f = contactFixture(); for (let i = 0; i < 5; i++) await checkReply(await submitContact(f), 503);
  await checkReply(await submitContact(f, defaults(), { 'X-Forwarded-For': '203.0.113.99' }), 429); assert.equal(f.calls.verify, 5);
  const original = fixture(); const fields = defaults(); await checkReply(await send(original, fields), 202);
  original.env.CONTACT_VALIDATION_ENABLED = 'true';
  assert.equal((await checkReply(await submitContact(original, fields), 503)).code, 'submission_not_stored'); assert.equal(original.calls.email, 1);
  const global = contactFixture();
  for (let i = 0; i < 100; i++) await checkReply(await submitContact(global, defaults(), { 'CF-Connecting-IP': '192.0.2.' + (i + 1) }), 503);
  await checkReply(await submitContact(global, defaults(), { 'CF-Connecting-IP': '192.0.2.200' }), 429);
});
