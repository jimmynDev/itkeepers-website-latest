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
  assert.match(contactHtml, /Prepare an email/);
  assert.match(contactHtml, /<title>Contact ITKeepers \| Talk to Our Team<\/title>/);
  assert.match(contactHtml, /<link rel="canonical" href="https:\/\/itkeepers\.com\/contact\/?"/);
  assert.equal((contactHtml.match(/"@type":"Organization"/g) ?? []).length, 1);
  assert.match(contactSource, /max-inline-size:1100px/);
  assert.match(contactSource, /@media\(max-width:900px\)/);
});

test('contact cards retain exact destinations, headings and emergency wording', () => {
  assert.match(contactHtml, />Call us<\/h2>/);
  assert.match(contactHtml, />Email our team<\/h2>/);
  assert.match(contactHtml, /href="tel:\+96181816761"/);
  assert.match(contactHtml, /href="mailto:info@itkeepers\.com"/);
  assert.match(contactHtml, /href="\/emergency\/"[^>]*>Get emergency help<\/a>/);
  assert.match(contactSource, /#FCA5A5/);
  assert.match(contactSource, /font-size:20px/);
});

test('the form remains visible without an endpoint and offers a truthful email handoff', () => {
  for (const html of [contactHtml, homeHtml]) {
    assert.match(html, /<form\b[^>]*data-inquiry-form/);
    assert.match(html, /name="type" value="(?:general|review)"/);
    if (/data-inquiry-delivery="backend"/.test(html)) {
      assert.match(html, /action="\/api\/contact"/);
      assert.doesNotMatch(html, /data-inquiry-success/);
    } else {
      assert.match(html, /action="mailto:info@itkeepers\.com"/);
      assert.match(html, /Continue to email/);
      assert.match(html, /Your email app will open\. Review and send your message there\./);
      assert.match(html, /Nothing is sent by this website\./);
      assert.doesNotMatch(html, /data-inquiry-success|Message sent\.|message has been received/);
    }
    assert.doesNotMatch(html, /Online requests are unavailable|data-inquiry-unavailable|inquiry-direct-actions/);
    assert.doesNotMatch(html, /<button[^>]*type="submit"[^>]*disabled/);
  }
  assert.match(formTemplate, /PUBLIC_CONTACT_FORM_ENDPOINT/);
  assert.match(formTemplate, /same-origin API route/);
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
  assert.match(hero, /href="\/contact\/\?type=review"/);
  assert.match(navigation, /\/contact\/\?type=review/);
  assert.doesNotMatch(hero + navigation, /\/contact\/\?intent=review/);
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

test('contact API remains fail-closed without durable storage or delivery', () => {
  assert.match(formScript, /fetch\(endpoint/);
  assert.match(formScript, /new FormData\(form\)/);
  assert.match(formScript, /inquiryEndpoint\(action\) === '\/api\/contact'/);
  assert.match(formScript, /submission_not_stored/);
  assert.match(formScript, /Your message has not been saved or sent/);
  assert.match(formScript, /We could not confirm acceptance/);
  assert.doesNotMatch(formScript, /live\.hidden = true|success\.hidden = false/);
  assert.doesNotMatch(formTemplate, /data-inquiry-success|Accepted for sending|email service accepted/);
  assert.doesNotMatch(formScript, /localStorage|sessionStorage|innerHTML|sendBeacon|XMLHttpRequest/);
});

const emailFields = { name:'Example Person',email:'person@example.com',company:'Example & Co',phone:'+961 81 000 000',message:'First line\nSecond line: café & cloud? #priority' };
test('email composition includes completed fields and readable selected service labels', () => {
  const draft = new URL(api.composeInquiryEmail('info@itkeepers.com', emailFields, 'general', ['managed-it','microsoft-cloud']));
  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, 'info@itkeepers.com');
  assert.equal(draft.searchParams.get('subject'), 'General inquiry');
  const body = draft.searchParams.get('body');
  for (const text of ['Full name: Example Person','Work email: person@example.com','Company: Example & Co','Phone: +961 81 000 000','Inquiry type: general','Interested in: Managed IT, Microsoft 365 and Cloud','First line\r\nSecond line: café & cloud? #priority']) assert.ok(body.includes(text));
  assert.equal([...draft.searchParams].length, 2);
});

test('review email composition keeps the review intent and omits empty optional fields', () => {
  const draft = new URL(api.composeInquiryEmail('info@itkeepers.com', {...emailFields,company:' ',phone:'',message:"I'd like a free IT review."}, 'review', []));
  assert.equal(draft.searchParams.get('subject'), 'Free IT review request');
  assert.match(draft.searchParams.get('body'), /Inquiry type: review/);
  assert.match(draft.searchParams.get('body'), /I'd like a free IT review\./);
  assert.doesNotMatch(draft.searchParams.get('body'), /Company:|Phone:|Interested in:/);
});

test('visitor text cannot add mail recipients or headers and interests remain validated', () => {
  const draft = new URL(api.composeInquiryEmail('info@itkeepers.com', {...emailFields,name:'Example\r\nBcc: someone@example.com',message:'?subject=changed&bcc=someone@example.com'}, 'general', ['not-sure']));
  assert.equal(draft.pathname, 'info@itkeepers.com');
  assert.equal(draft.searchParams.get('subject'), 'General inquiry');
  assert.equal(draft.searchParams.has('bcc'), false);
  assert.match(draft.searchParams.get('body'), /Interested in: Not sure yet/);
  assert.throws(() => api.composeInquiryEmail('info@itkeepers.com', emailFields, 'general', ['unknown']), /Unsupported/);
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
