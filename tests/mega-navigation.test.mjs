import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const compiled = compile(read('src/scripts/mega-navigation.ts'));
const dataExports = {};
vm.runInNewContext(compile(read('src/data/navigation.ts')), { exports: dataExports });
const navigation = dataExports.navigation;
const categoryIds = ['it', 'security', 'cloud', 'ai', 'digital', 'why'];

function target(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(name, fn) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(fn);
    },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    emit(name, properties = {}) {
      const event = typeof properties.preventDefault === 'function' ? properties : {
        target: this, defaultPrevented: false, button: 0,
        preventDefault() { this.defaultPrevented = true; }, ...properties,
      };
      for (const fn of [...(listeners.get(name) ?? [])]) fn(event);
      if (['click', 'focusin', 'focusout', 'keydown'].includes(name)) this.parent?.emit(name, event);
      return event;
    },
    listenerCount() { return [...listeners.values()].reduce((sum, values) => sum + values.size, 0); },
  });
}

// Deliberately small DOM/event fixture, matching the project's existing TS/VM tests.
// Native focus events bubble; pointerenter/leave do not. No layout/browser pass is inferred.
function fixture({ desktop = true, hover = true, headerPresent = true } = {}) {
  let now = 0, id = 0;
  const timers = new Map(), frames = new Map(), elements = [], observers = [];
  const document = target({ activeElement: null });
  const desktopMode = target({ matches: desktop }), hoverMode = target({ matches: hover });
  const window = target({ matchMedia: query => query.includes('min-width') ? desktopMode : hoverMode });
  function element(tag = 'div', attributes = {}, parent) {
    const node = target({ tag, attributes: { ...attributes }, parent, children: [], dataset: {},
      hidden: false, style: { values: {}, setProperty(name, value) { this.values[name] = value; } },
      setAttribute(name, value) { this.attributes[name] = String(value); },
      getAttribute(name) { return this.attributes[name] ?? null; },
      contains(other) { return Boolean(other && (other === this || this.children.some(child => child.contains(other)))); },
      matches(selector) {
        if (selector === 'a[href]') return this.tag === 'a' && this.getAttribute('href') !== null;
        if (selector.startsWith('[')) return selector.slice(1, -1) in this.attributes;
        return this.tag === selector;
      },
      querySelectorAll(selector) { return this.children.flatMap(child => [
        ...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector),
      ]); },
      querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; },
      closest(selector) { return this.matches(selector) ? this : this.parent?.closest(selector) ?? null; },
      focus() {
        const previous = document.activeElement;
        if (previous === this) return;
        previous?.emit('focusout', { relatedTarget: this });
        document.activeElement = this;
        this.emit('focusin', { relatedTarget: previous });
      },
      getBoundingClientRect() { return { bottom: 110.3 }; },
    });
    parent?.children.push(node);
    elements.push(node);
    return node;
  }
  const header = element('header', { 'data-mega-header': '' });
  const desktopNav = element('nav', { 'data-desktop-navigation': '' }, header);
  const categories = categoryIds.map(categoryId => {
    const category = element('li', { 'data-nav-category': categoryId }, desktopNav);
    const link = element('a', { href: navigation.find(item => item.id === categoryId).href }, category);
    const toggle = element('button', { 'data-nav-toggle': '', 'aria-expanded': 'false', 'aria-controls': `desktop-panel-${categoryId}` }, category);
    const panel = element('div', { 'data-nav-panel': '', id: `desktop-panel-${categoryId}` }, category);
    const panelLink = element('a', { href: '/contact' }, panel);
    panel.hidden = toggle.hidden = true;
    return { category, link, toggle, panel, panelLink };
  });
  const mobile = element('details', { 'data-mobile-navigation': '' }, header);
  let mobileOpen = false;
  Object.defineProperty(mobile, 'open', { get: () => mobileOpen, set(value) {
    const changed = mobileOpen !== Boolean(value); mobileOpen = Boolean(value);
    if (changed) mobile.emit('toggle');
  } });
  const summary = element('summary', {}, mobile);
  const mobileCategories = categoryIds.map(categoryId => {
    const toggle = element('button', { 'data-mobile-toggle': '', 'aria-expanded': 'false', 'aria-controls': `mobile-panel-${categoryId}` }, mobile);
    const panel = element('div', { 'data-mobile-panel': '', id: `mobile-panel-${categoryId}` }, mobile);
    const link = element('a', { href: '/contact' }, panel);
    const span = element('span', {}, link);
    panel.hidden = toggle.hidden = true;
    return { toggle, panel, link, span };
  });
  const outside = element('a', { href: '/' });
  document.querySelector = () => headerPresent ? header : null;
  document.getElementById = sought => elements.find(node => node.getAttribute('id') === sought);
  class Observer {
    constructor(callback) { this.callback = callback; this.connected = false; observers.push(this); }
    observe(node) { this.connected = true; this.node = node; }
    disconnect() { this.connected = false; }
  }
  const exports = {};
  vm.runInNewContext(compiled, { exports, document, window, ResizeObserver: Observer,
    setTimeout(callback, delay) { const key = ++id; timers.set(key, { callback, at: now + delay }); return key; },
    clearTimeout(key) { timers.delete(key); },
    requestAnimationFrame(callback) { const key = ++id; frames.set(key, callback); return key; },
    cancelAnimationFrame(key) { frames.delete(key); },
  });
  return { header, desktopNav, categories, mobile, summary, mobileCategories, outside,
    document, window, desktopMode, hoverMode, timers, frames, observers,
    mount: exports.mountNavigation,
    listenerCount: () => elements.reduce((sum, node) => sum + node.listenerCount(), 0)
      + document.listenerCount() + window.listenerCount() + desktopMode.listenerCount() + hoverMode.listenerCount(),
    click(node, properties = {}) { node.focus(); return node.emit('click', properties); },
    tick(ms) {
      const end = now + ms;
      while (true) {
        const entry = [...timers].filter(([, task]) => task.at <= end).sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!entry) break;
        now = entry[1].at; timers.delete(entry[0]); entry[1].callback();
      }
      now = end;
    },
    flushFrames() { for (const [key, callback] of [...frames]) { frames.delete(key); callback(); } },
    mode(matches) { desktopMode.matches = matches; desktopMode.emit('change'); },
  };
}

