import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage presents one people section and one operating explanation before the review CTA', () => {
  const html = read('dist/index.html');
  const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
  const sequence = ['id="home-title"', 'id="services/managed"', 'id="offering-web-design-hosting"', 'id="it-keepers-pulse"', 'id="technology"', 'id="business-value"', 'id="who-we-are"', 'id="how-we-operate"', 'id="records-advice"', 'class="cta home-closing"'];
  let previous = -1;
  for (const marker of sequence) {
    const position = main.indexOf(marker);
    assert.ok(position > previous, `missing or reordered ${marker}`);
    previous = position;
  }
  for (const legacy of ['thread-title', 'workflow-title', 'id="advice-title"', 'class="section knowledge"', 'class="section light attention"', 'data-phishing-experience']) assert.ok(!main.includes(legacy), `redundant ${legacy}`);
  for (const animation of ['operate-process']) {
    assert.equal((main.match(new RegExp(`class="${animation}(?:[ "])[^>]*`, 'g')) ?? []).length, 1, `one ${animation} presentation`);
  }
  assert.equal((main.match(/data-process-step=/g) ?? []).length, 4);
  assert.match(main, /Clear records\. Honest advice\./);
  for (const value of ['infrastructure records, configurations and decisions', 'Access, ownership, export and handover are agreed with you.', 'workload, condition and supportability', 'Continuous technical training']) assert.ok(main.includes(value));
  assert.doesNotMatch(main, /knowledge-outcome|class="operate-details"/);
  assert.doesNotMatch(main, /Illustrative examples, not a response-time guarantee or a device diagnosis/);
  assert.match(main, /href="\/contact\/\?type=review"[^>]*>Book a free IT review/);
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(!readdirSync(new URL('../dist/_astro', import.meta.url)).some(name => name.startsWith('TeamThread.')));
});

test('documentation and hardware examples live once on Services with the original copy and hooks', () => {
  const home = read('dist/index.html').match(/<main\b[\s\S]*?<\/main>/)[0];
  const services = read('dist/services/index.html').match(/<main\b[\s\S]*?<\/main>/)[0];
  for (const animation of ['knowledge-continuity', 'hardware-assessment']) {
    assert.ok(!home.includes(`data-animation="${animation}"`));
    assert.equal((services.match(new RegExp(`data-animation="${animation}"`, 'g')) ?? []).length, 1);
  }
  assert.ok(services.indexOf('id="service-records-advice"') > services.indexOf('id="web-design-hosting"'));
  for (const value of ['Your IT. Your data. Your control.', 'infrastructure and configuration records', 'ticket history, resolutions, changes and decisions', 'backup and recovery context', 'Agree client access, ownership, export, retention and handover arrangements', 'Client IT Record', 'Engineer handoff', 'Sample assessment']) assert.ok(services.includes(value), value);
  assert.equal((services.match(/data-assessment-outcome=/g) ?? []).length, 3);
  assert.equal((services.match(/data-knowledge-row=/g) ?? []).length, 5);
  assert.equal((services.match(/data-assessment-signal=/g) ?? []).length, 6);
  assert.match(read('dist/index.html'), /href="\/services\/#operate-decisions-title"/);
  const records = home.match(/<section[^>]*id="records-advice"[\s\S]*?<\/section>/)[0];
  assert.equal((records.match(/<article\b/g) ?? []).length, 2);
  assert.match(records, /YOUR RECORDS, YOUR CALL/);
  assert.match(records, /Your records stay yours\./);
  assert.match(records, /Honest hardware advice\./);
  assert.doesNotMatch(records, /Examples are illustrative, not a response-time guarantee or a device diagnosis\./);
  assert.doesNotMatch(records, /<button\b|<a\b|tabindex=|role="button"/);
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
  assert.match(source, /href="\/resources\/ai-governance\/"/);
  assert.match(source, /itkeepers-ai-playbook-cover\.webp/);
  const index = read('src/pages/index.astro');
  assert.match(index, /hasApprovedClientProof && <ClientProof/);
});
