import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const compile = path => ts.transpileModule(read(path), { compilerOptions: { module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022 } }).outputText;
const lifecycle = compile('src/scripts/animation-lifecycle.ts');
const controller = compile('src/scripts/approved-operate-animations.ts');
function target(properties={}) {
  const events=new Map();
  return Object.assign(properties, {
    addEventListener(name,fn){if(!events.has(name))events.set(name,new Set());events.get(name).add(fn);},
    removeEventListener(name,fn){events.get(name)?.delete(fn);},
    emit(name,event={}){for(const fn of events.get(name)??[])fn(event);},
    count(){return [...events.values()].reduce((sum,set)=>sum+set.size,0);},
  });
}
function classes(initial=[]) {
  const names=new Set(initial);
  return {add(...values){values.forEach(v=>names.add(v));},remove(...values){values.forEach(v=>names.delete(v));},toggle(name,enabled){enabled?names.add(name):names.delete(name);},contains(name){return names.has(name);}};
}
function harness(reduced=false) {
  let now=0,id=0,steps;
  const timers=new Map(),observers=new Map();
  const media=target({matches:reduced});
  const document=target({hidden:false,querySelectorAll:selector=>selector==='.operate-process'?[root]:[]});
  const window=target({matchMedia:()=>media});
  const rail={getBoundingClientRect:()=>({top:100,height:130})};
  const axis={getBoundingClientRect:()=>({top:111,height:108})};
  const ticket={style:{},classList:classes()},fill={style:{}},status={textContent:'Documented'};
  const reset=()=>{steps=Array.from({length:4},(_,i)=>({classList:classes(['is-complete']),querySelector:()=>({getBoundingClientRect:()=>({top:106+i*36,height:10})})}));};
  reset();
  const visual={dataset:{phase:'settled'},style:{},className:'incident-panel',
    get innerHTML(){return 'authored complete workflow';},set innerHTML(_){reset();},
    getAttribute(name){return name==='data-phase'?this.dataset.phase:null;},
    setAttribute(name,value){if(name==='data-phase')this.dataset.phase=value;},removeAttribute(){},
    getBoundingClientRect(){return {};},
    querySelector(selector){return {'.incident-rail':rail,'.incident-axis':axis,'.incident-ticket':ticket,'.incident-fill':fill,'[data-incident-status]':status}[selector];},
    querySelectorAll(selector){return selector==='[data-process-step]'?steps:[];},
  };
  const root={dataset:{},classList:classes(),closest:()=>null,querySelector:selector=>selector==='[data-animation-toggle]'?null:visual};
  class Observer {
    constructor(callback,options){this.callback=callback;observers.set(options.rootMargin,this);}
    observe(){this.connected=true;}disconnect(){this.connected=false;}
    emit(visible){if(this.connected)this.callback([{target:root,isIntersecting:visible}]);}
  }
  window.IntersectionObserver=Observer;
  const shared={window,document,IntersectionObserver:Observer,performance:{now:()=>now},
    setTimeout(callback,delay){const key=++id;timers.set(key,{callback,at:now+delay});return key;},clearTimeout(key){timers.delete(key);}};
  const lifecycleExports={};vm.runInNewContext(lifecycle,{...shared,exports:lifecycleExports});
  vm.runInNewContext(controller,{...shared,exports:{},require(name){assert.equal(name,'./animation-lifecycle');return lifecycleExports;}});
  return {root,visual,status,ticket,fill,media,document,window,timers,observers,
    steps:()=>steps,
    visible(value=true){observers.get('0px')?.emit(value);observers.get('-96px 0px')?.emit(value);},
    leave(){this.visible(false);observers.get('160px 0px')?.emit(false);},
    tick(duration){const end=now+duration;while(true){const next=[...timers].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at||a[0]-b[0])[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].callback();}now=end;},
    active(){return steps.findIndex(step=>step.classList.contains('is-active'));},
  };
}