function assertDesktop(h, index) {
  h.categories.forEach(({ panel, toggle }, current) => {
    assert.equal(panel.hidden, current !== index, `desktop panel ${current}`);
    assert.equal(toggle.getAttribute('aria-expanded'), String(current === index));
  });
}
function assertMobile(h, index) {
  h.mobileCategories.forEach(({ panel, toggle }, current) => {
    assert.equal(panel.hidden, current !== index, `mobile panel ${current}`);
    assert.equal(toggle.getAttribute('aria-expanded'), String(current === index));
  });
}

test('six ordered categories expose buttons and independently toggle one desktop panel', () => {
  assert.deepEqual(Array.from(navigation, item => item.id), categoryIds);
  assert.deepEqual(Array.from(navigation, item => item.label), ['IT Services', 'Cybersecurity', 'Cloud', 'AI & Automation', 'Digital', 'Why ITKeepers']);
  const h = fixture(); h.mount(); assertDesktop(h, -1);
  h.categories.forEach(({ toggle }, index) => {
    assert.equal(toggle.hidden, false);
    h.click(toggle); assertDesktop(h, index);
    h.click(toggle); assertDesktop(h, -1);
  });
  h.click(h.categories[0].toggle); h.click(h.categories[5].toggle); assertDesktop(h, 5);
});

