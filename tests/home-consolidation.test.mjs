import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage presents one people section and one operating explanation before the review CTA', () => {
  const html = read('dist/index.html');
  const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
  const sequence = ['id="home-title"', 'id="services/managed"', 'id="offering-web-design-hosting"', 'id="it-keepers-pulse"', 'id="technology"', 'id="business-value"', 'id="who-we-are"', 'id="how-we-operate"', 'class="cta home-closing"'];
  let previous = -1;
  for (const marker of sequence) {
    const position = main.indexOf(marker);
    assert.ok(position > previous, `missing or reordered ${marker}`);
    previous = position;
  }
  for (const legacy of ['thread-title', 'workflow-title', 'advice-title', 'class="section knowledge"', 'class="section light attention"', 'data-phishing-experience']) assert.ok(!main.includes(legacy), `redundant ${legacy}`);
  for (const animation of ['operate-process', 'knowledge-continuity', 'hardware-assessment']) {
    assert.equal((main.match(new RegExp(`class="${animation}(?:[ "])[^>]*`, 'g')) ?? []).length, 1, `one ${animation} presentation`);
  }
  assert.equal((main.match(/data-process-step=/g) ?? []).length, 7);
  assert.match(main, /Your IT shouldn&#39;t live in one person&#39;s head\.|Your IT shouldn't live in one person's head\./);
  for (const value of ['configurations', 'service information', 'open actions and follow-up', 'Scope and schedule depend on your service agreement', 'workload, condition and supportability', 'Continuous technical training']) assert.ok(main.includes(value));
  assert.match(main, /href="\/contact\?intent=review"[^>]*>Book a free IT review/);
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(!readdirSync(new URL('../dist/_astro', import.meta.url)).some(name => name.startsWith('TeamThread.')));
});

test('phishing navigation goes to the existing Cybersecurity exercise without a homepage exercise', () => {
  const home = read('dist/index.html');
  const cyber = read('dist/services/cybersecurity/index.html');
  assert.match(home, /href="\/services\/cybersecurity\/#phishing-decisions"/);
  assert.doesNotMatch(home, /href="\/#phishing-decisions"/);
  assert.equal((cyber.match(/id="phishing-decisions"/g) ?? []).length, 1);
  assert.equal((cyber.match(/data-decision-scenario=/g) ?? []).length, 4);
  assert.equal((cyber.match(/data-decision-explanation=/g) ?? []).length, 12);
  assert.match(cyber, /aria-live="polite" aria-atomic="true"/);
});

test('Playbook keeps its corner feature and a script-free resource fallback without simultaneous inline promotion', () => {
  const source = read('src/components/AIPlaybook.astro');
  assert.match(source, /<noscript><aside class="playbook-reference"[\s\S]*?<\/aside><\/noscript>/);
  assert.equal((source.match(/class="playbook-card"/g) ?? []).length, 1);
  assert.match(source, /data-event="ai-playbook-dismiss"/);
  assert.match(source, /href="\/resources\/ai-governance"/);
  assert.match(source, /itkeepers-ai-playbook-cover\.webp/);
  const index = read('src/pages/index.astro');
  assert.match(index, /hasApprovedClientProof && <ClientProof/);
});