test('production preserves four stages and links to the relocated native security disclosures',()=>{
  const html=read('dist/index.html');
  const figure=html.match(/<figure[^>]*data-animation="operational-workflow"[\s\S]*?<\/figure>/)[0];
  assert.equal((figure.match(/data-process-step=/g)??[]).length,4);
  const titles=[...figure.matchAll(/<strong[^>]*>([^<]+)<\/strong>/g)].map(m=>m[1]);
  assert.deepEqual(titles,['Issue detected','Engineer assigned','Resolved','Documented']);
  assert.doesNotMatch(figure,/Ticket created automatically|incident-foot|One example, from first signal/);
  assert.equal((figure.match(/class="incident-detail"/g)??[]).length,1,'Documented follow-up remains in accessible HTML');
  assert.match(figure,/aria-label="Example incident workflow from detection to documentation"/);
  assert.doesNotMatch(html,/Illustrative examples, not a response-time guarantee or a device diagnosis/);
  assert.doesNotMatch(html,/class="operate-details"/);
  assert.match(html,/href="\/services\/cybersecurity\/#security-layers"[^>]*>See how we handle security/);
  const security=read('dist/services/cybersecurity/index.html');
  const technical=security.match(/<section[^>]*id="security-layers"[\s\S]*?(?=<section[^>]*id="cybersecurity-animation")/)[0];
  assert.equal((technical.match(/<details\b/g)??[]).length,8);
  assert.doesNotMatch(technical,/<details\b[^>]*\bopen(?:\s|=|>)/);
  assert.ok(technical.includes('Daily checks, explained.'));
  assert.ok(technical.includes('Security, maintained in layers.'));
});

test('all four stages activate in order, handoff aligns and the workflow settles once',()=>{
  const h=harness();h.visible();assert.equal(h.active(),-1);assert.equal(h.status.textContent,'Ready');
  h.tick(399);assert.equal(h.active(),-1);
  h.tick(1);
  for(const [i,phase] of ['detect','assign','resolve','document'].entries()){
    if(i)h.tick(570);assert.equal(h.active(),i);assert.equal(h.visual.dataset.phase,phase);assert.equal(h.ticket.style.transform,`translateY(${i*36}px)`);
    assert.equal(h.ticket.classList.contains('is-handoff'),i===1);
  }
  h.tick(990);assert.equal(h.root.dataset.animationState,'settled');assert.equal(h.status.textContent,'Documented');assert.equal(h.fill.style.transform,'scaleY(1)');assert.equal(h.timers.size,0);
  assert.ok(h.steps().every(s=>s.classList.contains('is-complete')));h.tick(10000);assert.equal(h.timers.size,0);
});

test('a shallow scroll exit pauses the active stage without advancing or restarting it',()=>{
  const h=harness();h.visible();h.tick(700);h.visible(false);h.tick(10000);assert.equal(h.active(),0);assert.equal(h.visual.dataset.phase,'detect');
  h.visible();h.tick(269);assert.equal(h.active(),0);h.tick(1);assert.equal(h.active(),1);assert.equal(h.status.textContent,'Assigned');
});

test('full scroll exit retains the completed four-stage explanation without replay',()=>{
  const h=harness(),listeners=h.document.count()+h.window.count();
  h.visible();h.tick(3100);for(let i=0;i<3;i++){h.visible();assert.equal(h.active(),-1);h.tick(3100);assert.equal(h.status.textContent,'Documented');assert.equal(h.timers.size,0);h.leave();h.tick(5000);}
  assert.equal(h.document.count()+h.window.count(),listeners);assert.equal(h.observers.size,2);
});

test('initial reduced motion shows the complete workflow without timers, retaining preference observers',()=>{
  const h=harness(true);assert.equal(h.root.dataset.animationState,'settled');assert.ok(h.steps().every(s=>s.classList.contains('is-complete')));assert.equal(h.status.textContent,'Documented');assert.equal(h.timers.size,0);assert.equal(h.observers.size,2);
});

test('switching to reduced motion mid-workflow settles once and disables future replay',()=>{
  const h=harness();h.visible();h.tick(700);h.media.matches=true;h.media.emit('change');assert.equal(h.root.dataset.animationState,'settled');assert.ok(h.steps().every(s=>s.classList.contains('is-complete')));assert.equal(h.timers.size,0);
  h.media.matches=false;h.media.emit('change');h.leave();h.visible();h.tick(5000);assert.equal(h.status.textContent,'Documented');assert.equal(h.timers.size,0);
});

test('repeated page initialization does not duplicate stage timers, observers or cleanup listeners',()=>{
  const h=harness();h.visible();h.tick(200);const timers=h.timers.size,listeners=h.document.count()+h.window.count();
  for(let i=0;i<5;i++)h.document.emit('astro:page-load');assert.equal(h.timers.size,timers);assert.equal(h.document.count()+h.window.count(),listeners);assert.equal(h.observers.size,2);h.tick(4600);assert.equal(h.timers.size,0);
});