test('hover waits 125ms, switches one panel and closes only after a 200ms departure', () => {
  const h = fixture(); h.mount();
  h.categories[0].category.emit('pointerenter', { pointerType: 'mouse' });
  h.tick(124); assertDesktop(h, -1); h.tick(1); assertDesktop(h, 0);
  h.categories[0].category.emit('pointerleave');
  h.categories[1].category.emit('pointerenter', { pointerType: 'mouse' });
  h.tick(124); assertDesktop(h, 0); h.tick(1); assertDesktop(h, 1);
  h.categories[1].category.emit('pointerleave');
  h.tick(199); assertDesktop(h, 1); h.tick(1); assertDesktop(h, -1);
});

test('crossing into a panel and rapid boundary movement cancel stale open/close timers', () => {
  const h = fixture(); h.mount();
  h.categories[0].category.emit('pointerenter', { pointerType: 'mouse' });
  h.tick(50); h.categories[0].category.emit('pointerleave'); h.tick(1000); assertDesktop(h, -1);
  h.categories[0].category.emit('pointerenter', { pointerType: 'mouse' }); h.tick(125);
  h.categories[0].category.emit('pointerleave'); h.tick(100);
  h.categories[0].panel.emit('pointerenter'); h.tick(1000); assertDesktop(h, 0);
  h.categories[1].category.emit('pointerenter', { pointerType: 'mouse' }); h.tick(50);
  h.categories[0].category.emit('pointerenter', { pointerType: 'mouse' }); h.tick(1000); assertDesktop(h, 0);
  assert.equal(h.timers.size, 0);
});

test('touch, coarse-pointer and mobile events never open desktop disclosures by hover', () => {
  for (const options of [{}, { hover: false }, { desktop: false }]) {
    const h = fixture(options); h.mount();
    h.categories[0].category.emit('pointerenter', { pointerType: options.hover === false || options.desktop === false ? 'mouse' : 'touch' });
    h.tick(1000); assertDesktop(h, -1); assert.equal(h.timers.size, 0);
  }
});

test('focused panel survives pointer departure and other hover until focus leaves', () => {
  const h = fixture(); h.mount(); h.click(h.categories[0].toggle);
  h.categories[0].panelLink.focus(); h.categories[0].category.emit('pointerleave');
  h.tick(1000); assertDesktop(h, 0);
  h.categories[1].category.emit('pointerenter', { pointerType: 'mouse' }); h.tick(125); assertDesktop(h, 0);
  h.categories[1].link.focus(); assertDesktop(h, -1);
  assert.equal(h.document.activeElement, h.categories[1].link);
});

test('Escape restores desktop trigger focus; ordinary keys and Tab keep native behavior', () => {
  const h = fixture(); h.mount(); h.click(h.categories[3].toggle); h.categories[3].panelLink.focus();
  assert.equal(h.categories[3].panelLink.emit('keydown', { key: 'Tab' }).defaultPrevented, false);
  assertDesktop(h, 3);
  assert.equal(h.categories[3].panelLink.emit('keydown', { key: 'Escape' }).defaultPrevented, true);
  assertDesktop(h, -1); assert.equal(h.document.activeElement, h.categories[3].toggle);
  assert.equal(h.header.emit('keydown', { key: 'Escape' }).defaultPrevented, false);
});

test('mobile permits one accordion and closes all panels when native drawer closes', () => {
  const h = fixture({ desktop: false }); h.mount(); h.mobile.open = true;
  assert.equal(h.summary.getAttribute('aria-expanded'), 'true');
  h.mobileCategories.forEach(({ toggle }, index) => { h.click(toggle); assertMobile(h, index); });
  h.click(h.mobileCategories[5].toggle); assertMobile(h, -1);
  h.click(h.mobileCategories[2].toggle); h.mobile.open = false;
  assertMobile(h, -1); assert.equal(h.summary.getAttribute('aria-expanded'), 'false');
});

test('mobile Escape closes drawer and returns focus to summary', () => {
  const h = fixture({ desktop: false }); h.mount(); h.mobile.open = true;
  h.click(h.mobileCategories[0].toggle); h.mobileCategories[0].link.focus();
  assert.equal(h.mobileCategories[0].link.emit('keydown', { key: 'Escape' }).defaultPrevented, true);
  assert.equal(h.mobile.open, false); assertMobile(h, -1);
  assert.equal(h.document.activeElement, h.summary);
});

