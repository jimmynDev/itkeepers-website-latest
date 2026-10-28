import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../src/scripts/ai-playbook.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;

function fixture(settings = {}) {
  const listeners = object => Object.assign(object, { handlers: {}, addEventListener(name, fn) { (this.handlers[name] ??= new Set()).add(fn); }, removeEventListener(name, fn) { this.handlers[name]?.delete(fn); }, emit(name) { this.handlers[name]?.forEach(fn => fn()); } });
  let document;
  class Element {
    isConnected = true;
    top = 300;
    left = 20;
    width = 200;
    height = 44;
    form = false;
    disabled = false;
    inMain = true;
    getBoundingClientRect() { return { top: this.top, bottom: this.top + this.height, left: this.left, right: this.left + this.width, width: this.width, height: this.height }; }
    closest(selector) { return selector === 'main' && this.inMain ? {} : this.form && selector === 'form' ? {} : this.form && selector === '.inquiry-field' ? this : null; }
    focus() { document.activeElement = this; }
  }
  const original = new Element(), fallback = new Element(), close = listeners(new Element());
  fallback.top = 450;
  const styles = new Map(), frames = [];
  const formControls = (settings.formControls ?? []).map(values => Object.assign(new Element(), { form:true }, values));
  const card = { dataset: {}, hidden: true, inert: false, style: { setProperty(name, value) { styles.set(name, value); } }, classList: { add() {} }, querySelector() { return close; }, contains(element) { return element === close; }, getBoundingClientRect() { const top = 500 - Number.parseFloat(styles.get('--playbook-offset') || '0'); return { left:100, right:480, top, bottom:top+250, width:380, height:250 }; }, dispatchEvent() {} };
  document = listeners({ activeElement: original, body: {}, documentElement: { scrollHeight: 5000 }, querySelector(selector) { return selector === '.playbook-card' ? card : null; }, querySelectorAll(selector) { return selector.startsWith('a[href]') || selector.startsWith('a,button') ? [original, fallback, ...formControls] : []; } });
  const window = listeners({ innerHeight: 900, innerWidth: 1440, location: { pathname: '/' }, matchMedia() { return { matches: true }; } });
  const timers = new Map();
  let next = 0;
  vm.runInNewContext(source, { document, window, HTMLElement: Element, localStorage: { getItem() { return '{}'; }, setItem() {} }, Date, getComputedStyle() { return { display: 'block', visibility: 'visible', position: 'static' }; }, setTimeout(fn) { timers.set(++next, fn); return next; }, clearTimeout(id) { timers.delete(id); }, requestAnimationFrame(fn) { frames.push(fn); return frames.length; }, cancelAnimationFrame() {}, CustomEvent: class {} });
  return { card, close, original, fallback, formControls, document, styles, show() { [...timers.values()][0](); }, dismiss() { document.activeElement = close; close.emit('click'); }, focusFrame() { document.emit('focusin'); frames.shift()?.(); } };
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

test('Playbook clears unfocused form controls when there is enough room above them', () => {
  const h = fixture({ formControls:[{top:600,left:120,width:250,height:50}] });
  h.show();
  assert.equal(h.styles.get('visibility'),'visible');
  assert.equal(h.card.inert,false);
  assert.ok(h.card.getBoundingClientRect().bottom < h.formControls[0].top);
});

test('Playbook temporarily yields when moving above the form would squash its design, then returns', () => {
  const h = fixture({ formControls:[{top:200,left:120},{top:600,left:120}] });
  h.show();
  assert.equal(h.styles.get('visibility'),'hidden');
  assert.equal(h.card.inert,true);
  h.formControls.forEach(control => { control.top = -1000; });
  h.focusFrame();
  assert.equal(h.styles.get('visibility'),'visible');
  assert.equal(h.card.inert,false);
  assert.equal(h.card.hidden,false,'Temporary collision handling does not dismiss the offer');
});

test('Playbook suppression moves keyboard focus out of the inert card and dismissal stays dismissed', () => {
  const h = fixture({ formControls:[{top:200,left:120},{top:600,left:120}] });
  h.show();
  h.document.activeElement = h.close;
  h.focusFrame();
  assert.equal(h.document.activeElement,h.formControls[0]);
  h.dismiss();
  h.formControls.forEach(control => { control.top = -1000; });
  h.focusFrame();
  assert.equal(h.card.hidden,true);
  assert.equal(h.card.inert,true);
});
