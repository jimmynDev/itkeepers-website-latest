// Execute only in the approved offline container. No network/browser navigation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('/opt/deps/node_modules/typescript');
const { JSDOM } = require('jsdom');
const flush = async () => { for (let i = 0; i < 4; i++) await new Promise(setImmediate); };

function fixture(mode = 'pending') {
  const html = fs.readFileSync(path.resolve('dist/contact/index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'https://itkeepers-v2-rc-20261027.jimnassar99.workers.dev/contact/',
    runScripts: 'outside-only' }); // No resource loader; page scripts never auto-run.
  const w = dom.window;
  const calls = [];
  const deadlines = new Map();
  const nativeSetTimeout = w.setTimeout.bind(w);
  w.setTimeout = (fn, delay, ...args) => {
    if (delay === 15000) { const id = Symbol('deadline'); deadlines.set(id, fn); return id; }
    return nativeSetTimeout(fn, delay, ...args);
  };
  const nativeClearTimeout = w.clearTimeout.bind(w);
  w.clearTimeout = id => { if (!deadlines.delete(id)) nativeClearTimeout(id); };
  w.fetch = (url, options) => {
    assert.equal(url, 'https://formspree.io/f/mrppzvpo');
    assert.equal(options.method, 'POST'); assert.equal(options.credentials, 'omit');
    assert.equal(options.redirect, 'error');
    return new Promise((resolve, reject) => {
      const call = { url, options, resolve, reject, aborted: false }; calls.push(call);
      options.signal.addEventListener('abort', () => {
        call.aborted = true; reject(new w.DOMException('Synthetic abort', 'AbortError'));
      }, { once: true });
      if (mode === 'network-error') reject(new Error('Synthetic network failure'));
    });
  };
  const cache = new Map();
  function load(name) {
    if (name === 'verification') return { createInquiryVerification() { throw Error('Unexpected backend activation'); } };
    if (cache.has(name)) return cache.get(name);
    const names = { inquiry: 'src/data/inquiry.ts', formspree: 'src/data/formspree.ts',
      contact: 'src/data/contact.ts', controller: 'src/scripts/contact-form.ts' };
    assert(names[name], 'Unexpected module');
    const result = {};
    const compiled = ts.transpileModule(fs.readFileSync(names[name], 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    const requireMock = value => {
      const map = { './inquiry': 'inquiry', '../data/inquiry': 'inquiry',
        '../data/formspree': 'formspree', '../data/contact': 'contact',
        './inquiry-verification': 'verification' };
      assert(map[value], 'Unexpected dependency: ' + value); return load(map[value]);
    };
    w.eval('(function(exports, require) {\n' + compiled + '\n})')(result, requireMock);
    cache.set(name, result); return result;
  }
  load('controller').initializeContactForms(w.document);
  const form = w.document.querySelector('form[data-inquiry-form]');
  const button = form.querySelector('.inquiry-submit');
  const native = form.querySelector('[data-formspree-native]');
  const status = form.querySelector('[data-inquiry-status]');
  const fallback = form.querySelector('[data-formspree-verification]');
  const field = name => form.querySelector('[name="' + name + '"]');
  function edit(name, value) { field(name).value = value; field(name).dispatchEvent(new w.Event('input', { bubbles: true })); }
  for (const [name, value] of Object.entries({ name: 'Synthetic Person', email: 'synthetic@example.test',
    company: 'Example', phone: '', message: 'Synthetic original message.' })) edit(name, value);
  function submit(submitter = button) {
    const event = new w.SubmitEvent('submit', { bubbles: true, cancelable: true, submitter });
    form.dispatchEvent(event); return event;
  }
  return { dom, w, form, button, native, status, fallback, field, edit, submit, calls, deadlines,
    reply(index, code, body, json = true) {
      calls[index].resolve(json ? Response.json(body, { status: code })
        : new Response(body, { status: code, headers: { 'Content-Type': 'text/html' } }));
    }, close() { dom.window.close(); } };
}

test('active controller rejects invalid/oversized input and honeypot before any fetch', async () => {
  for (const [field, value] of [['email', 'invalid'], ['message', 'x'.repeat(3001)], ['_gotcha', 'synthetic-bot']]) {
    const f = fixture();
    try { f.edit(field, value); f.submit(); await flush(); assert.equal(f.calls.length, 0); }
    finally { f.close(); }
  }
});

test('pending double clicks use one immutable payload; acceptance blocks repeats until editing', async () => {
  const f = fixture();
  try {
    f.submit(); f.submit(); assert.equal(f.calls.length, 1);
    assert(f.button.disabled && f.field('message').disabled);
    assert.equal(f.calls[0].options.body.get('message'), 'Synthetic original message.');
    f.field('message').value = 'Programmatic pending edit';
    const select = f.form.querySelector('[data-inquiry-intent]');
    select.value = 'ITKeepers — Free IT consultation request';
    select.dispatchEvent(new f.w.Event('change', { bubbles: true }));
    assert.equal(f.calls[0].options.body.get('type'), 'general');
    f.reply(0, 200, { ok: true }); await flush();
    assert.match(f.status.textContent, /Formspree accepted your message/);
    f.submit(); assert.equal(f.calls.length, 1);
    f.edit('message', 'Synthetic edited message.'); assert.equal(f.button.disabled, false);
    f.submit(); assert.equal(f.calls.length, 2);
    f.reply(1, 200, { ok: true }); await flush();
  } finally { f.close(); }
});

test('configured 15-second timeout aborts once, restores fields, warns about uncertainty', async () => {
  const f = fixture();
  try {
    f.submit(); assert.equal(f.deadlines.size, 1);
    [...f.deadlines.values()][0](); await flush();
    assert(f.calls[0].aborted); assert.equal(f.calls.length, 1);
    assert.equal(f.button.disabled, false); assert.equal(f.field('message').disabled, false);
    assert.equal(f.field('message').value, 'Synthetic original message.');
    assert.match(f.status.textContent, /could not confirm whether/);
    assert.equal(f.fallback.hidden, false);
  } finally { f.close(); }
});

test('verification fallback snapshots native fields, prevents repeat and restores on pageshow', async () => {
  const f = fixture();
  try {
    f.submit(); f.reply(0, 403, { errors: [{ code: 'CAPTCHA', message: 'Synthetic verification' }] }); await flush();
    assert.equal(f.fallback.hidden, false);
    const event = f.submit(f.native); assert.equal(event.defaultPrevented, false);
    const payload = new f.w.FormData(f.form);
    assert.equal(payload.get('email'), 'synthetic@example.test');
    assert.equal(payload.getAll('message').length, 1);
    assert.equal(payload.get('message'), 'Synthetic original message.');
    assert(f.button.disabled && f.native.disabled);
    assert.equal(f.submit(f.native).defaultPrevented, true);
    f.w.dispatchEvent(new f.w.Event('pageshow'));
    assert.equal(f.button.disabled, false); assert.equal(f.field('message').disabled, false);
    assert.match(f.status.textContent, /Acceptance on Formspree has not been confirmed/);
    assert.equal(f.calls.length, 1); // Synthetic submit event does not navigate/send.
  } finally { f.close(); }
});

test('hostile provider error is bounded literal text, never HTML or navigation', async () => {
  const f = fixture();
  try {
    f.submit(); f.reply(0, 422, { errors: [{ field: 'email', message: '<img src=x onerror="alert(1)">' + 'x'.repeat(600) }] });
    await flush(); const error = f.form.querySelector('[data-field-error="email"]');
    assert(error.textContent.startsWith('<img')); assert(error.textContent.length <= 400);
    assert.equal(error.querySelector('img'), null);
    assert.equal(f.w.location.pathname, '/contact/');
    assert.equal(f.w.localStorage.length + f.w.sessionStorage.length, 0);
  } finally { f.close(); }
});

test('page swap aborts in-flight work without treating it as accepted', async () => {
  const f = fixture();
  try {
    f.submit(); f.w.document.dispatchEvent(new f.w.Event('astro:before-swap')); await flush();
    assert(f.calls[0].aborted); assert.notEqual(f.status.dataset.state, 'success');
    assert.equal(f.calls.length, 1);
  } finally { f.close(); }
});

test('network failure and HTML response offer explicit fallback without automatic resend', async () => {
  for (const mode of ['network-error', 'html']) {
    const f = fixture(mode);
    try {
      f.submit(); if (mode === 'html') f.reply(0, 200, '<html>Synthetic challenge</html>', false);
      await flush(); assert.equal(f.calls.length, 1); assert.equal(f.fallback.hidden, false);
      assert.equal(f.status.dataset.state, 'error'); assert.equal(f.button.disabled, false);
    } finally { f.close(); }
  }
});

test('rate-limit reply preserves retry and never claims acceptance or auto-retries', async () => {
  const f = fixture();
  try {
    f.submit(); f.reply(0, 429, {}); await flush();
    assert.match(f.status.textContent, /limiting requests/);
    assert.equal(f.calls.length, 1); assert.equal(f.fallback.hidden, true);
    assert.equal(f.button.disabled, false); assert.equal(f.field('email').value, 'synthetic@example.test');
  } finally { f.close(); }
});
