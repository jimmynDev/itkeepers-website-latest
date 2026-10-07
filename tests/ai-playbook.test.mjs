import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../src/scripts/ai-playbook.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;

function fixture() {
  const listeners = object => Object.assign(object, { handlers: {}, addEventListener(name, fn) { (this.handlers[name] ??= new Set()).add(fn); }, removeEventListener(name, fn) { this.handlers[name]?.delete(fn); }, emit(name) { this.handlers[name]?.forEach(fn => fn()); } });
  let document;
  class Element {
    isConnected = true;
    top = 300;
    inMain = true;
    getBoundingClientRect() { return { top: this.top, bottom: this.top + 44, left: 20, right: 220, width: 200, height: 44 }; }
    closest(selector) { return selector === 'main' && this.inMain ? {} : null; }
    focus() { document.activeElement = this; }
  }
  const original = new Element(), fallback = new Element(), close = listeners(new Element());
  fallback.top = 450;
  const styles = new Map(), frames = [];
  const card = { dataset: {}, hidden: true, inert: false, style: { setProperty(name, value) { styles.set(name, value); } }, classList: { add() {} }, querySelector() { return close; }, contains(element) { return element === close; }, getBoundingClientRect() { return { left: 100, right: 480, top: 500, width: 380, height: 250 }; }, dispatchEvent() {} };
  document = listeners({ activeElement: original, body: {}, documentElement: { scrollHeight: 5000 }, querySelector(selector) { return selector === '.playbook-card' ? card : null; }, querySelectorAll(selector) { return selector.startsWith('a[href]') || selector.startsWith('a,button') ? [original, fallback] : []; } });
  const window = listeners({ innerHeight: 900, innerWidth: 1440, location: { pathname: '/' }, matchMedia() { return { matches: true }; } });
  const timers = new Map();
  let next = 0;
  vm.runInNewContext(source, { document, window, HTMLElement: Element, localStorage: { getItem() { return '{}'; }, setItem() {} }, Date, getComputedStyle() { return { display: 'block', visibility: 'visible', position: 'static' }; }, setTimeout(fn) { timers.set(++next, fn); return next; }, clearTimeout(id) { timers.delete(id); }, requestAnimationFrame(fn) { frames.push(fn); return frames.length; }, cancelAnimationFrame() {}, CustomEvent: class {} });
  return { card, close, original, fallback, document, styles, show() { [...timers.values()][0](); }, dismiss() { document.activeElement = close; close.emit('click'); }, focusFrame() { document.emit('focusin'); frames.shift()?.(); } };
}

test('Playbook keyboard dismissal returns to the still-visible original focus without scrolling', () => {
  const h = fixture();
  h.show();
  h.dismiss();
  assert.equal(h.document.activeElement, h.original);
  assert.equal(h.card.hidden, true);
  assert.equal(h.card.inert, true);
});

test('Playbook dismissal chooses a visible page control when the original focus scrolled offscreen', () => {
  const h = fixture();
  h.show();
  h.original.top = -1000;
  h.dismiss();
  assert.equal(h.document.activeElement, h.fallback);
});

test('Playbook dismissal avoids returning focus to a removed page control', () => {
  const h = fixture();
  h.show();
  h.original.isConnected = false;
  h.dismiss();
  assert.equal(h.document.activeElement, h.fallback);
});

test('Playbook reserves space above a focused page CTA at the bottom of the viewport', () => {
  const h = fixture();
  h.show();
  h.original.top = 830;
  h.focusFrame();
  assert.equal(h.styles.get('--playbook-offset'), '58px');
});
