import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('unconfigured review submission is cancelled without delivery or a success state', () => {
  const compiled = ts.transpileModule(readFileSync(new URL('../src/scripts/free-it-review.ts', import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
  }).outputText;
  let submit;
  const form = { addEventListener(name, listener) { assert.equal(name, 'submit'); submit = listener; } };
  const scope = { querySelectorAll() { return [form]; } };
  const exports = {};
  vm.runInNewContext(compiled, { exports });
  exports.guardUnconfiguredReviewForms(scope);
  let cancelled = false;
  submit({ preventDefault() { cancelled = true; } });
  assert.equal(cancelled, true);
});

test('built review form remains unavailable without JavaScript and keeps personal data out of URLs', () => {
  const html = readFileSync(new URL('../dist/contact/index.html', import.meta.url), 'utf8');
  assert.match(html, /<form\b[^>]*method="post"[^>]*action="\/contact"[^>]*data-free-it-review/);
  assert.match(html, /<button\b[^>]*type="submit"[^>]*disabled[^>]*>Book my free IT review<\/button>/);
  assert.match(html, /Online requests are currently unavailable\. This form does not send your details\./);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
});

test('all three homepage entry points share the canonical review destination', () => {
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /<a\b[^>]*class="btn hero-cta"[^>]*href="\/contact"[^>]*>Book a free IT review<\/a>/);
  assert.match(html, /<a\b[^>]*class="btn header-primary-cta"[^>]*href="\/contact"[^>]*>Talk to our team<\/a>/);
  assert.match(html, /<a\b[^>]*class="btn white"[^>]*href="\/contact"[^>]*>Book my free IT review<\/a>/);
  assert.doesNotMatch(html, /id="review-email"|id="review-booking-button"/);
});
