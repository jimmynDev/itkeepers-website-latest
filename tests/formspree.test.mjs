import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { parse } from 'parse5';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const modules={};
function load(name){
 if(modules[name])return modules[name];
 const context={exports:{},FormData,require:path=>{assert.equal(path,'./inquiry');return load('inquiry')}};
 vm.runInNewContext(ts.transpileModule(read('src/data/'+name+'.ts'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);
 return modules[name]=context.exports;
}
const api=load('formspree');
const values={name:'Example Person',email:'person@example.test',company:'Example & Co',phone:'+961 81 000 000',message:'First line\nCafé & cloud? #test'};
function data(extra={}){const d=new FormData();for(const [k,v] of Object.entries({...values,_gotcha:'',...extra}))d.set(k,v);return d;}

test('Formspree payload preserves fields and maps all selected IDs to readable service names',()=>{
 const d=data();d.append('interests','managed-it');d.append('interests','microsoft-cloud');
 const p=api.formspreePayload(d,'general',false);
 for(const [k,v] of Object.entries(values))assert.equal(p.get(k),v);
 assert.deepEqual(p.getAll('interests'),['managed-it','microsoft-cloud']);
 assert.equal(p.get('services'),'Managed IT, Microsoft 365 and Cloud');
 assert.equal(p.get('type'),'general');assert.equal(p.get('form_kind'),'contact');assert.equal(p.get('_gotcha'),'');
 assert.equal(api.formspreeEndpoint,'https://formspree.io/f/mrppzvpo');
});

test('optional values and review intent survive without inventing a visitor message',()=>{
 const d=data({company:'',phone:'',message:"I'd like a free IT review."});
 const p=api.formspreePayload(d,'review',true);assert.equal(p.get('company'),'');assert.equal(p.get('phone'),'');
 assert.equal(p.get('message'),"I'd like a free IT review.");assert.equal(p.get('form_kind'),'review');assert.match(p.get('_subject'),/Free IT review/);
});

test('provider submission is allowlisted and excludes injected envelope, redirects, files and credentials',()=>{
 const d=data({to:'other@example.test',bcc:'someone@example.test',_next:'https://example.test',request_id:'private',token:'private'});
 const p=api.formspreePayload(d,'general',false);
 for(const key of ['to','bcc','_next','request_id','token'])assert.equal(p.has(key),false);
 d.set('email',new Blob(['private file']),'file.txt');assert.throws(()=>api.formspreePayload(d,'general',false));
});

test('honeypot, contradictory/unknown services and invalid required fields cannot reach the provider',()=>{
 for(const patch of [{_gotcha:'bot'},{name:''},{email:'wrong'},{message:''}])assert.throws(()=>api.formspreePayload(data(patch),'general',false));
 for(const list of [['not-sure','managed-it'],['unknown']]){const d=data();list.forEach(v=>d.append('interests',v));assert.throws(()=>api.formspreePayload(d,'general',false));}
});

test('only confirmed successful provider JSON responses can produce acceptance',()=>{
 for(const status of [200,201,202])for(const value of [{ok:true},{next:'/thanks?language=en'},{ok:true,next:'/thanks'}])assert.equal(api.formspreeAccepted(status,value),true);
 for(const status of [400,403,422,429,500])assert.equal(api.formspreeAccepted(status,{ok:true,next:'/thanks'}),false);
 for(const value of [null,{},'html',{ok:false},{ok:true,error:'spam'},{ok:true,errors:[]},{next:'/captcha'},{next:'/verify'}])assert.equal(api.formspreeAccepted(200,value),false);
});

test('rate limiting, blocked requests, challenge, inactive forms and field errors are distinguished',()=>{
 assert.match(api.formspreeFailure(429,{}).message,/limiting requests/);
 assert.equal(api.formspreeFailure(403,{}).verification,true);
 assert.equal(api.formspreeFailure(400,{errors:[{code:'BLOCKED',message:'Rejected'}]}).verification,true);
 assert.equal(api.formspreeFailure(400,{errors:[{field:'g-recaptcha-response',message:'Captcha required'}]}).verification,true);
 assert.match(api.formspreeFailure(400,{errors:[{code:'INACTIVE',message:'Activate form'}]}).message,/not ready/);
 assert.match(api.formspreeFailure(500,{}).message,/could not confirm whether/);
 assert.equal(api.formspreeErrors({errors:[{field:'email',code:'TYPE_EMAIL',message:'Check email'}]})[0].field,'email');
});

test('CSP allows only the fixed AJAX endpoint and provider navigation while preserving other controls',()=>{
 const csp=read('public/_headers').match(/Content-Security-Policy: ([^\r\n]+)/)[1];
 const directives=Object.fromEntries(csp.split(';').map(v=>v.trim().split(/\s+/)).filter(([k])=>k).map(([k,...v])=>[k,v]));
 assert.deepEqual(directives['connect-src'],["'self'",api.formspreeEndpoint]);
 assert.deepEqual(directives['form-action'],["'self'",'https://formspree.io']);
 for(const key of ['script-src','font-src','manifest-src'])assert.deepEqual(directives[key],["'self'"]);
 for(const key of ['frame-src','worker-src','frame-ancestors','object-src','base-uri'])assert.deepEqual(directives[key],["'none'"]);
});

test('native HTML retains required fields, labelled service choices, honeypot and processor disclosure',()=>{
 const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
 for(const file of ['dist/index.html','dist/contact/index.html']){
  const nodes=walk(parse(read(file))),forms=nodes.filter(n=>n.tagName==='form'&&attr(n,'data-inquiry-form')!==undefined);assert.equal(forms.length,1);
  const form=forms[0];assert.equal(attr(form,'action'),api.formspreeEndpoint);assert.equal(attr(form,'method'),'post');assert.equal(attr(form,'novalidate'),undefined);
  assert(nodes.some(n=>n.tagName==='input'&&attr(n,'name')==='_gotcha'));
  if(file.includes('/contact/'))for(const input of nodes.filter(n=>n.tagName==='input'&&attr(n,'name')==='interests')){
   assert.equal(attr(input,'hidden'),undefined);assert(nodes.some(n=>n.tagName==='label'&&attr(n,'for')===attr(input,'id')));
  }
  assert(read(file).includes('Formspree processes your submission for delivery to our configured notification inbox.'));
  assert(read(file).includes('href="/privacy/">Privacy notice</a>'));
 }
 assert(read('dist-staging/privacy/index.html').includes('content="noindex, follow"'));
});

test('privacy candidate explains the actual form flow without inventing a retention deadline or delivery guarantee',()=>{
 const html=read('dist-staging/privacy/index.html');
 for(const text of ['Information you submit','Purpose and delivery','Provider processing and retention','Privacy questions and requests','external form-processing provider','United States','account plan','retained separately','mailto:info@itkeepers.com','not that an email has reached the inbox or been read'])assert(html.includes(text),text);
 assert(html.includes('content="noindex, follow"'));
 assert.doesNotMatch(html,/automatically deleted after|deleted within|approved Privacy|GDPR compliant|30 days|90 days/i);
});
