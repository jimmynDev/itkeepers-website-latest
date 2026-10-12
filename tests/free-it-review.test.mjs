import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const source=read('src/scripts/contact-form.ts');
const compile=source=>ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const data={exports:{}};vm.runInNewContext(compile(read('src/data/inquiry.ts')),data);
const html=read('dist/contact/index.html'),home=read('dist/index.html');
function fixture(query='',compact=false){
  const events=()=>({handlers:new Map(),addEventListener(name,fn,options){this.handlers.set(name,{fn,options});},emit(name,event={}){this.handlers.get(name)?.fn(event);}});
  const fields=(compact?['name','email','phone','company']:['name','email','company','phone','message']).map(name=>({...events(),name,value:'',validity:{typeMismatch:false},attrs:new Map(),setAttribute(key,val){this.attrs.set(key,val);},removeAttribute(key){this.attrs.delete(key);},hasAttribute(key){return this.attrs.has(key);}}));
  const errors=new Map(fields.map(field=>[field.name,{textContent:'',hidden:true}]));
  const radios=compact?[]:['review','general'].map(value=>({...events(),value,checked:value==='general'}));
  const interests=compact?[]:data.exports.serviceInterests.map(item=>({...events(),value:item.value,checked:false}));
  const button={disabled:true,textContent:''},status={textContent:''};
  const form={...events(),dataset:{inquiryMode:compact?'review':'contact'},querySelector(selector){return selector==='button[type="submit"]'?button:selector==='[data-inquiry-status]'?status:errors.get(selector.match(/data-field-error="([^"]+)"/)?.[1]);},querySelectorAll(selector){return selector.includes('type="radio"')?radios:selector.includes('type="checkbox"')?interests:fields;}};
  const document=events(),exports={};
  class FormData{constructor(form){this.form=form;}getAll(name){return name==='interests'?interests.filter(item=>item.checked).map(item=>item.value):[];}}
  vm.runInNewContext(compile(source),{exports,require(){return data.exports;},AbortController,FormData,URL,document,window:{location:{href:'https://itkeepers.com/contact'+query}}});
  const scope={querySelectorAll(){return [form];}},initialize=()=>exports.initializeContactForms(scope);initialize();
  return {exports,form,fields,errors,radios,interests,button,status,initialize,document,submit(){let cancelled=false;form.emit('submit',{preventDefault(){cancelled=true;}});return cancelled;}};
}
test('only supported query intents are accepted and general is the default',()=>{
  for(const [query,expected] of [['','general'],['?intent=review','review'],['?intent=general','general'],['?intent=unknown','general'],['?intent=%3Cscript%3E','general'],['?redirect=https://example.com','general']]){
    const flow=fixture(query);assert.equal(flow.radios.find(item=>item.checked).value,expected);assert.equal(flow.button.textContent,expected==='review'?'Request my free IT review':'Send my message');assert.equal(flow.button.disabled,true);
  }
});
test('purpose changes update the disabled action label and initialization is idempotent',()=>{
  const flow=fixture();flow.radios[0].checked=true;flow.radios[1].checked=false;flow.radios[0].emit('change');flow.initialize();
  assert.equal(flow.button.textContent,'Request my free IT review');assert.equal(flow.radios[0].checked,true);assert.equal(flow.button.disabled,true);
});
test('required fields expose associated errors on blur; optional blanks remain valid',()=>{
  const flow=fixture();for(const field of flow.fields)field.emit('blur');
  for(const name of ['name','email','message'])assert.equal(flow.errors.get(name).hidden,false);
  for(const name of ['company','phone'])assert.equal(flow.errors.get(name).hidden,true);
});
test('native email mismatch and corrected values use accessible inline states',()=>{
  const flow=fixture(),email=flow.fields[1];email.value='invalid';email.validity.typeMismatch=true;email.emit('blur');assert.match(flow.errors.get('email').textContent,/valid email/);
  email.value='test@gmail.com';email.validity.typeMismatch=false;email.emit('input');assert.equal(flow.errors.get('email').hidden,true);assert.equal(email.hasAttribute('aria-invalid'),false);assert.equal(email.value,'test@gmail.com');
});
test('international phone values, optional blanks and per-field limits are retained',()=>{
  const api=data.exports;for(const phone of ['','+961 81 816 761','+1 (212) 555-0100','+44 20 7946 0958'])assert.equal(api.contactFieldError('phone',phone),'');
  assert.equal(api.contactFieldError('company',''),'');assert.match(api.contactFieldError('name',' '),/full name/);
  for(const [field,limit]of Object.entries(api.inquiryLimits)){assert.equal(api.contactFieldError(field,'x'.repeat(limit)),'');assert.match(api.contactFieldError(field,'x'.repeat(limit+1)),/characters or fewer/);}
});
test('both layouts keep submission disabled and defensively cancel forced attempts without losing data',()=>{
  for(const compact of [false,true]){const flow=fixture('?intent=general',compact);flow.fields[0].value='Test Person';flow.fields[1].value='test@outlook.com';const before=flow.fields.map(field=>field.value);assert.equal(flow.button.disabled,true);assert.equal(flow.submit(),true);assert.equal(flow.button.disabled,true);assert.match(flow.status.textContent,/not been sent/);assert.deepEqual(flow.fields.map(field=>field.value),before);}
  assert.doesNotMatch(source,/disabled\s*=\s*false|fetch\(|XMLHttpRequest|localStorage|sessionStorage|innerHTML|sendBeacon/);
});
test('listeners clean up on Astro navigation',()=>{const flow=fixture();const signal=flow.form.handlers.get('submit').options.signal;assert.equal(signal.aborted,false);flow.document.emit('astro:before-swap');assert.equal(signal.aborted,true);});
test('static forms have compact truthful fallbacks and cannot submit without JavaScript',()=>{
  for(const page of [html,home]){assert.match(page,/<form\b[^>]*method="post"[^>]*action="\/contact"[^>]*data-inquiry-form/);assert.match(page,/<button\b[^>]*type="submit"[^>]*disabled/);assert.match(page,/Online requests are unavailable/);assert.match(page,/href="mailto:info@itkeepers\.com"/);assert.match(page,/href="tel:\+96181816761"/);assert.match(page,/role="status" aria-live="polite" aria-atomic="true"/);assert.doesNotMatch(page,/This preview form cannot|This preview does not/);}
  assert.match(html,/>Inquiry purpose<\/legend>/);assert.match(html,/>General inquiry<\/span>/);
  for(const field of ['name','email','company','phone','message'])assert.match(html,new RegExp(`for="contact-${field}"`));
  assert.doesNotMatch(html,/autofocus|name="(?:budget|industry|size)"/);
});
test('contact metadata/canonical and existing organization schema remain unchanged',()=>{
  assert.equal([...html.matchAll(/<h1\b/g)].length,1);assert.match(html,/<title>Free IT Review \| ITKeepers<\/title>/);assert.match(html,/<link rel="canonical" href="https:\/\/itkeepers.com\/contact\/?"/);assert.equal((html.match(/"@type":"Organization"/g)??[]).length,1);
});
test('homepage has one compact review form with four fields and no message or service chips',()=>{
  const form=home.match(/<form\b[^>]*data-inquiry-form[\s\S]*?<\/form>/)[0];assert.equal((home.match(/data-inquiry-form/g)??[]).length,1);assert.match(form,/name="intent" value="review"/);assert.match(form,/name="form_kind" value="review"/);
  for(const field of ['name','email','phone','company'])assert.match(form,new RegExp(`name="${field}"`));
  assert.doesNotMatch(form,/<textarea|type="checkbox"|name="message"|name="interests"/);
  assert.match(form,/>Request my free IT review<\/button>/);assert.match(home,/Book your free IT review\./);
  assert.match(home,/<a\b[^>]*class="btn hero-cta"[^>]*href="\/contact\?intent=review"/);assert.match(html,/<a class="mega-item" href="\/contact\?intent=review" aria-current="page"/);
  const flow=fixture('?intent=general',true);assert.equal(flow.button.textContent,'Request my free IT review');assert.equal(flow.fields.length,4);
});
test('verified contact sidebar and emergency route remain available',()=>{assert.match(html,/href="tel:\+96181816761"/);assert.match(html,/href="mailto:info@itkeepers\.com"/);assert.match(html,/href="\/emergency\/"[^>]*>Get emergency help/);});
test('service interest chips expose exactly eight optional native checkbox choices',()=>{
  assert.equal(data.exports.serviceInterests.length,8);assert.equal((html.match(/type="checkbox" name="interests"/g)??[]).length,8);
  for(const interest of data.exports.serviceInterests)assert.ok(html.includes(`value="${interest.value}"`));assert.match(html,/>Interested in <span>\(optional\)<\/span>/);
  const api=data.exports;assert.deepEqual([...api.validateServiceInterests([])],[]);assert.deepEqual([...api.validateServiceInterests(['managed-it','cybersecurity','managed-it'])],['managed-it','cybersecurity']);assert.throws(()=>api.validateServiceInterests(['unsupported']),/Unsupported/);assert.throws(()=>api.validateServiceInterests(['not-sure','managed-it']),/Choose services/);assert.throws(()=>api.validateServiceInterests([null]),/Unsupported/);
});
test('multiple interests become structured form data and Not sure yet excludes services in both directions',()=>{
  const flow=fixture();flow.interests[0].checked=true;flow.interests[0].emit('change');flow.interests[1].checked=true;flow.interests[1].emit('change');assert.deepEqual([...flow.exports.selectedServiceInterests(flow.form)],['managed-it','cybersecurity']);
  flow.interests[7].checked=true;flow.interests[7].emit('change');assert.deepEqual([...flow.exports.selectedServiceInterests(flow.form)],['not-sure']);
  flow.interests[6].checked=true;flow.interests[6].emit('change');assert.deepEqual([...flow.exports.selectedServiceInterests(flow.form)],['web-design-hosting']);flow.interests[6].checked=false;flow.interests[6].emit('change');assert.deepEqual([...flow.exports.selectedServiceInterests(flow.form)],[]);
});