test('internal link activation closes mobile drawer without preventing link navigation', () => {
  const h = fixture({ desktop: false }); h.mount(); h.mobile.open = true;
  h.click(h.mobileCategories[0].toggle);
  const event = h.mobileCategories[0].span.emit('click');
  assert.equal(event.defaultPrevented, false); assert.equal(h.mobile.open, false);
  assertMobile(h, -1); assert.equal(h.document.activeElement, h.summary);
});

test('modified, alternate-button and prevented link clicks preserve mobile drawer', () => {
  for (const properties of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) {
    const h = fixture({ desktop: false }); h.mount(); h.mobile.open = true;
    h.click(h.mobileCategories[0].toggle); h.mobileCategories[0].span.emit('click', properties);
    assert.equal(h.mobile.open, true); assertMobile(h, 0);
  }
});

test('outside dismissal, focus departure and window blur close navigation safely', () => {
  const h = fixture(); h.mount(); h.click(h.categories[0].toggle);
  h.document.emit('pointerdown', { target: h.categories[0].panelLink }); assertDesktop(h, 0);
  h.document.emit('pointerdown', { target: h.outside }); assertDesktop(h, -1);
  h.mode(false); h.mobile.open = true; h.click(h.mobileCategories[0].toggle);
  h.document.emit('pointerdown', { target: h.outside });
  assert.equal(h.mobile.open, false); assert.equal(h.document.activeElement, h.summary);
  h.mobile.open = true; h.click(h.mobileCategories[0].toggle); h.outside.focus();
  assert.equal(h.mobile.open, false); assert.equal(h.document.activeElement, h.outside);
  h.mobile.open = true; h.click(h.mobileCategories[0].toggle); h.window.emit('blur');
  assert.equal(h.mobile.open, false); assertMobile(h, -1);
  h.mode(true); h.click(h.categories[0].toggle); h.window.emit('blur'); assertDesktop(h, -1);
});

test('breakpoint changes restore focus onto visible navigation and close old disclosures', () => {
  const h = fixture(); h.mount(); h.click(h.categories[4].toggle); h.categories[4].panelLink.focus();
  h.mode(false); assertDesktop(h, -1); assert.equal(h.document.activeElement, h.summary);
  h.mobile.open = true; h.click(h.mobileCategories[2].toggle); h.mobileCategories[2].link.focus();
  h.mode(true); assert.equal(h.mobile.open, false); assertMobile(h, -1);
  assert.equal(h.document.activeElement, h.categories[0].link);
  h.outside.focus(); h.mode(false); assert.equal(h.document.activeElement, h.outside);
});

test('duplicate mounts do not add listeners or observers; Astro disposal cancels every pending task', () => {
  const h = fixture(); const baselineListeners = h.listenerCount(); h.mount();
  const mountedListeners = h.listenerCount(); h.mount(); h.document.emit('astro:page-load');
  assert.equal(h.listenerCount(), mountedListeners); assert.equal(h.observers.length, 1);
  assert.equal(h.header.dataset.navigationMounted, 'true');
  assert.equal(h.header.style.values['--navigation-bottom'], '111px');
  h.categories[0].category.emit('pointerenter', { pointerType: 'mouse' });
  h.window.emit('resize'); h.window.emit('resize');
  assert.equal(h.timers.size, 1); assert.equal(h.frames.size, 1);
  h.document.emit('astro:before-swap');
  assert.equal(h.timers.size + h.frames.size, 0); assert.equal(h.observers[0].connected, false);
  assert.equal(h.listenerCount(), baselineListeners); assert.equal(h.header.dataset.navigationMounted, undefined);
  h.tick(1000); assertDesktop(h, -1);
  h.document.emit('astro:page-load'); assert.equal(h.observers.length, 2);
  h.click(h.categories[0].toggle); assertDesktop(h, 0);
  h.categories[0].category.emit('pointerleave'); h.window.emit('resize');
  h.document.emit('astro:before-swap'); assertDesktop(h, -1);
  assert.equal(h.listenerCount(), baselineListeners); assert.equal(h.timers.size + h.frames.size, 0);
});

