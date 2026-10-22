import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/data/inquiry.ts', import.meta.url), 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText, context);
const { inquiryEndpoint } = context.exports;

test('optional inquiry endpoint rejects external URLs, URL tricks and the contact page', () => {
  for (const value of [undefined, null, 42, '', '/', '/contact', '/contact/', '/CONTACT//',
    'https://example.com/api', '//example.com/api', '/\\example.com', '/api/../contact',
    '/api/%2e%2e/contact', '/api/contact?to=other', '/api/contact#other', '/api/contact\nX-Test: yes']) {
    assert.equal(inquiryEndpoint(value), null, String(value));
  }
});

test('optional inquiry endpoint accepts an explicit same-origin delivery route', () => {
  for (const value of ['/api/inquiry', '/api/inquiry/', '/contact-submit']) {
    assert.equal(inquiryEndpoint(value), value);
  }
  assert.equal(inquiryEndpoint(' /api/inquiry '), '/api/inquiry');
});
