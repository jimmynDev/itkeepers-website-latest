import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'parse5';
function elements(root){return [root,...(root.childNodes||[]).flatMap(elements)]}
const attrs=node=>Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));
const text=node=>(node.value||'')+(node.childNodes||[]).map(text).join('');
test('both normal forms expose the short processing notice and associated Privacy link',()=>{
  for(const route of ['','contact/']){
    const nodes=elements(parse(readFileSync(new URL('../dist/'+route+'index.html',import.meta.url),'utf8')));
    const form=nodes.find(n=>n.tagName==='form'&&'data-inquiry-form'in attrs(n));assert.ok(form);
    assert.equal(attrs(form).action,'https://formspree.io/f/mrppzvpo');
    const notice=nodes.find(n=>attrs(n).id===attrs(form)['aria-describedby']);assert.ok(notice);
    assert.match(text(notice),/Formspree processes inquiries for a temporary administrator-managed inbox/);
    assert.ok(text(notice).split(/\s+/).length<25);
    assert.ok(elements(notice).some(n=>n.tagName==='a'&&attrs(n).href==='/privacy/'));
  }
});