test('resize observer updates panel boundary and missing-header pages safely skip mounting', () => {
  const h = fixture(); h.mount();
  h.header.getBoundingClientRect = () => ({ bottom: 162.8 });
  h.observers[0].callback(); h.flushFrames();
  assert.equal(h.header.style.values['--navigation-bottom'], '163px');
  const empty = fixture({ headerPresent: false }); empty.mount();
  assert.equal(empty.observers.length, 0); assert.equal(empty.timers.size + empty.frames.size, 0);
});

test('rendered navigation has real destinations, matching fragments and unique disclosure IDs', () => {
  const html = read('dist/index.html');
  const header = html.match(/<header\b[^>]*data-mega-header[\s\S]*?<\/header>/)?.[0];
  assert.ok(header, 'build the navigation candidate before running rendered-output checks');
  assert.equal((header.match(/data-nav-category=/g) ?? []).length, 6);
  assert.equal((header.match(/data-mobile-toggle/g) ?? []).length, 6);
  const ids = [...header.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'header IDs must be unique');
  for (const match of header.matchAll(/aria-controls="([^"]+)"/g)) assert.ok(ids.includes(match[1]), `missing controlled element ${match[1]}`);
  const hrefs = [...new Set([...header.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1]))];
  for (const href of hrefs) {
    assert.ok(href !== '#' && !href.startsWith('javascript:'), `placeholder link ${href}`);
    const url = new URL(href, 'https://itkeepers.com');
    if (url.origin !== 'https://itkeepers.com') continue;
    const route = url.pathname.replace(/\/+$/, '');
    const file = new URL(`../dist${route}/index.html`, import.meta.url);
    assert.ok(existsSync(file), `missing built navigation route ${href}`);
    if (url.hash) {
      const targetHtml = readFileSync(file, 'utf8');
      assert.ok([...targetHtml.matchAll(/\bid="([^"]+)"/g)].some(match => match[1] === decodeURIComponent(url.hash.slice(1))), `missing built navigation fragment ${href}`);
    }
  }
  for (const id of categoryIds) {
    assert.ok(ids.includes(`desktop-panel-${id}`)); assert.ok(ids.includes(`mobile-panel-${id}`));
  }
  assert.doesNotMatch(header, /role="(?:menu|menuitem|menubar)"/);
  assert.doesNotMatch(header, /Co-Managed IT|IT Projects|IT Assessments|Microsoft Copilot|AI Readiness Assessment|Technical SEO|Core Web Vitals/);
  assert.match(header, /class="mega-item mega-topic"/);
});

test('reduced-motion stylesheet removes entrance and chevron motion; disclosure CSS matches controller breakpoint', () => {
  const css = read('src/styles/mega-navigation.css');
  const reduced = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/)?.[1];
  assert.ok(reduced); assert.match(reduced, /\.mega-content/); assert.match(reduced, /\.navigation-chevron/);
  assert.match(reduced, /animation:\s*none/); assert.match(reduced, /transition:\s*none/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*no-preference\)[\s\S]*animation:\s*mega-navigation-enter/);
  assert.match(css, /\.mega-panel\[hidden\][^{]*\{\s*display:\s*none/);
  assert.match(css, /\.mega-mobile:not\(\[open\]\)\s*>\s*nav\s*\{\s*display:\s*none/);
  const breakpoint = read('src/scripts/mega-navigation.ts').match(/min-width:\s*(\d+)px/)[1];
  assert.ok(css.includes(`@media (min-width: ${breakpoint}px)`));
  assert.match(css, /max-block-size:\s*calc\(100dvh\s*-\s*var\(--navigation-bottom/);
});
