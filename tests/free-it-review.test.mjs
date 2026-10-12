import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const contactHtml = read('dist/contact/index.html');
const homeHtml = read('dist/index.html');
const formTemplate = read('src/components/InquiryForm.astro');
const formScript = read('src/scripts/contact-form.ts');
const formCss = read('src/styles/inquiry-form.css');
const contactSource = read('src/pages/contact.astro');
const navigation = read('src/data/navigation.ts');
const hero = read('src/components/Hero.astro');
const compile = source => ts.transpileModule(source, { compilerOptions: { target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.CommonJS } }).outputText;
const context = { exports:{} };
vm.runInNewContext(compile(read('src/data/inquiry.ts')), context);
const api = context.exports;

test('contact route has the approved heading hierarchy and updated metadata', () => {
  assert.equal([...contactHtml.matchAll(/<h1\b/g)].length, 1);
  assert.match(contactHtml, />Talk to our team\.<\/h1>/);
  assert.match(contactHtml, /Send us a message/);
  assert.match(contactHtml, /<title>Contact ITKeepers \| Talk to Our Team<\/title>/);
  assert.match(contactHtml, /<link rel="canonical" href="https:\/\/itkeepers\.com\/contact\/?"/);
  assert.equal((contactHtml.match(/"@type":"Organization"/g) ?? []).length, 1);
  assert.match(contactSource, /max-inline-size:1100px/);
  assert.match(contactSource, /@media\(max-width:900px\)/);
});

test('contact cards retain exact destinations, headings and emergency wording', () => {
  assert.match(contactHtml, />Call us<\/h2>/);
  assert.match(contactHtml, />Write to us\.<\/h2>/);
  assert.match(contactHtml, /href="tel:\+96181816761"/);
  assert.match(contactHtml, /href="mailto:info@itkeepers\.com"/);
  assert.match(contactHtml, /href="\/emergency\/"[^>]*>Get emergency help<\/a>/);
  assert.match(contactSource, /#FCA5A5/);
  assert.match(contactSource, /font-size:20px/);
});

test('no endpoint means a visible email/call fallback, not a disabled form', () => {
  for (const html of [contactHtml, homeHtml]) {
    const configured = /<form\b[^>]*data-inquiry-form/.test(html);
    if (!configured) {
      assert.match(html, /Online requests are unavailable/);
      assert.match(html, /href="mailto:info@itkeepers\.com"/);
      assert.match(html, /href="tel:\+96181816761"/);
      assert.doesNotMatch(html, /<button[^>]*disabled[^>]*type="submit"/);
    } else {
      assert.match(html, /name="type" value="(?:general|review)"/);
      assert.match(html, /data-inquiry-success/);
      assert.match(html, /data-inquiry-unavailable/);
      assert.doesNotMatch(html, /<button[^>]*type="submit"[^>]*disabled/);
    }
  }
  assert.match(formTemplate, /PUBLIC_CONTACT_FORM_ENDPOINT/);
  assert.match(formTemplate, /same-origin API route/);
  assert.match(formTemplate, /data-inquiry-unavailable/);
});

test('form source requires name, email and message; company and phone remain optional', () => {
  for (const name of ['name','email','company','phone']) assert.ok(formTemplate.includes("'" + name + "'"));
  assert.match(formTemplate, /<textarea[^>]*name="message"[^>]*required/);
  assert.match(formTemplate, /name === 'name' \|\| name === 'email'/);
  assert.match(formTemplate, /name="type" value=\{compact \? 'review' : 'general'\}/);
  assert.doesNotMatch(formTemplate, /Inquiry purpose|inquiry-purpose|type="radio"/);
  assert.match(formTemplate, /How can we help\?/);
  assert.match(formTemplate, /passwords, account credentials/);
  assert.match(formTemplate, /Privacy notice/);
  assert.match(formTemplate, /"what happens next" response-time/);
});

test('the review path uses type=review throughout site entry points', () => {
  assert.match(hero, /href="\/contact\?type=review"/);
  assert.match(navigation, /\/contact\?type=review/);
  assert.doesNotMatch(hero + navigation, /\/contact\?intent=review/);
  assert.match(formScript, /searchParams\.get\('type'\)/);
  assert.match(formScript, /I'd like a free IT review\./);
  assert.match(formScript, /intentInput\.value = intent/);
  assert.equal(api.normalizeContactIntent('review'), 'review');
  assert.equal(api.normalizeContactIntent('unknown'), 'general');
});

test('exactly eight optional interests have accessible toggles and no unselected icon gap', () => {
  assert.equal(api.serviceInterests.length, 8);
  for (const option of api.serviceInterests) assert.ok(formTemplate.includes("data-interest={item.value}"));
  assert.match(formTemplate, /aria-pressed="false"/);
  assert.match(formTemplate, /<details class="inquiry-details">/);
  assert.match(formTemplate, /Add details \(optional\)/);
  assert.match(formCss, /interest-chip-mark \{ display:none/);
  assert.match(formCss, /\[aria-pressed="true"\] \.interest-chip-mark \{ display:inline/);
  assert.match(formScript, /syncChips/);
  assert.deepEqual([...api.validateServiceInterests(['managed-it','cybersecurity','managed-it'])], ['managed-it','cybersecurity']);
  assert.throws(() => api.validateServiceInterests(['not-sure','managed-it']), /Choose services/);
  assert.throws(() => api.validateServiceInterests(['unknown']), /Unsupported/);
});

test('inline errors are accessible and required/optional limits remain enforced', () => {
  assert.match(formTemplate, /aria-describedby=\{id \+ '-' \+ name \+ '-error'\}/);
  assert.match(formTemplate, /data-field-error=\{name\}/);
  assert.match(formScript, /aria-invalid/);
  assert.match(formScript, /invalid\[0\]\.focus\(\)/);
  for (const field of ['name','email','message']) assert.notEqual(api.contactFieldError(field, ' '), '');
  for (const field of ['company','phone']) assert.equal(api.contactFieldError(field, ''), '');
  assert.match(api.contactFieldError('email', 'wrong', true), /valid email/);
  for (const [field,limit] of Object.entries(api.inquiryLimits)) {
    assert.equal(api.contactFieldError(field, 'x'.repeat(limit)), '');
    assert.match(api.contactFieldError(field, 'x'.repeat(limit+1)), /characters/);
  }
  assert.match(formCss, /\.inquiry-help,\.inquiry-privacy \{[^}]*font-size:14px/);
  assert.match(formCss, /\.inquiry-error,\.inquiry-status \{[^}]*font-size:14px/);
});

test('submission only succeeds with confirmed JSON and otherwise swaps to live fallback', () => {
  assert.match(formScript, /fetch\(endpoint/);
  assert.match(formScript, /new FormData\(form\)/);
  assert.match(formScript, /response\.ok && isJson/);
  assert.match(formScript, /result\.ok !== true/);
  assert.match(formScript, /live\.hidden = true/);
  assert.match(formScript, /success\.hidden = false/);
  assert.match(formScript, /unavailable\.hidden = false/);
  assert.match(formScript, /Your message was not sent/);
  assert.doesNotMatch(formScript, /localStorage|sessionStorage|innerHTML|sendBeacon|XMLHttpRequest/);
});

test('submit stays cyan and interactive, with responsive layouts and light/forced-color options', () => {
  assert.match(formCss, /background:var\(--itk-brand-cyan\); color:#071525/);
  assert.match(formCss, /border-radius:999px/);
  assert.match(formCss, /@media\(max-width:600px\)/);
  assert.match(formCss, /\[data-theme="light"\]/);
  assert.match(formCss, /forced-colors:active/);
  assert.match(contactSource, /grid-template-columns:minmax\(0,1\.5fr\) minmax\(0,1fr\)/);
  assert.match(contactSource, /\.contact-information \{ order:0/);
  assert.match(contactSource, /\.contact-form-panel \{ order:1/);
});
