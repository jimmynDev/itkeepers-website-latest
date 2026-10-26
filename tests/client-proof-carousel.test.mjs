import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const compiled=ts.transpileModule(readFileSync(new URL('../src/scripts/client-proof-carousel.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
function events(properties={}) {
  const handlers=new Map();
  return Object.assign(properties,{addEventListener(name,fn){if(!handlers.has(name))handlers.set(name,new Set());handlers.get(name).add(fn);},removeEventListener(name,fn){handlers.get(name)?.delete(fn);},emit(name,extra={}){for(const fn of [...(handlers.get(name)??[])])fn({currentTarget:this,...extra});},count(name){return handlers.get(name)?.size??0;}});
}
function fixture({reduced=false,rotationControl=true,observerAvailable=false}={}) {
  let now=0,id=0;const timers=new Map();
  const document=events({hidden:false,activeElement:null}),window=events(),media=events({matches:reduced});
  const stage={dataset:{}},navigation={hidden:true},previous=events(),next=events(),icon={textContent:''},status={textContent:''};
  const attributes=properties=>Object.assign(properties,{attributes:{},setAttribute(name,value){this.attributes[name]=value;},removeAttribute(name){delete this.attributes[name];}});
  const rotation=events(attributes({}));
  const dots=Array.from({length:4},(_,i)=>events(attributes({dataset:{proofDot:String(i)}})));
  const slides=Array.from({length:4},(_,i)=>attributes({offsetWidth:900,querySelector:()=>({textContent:`TEST ONLY ${i}`})}));
  const controls=[previous,next,rotation,...dots];
  const selectors={'[data-proof-stage]':stage,'[data-proof-navigation]':navigation,'[data-proof-previous]':previous,'[data-proof-next]':next,'[data-proof-rotation]':rotationControl?rotation:null,'[data-proof-rotation-icon]':rotationControl?icon:null,'[data-proof-quote-status]':status};
  const root=events({dataset:{},matches:()=>false,contains:item=>controls.includes(item),querySelector:s=>selectors[s],querySelectorAll:s=>s==='[data-proof-slide]'?slides:dots});
  let observe,disconnected=0;class Observer{constructor(fn){observe=fn}observe(){}disconnect(){disconnected++}}if(observerAvailable)window.IntersectionObserver=Observer;
  const exports={};vm.runInNewContext(compiled,{exports,document,window,IntersectionObserver:Observer,performance:{now:()=>now},matchMedia:()=>media,setTimeout:(fn,delay)=>{timers.set(++id,{at:now+delay,fn});return id;},clearTimeout:id=>timers.delete(id)});
  const initialize=()=>exports.initializeClientProofCarousel({querySelectorAll:()=>[root]});
  const tick=ms=>{const target=now+ms;while(true){const next=[...timers].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].fn();}now=target;};
  const visible=()=>slides.filter(s=>s.attributes['aria-hidden']==='false');
  return {initialize,tick,root,stage,slides,dots,previous,next,rotation,navigation,status,media,document,window,timers,visible,viewport:v=>observe?.([{target:root,isIntersecting:v}]),disconnected:()=>disconnected};
}
test('actual carousel rotates all four quotes after 10-second holds with one visible slide throughout',()=>{
  const h=fixture();h.initialize();assert.equal(h.navigation.hidden,false);
  for(let index=0;index<5;index++){
    assert.equal(h.root.dataset.activeQuote,String(index%4));assert.equal(h.visible().length,1);
    h.tick(9999);assert.equal(h.root.dataset.activeQuote,String(index%4));h.tick(1);assert.equal(h.stage.dataset.phase,'out');
    h.tick(174);assert.equal(h.visible().length,1);h.tick(1);assert.equal(h.root.dataset.activeQuote,String((index+1)%4));assert.equal(h.visible().length,1);
    h.tick(175);
  }
  assert.equal(h.status.textContent,'','automatic changes do not repeatedly announce');
});
test('arrows, dots, wrapping and rapid input select the correct single quote without stealing focus',()=>{
  const h=fixture();h.initialize();h.root.emit('focusin');h.document.activeElement=h.next;
  h.next.emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'1');assert.equal(h.dots[1].attributes['aria-current'],'true');
  h.previous.emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'0');
  h.previous.emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'3');
  h.dots[1].emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'1');assert.match(h.status.textContent,/Testimonial 2 of 4/);
  h.next.emit('click');h.next.emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'3');assert.equal(h.visible().length,1);
  assert.equal(h.document.activeElement,h.next);
});
test('hover, focus, hidden tabs, page lifecycle and explicit pause prevent automatic rotation and resume safely',()=>{
  for(const reason of ['hover','focus','hidden','page','manual']){
    const h=fixture();h.initialize();h.tick(9000);
    if(reason==='hover')h.root.emit('mouseenter');
    if(reason==='focus')h.root.emit('focusin');
    if(reason==='hidden'){h.document.hidden=true;h.document.emit('visibilitychange');}
    if(reason==='page')h.window.emit('pagehide');
    if(reason==='manual')h.rotation.emit('click');
    h.tick(30000);assert.equal(h.root.dataset.activeQuote,'0',reason);
    if(reason==='hover')h.root.emit('mouseleave');
    if(reason==='focus')h.root.emit('focusout',{relatedTarget:null});
    if(reason==='hidden'){h.document.hidden=false;h.document.emit('visibilitychange');}
    if(reason==='page')h.window.emit('pageshow');
    if(reason==='manual')h.rotation.emit('click');
    h.tick(9999);assert.equal(h.root.dataset.activeQuote,'0');h.tick(351);assert.equal(h.root.dataset.activeQuote,'1');
  }
});
test('focus changes within controls keep rotation paused; reduced motion disables autoplay and makes manual changes instant',()=>{
  const h=fixture();h.initialize();h.root.emit('focusin');h.root.emit('focusout',{relatedTarget:h.dots[2]});h.tick(30000);assert.equal(h.root.dataset.activeQuote,'0');
  h.media.matches=true;h.media.emit('change');assert.equal(h.rotation.disabled,true);h.next.emit('click');assert.equal(h.root.dataset.activeQuote,'1');assert.equal(h.stage.dataset.phase,'idle');h.tick(30000);assert.equal(h.root.dataset.activeQuote,'1');
  h.media.matches=false;h.media.emit('change');h.root.emit('focusout',{relatedTarget:null});h.tick(10350);assert.equal(h.root.dataset.activeQuote,'2');
  const initial=fixture({reduced:true});initial.initialize();initial.tick(30000);assert.equal(initial.root.dataset.activeQuote,'0');initial.dots[3].emit('click');assert.equal(initial.root.dataset.activeQuote,'3');
});
test('repeated initialization and Astro cleanup leave one controller and no pending work',()=>{
  const h=fixture();h.initialize();h.initialize();assert.equal(h.next.count('click'),1);assert.equal(h.timers.size,1);
  h.next.emit('click');h.document.emit('astro:before-swap');assert.equal(h.timers.size,0);assert.equal(h.next.count('click'),0);assert.equal(h.media.count('change'),0);assert.equal(h.window.count('pagehide'),0);assert.equal(h.document.count('visibilitychange'),0);
  h.tick(30000);assert.equal(h.root.dataset.activeQuote,'0');
});
test('pausing during an automatic fade cancels its pending change without cancelling manual navigation',()=>{
  for(const reason of ['hover','focus','hidden']){
    const h=fixture();h.initialize();h.tick(10001);assert.equal(h.stage.dataset.phase,'out');
    if(reason==='hover')h.root.emit('mouseenter');
    if(reason==='focus')h.root.emit('focusin');
    if(reason==='hidden'){h.document.hidden=true;h.document.emit('visibilitychange');}
    h.tick(30000);assert.equal(h.root.dataset.activeQuote,'0');assert.equal(h.visible().length,1);assert.equal(h.stage.dataset.phase,'idle');
    h.next.emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'1');
  }
});

test('without a separate pause button automatic rotation works until an arrow or dot stops it for the visit',()=>{
  const h=fixture({rotationControl:false});h.initialize();
  assert.equal(h.navigation.hidden,false);assert.equal(h.timers.size,1);
  h.tick(10350);assert.equal(h.root.dataset.activeQuote,'1');
  h.next.emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'2');
  h.tick(30000);assert.equal(h.root.dataset.activeQuote,'2');
  h.dots[3].emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'3');
  h.previous.emit('click');h.tick(350);assert.equal(h.root.dataset.activeQuote,'2');
  h.tick(30000);assert.equal(h.root.dataset.activeQuote,'2');assert.equal(h.timers.size,0);
  const dot=fixture({rotationControl:false});dot.initialize();dot.dots[0].emit('click');
  dot.tick(30000);assert.equal(dot.root.dataset.activeQuote,'0');assert.equal(dot.timers.size,0);
});

test('offscreen carousel retains its remaining ten-second hold without rotating or duplicating timers',()=>{const h=fixture({observerAvailable:true,rotationControl:false});h.initialize();h.tick(30000);assert.equal(h.root.dataset.activeQuote,'0');assert.equal(h.timers.size,0);h.viewport(true);h.tick(3000);h.viewport(false);h.tick(30000);assert.equal(h.root.dataset.activeQuote,'0');assert.equal(h.timers.size,0);h.viewport(true);h.tick(6999);assert.notEqual(h.stage.dataset.phase,'out');h.tick(1);assert.equal(h.stage.dataset.phase,'out');h.tick(175);assert.equal(h.root.dataset.activeQuote,'1');h.document.emit('astro:before-swap');assert.equal(h.disconnected(),1);assert.equal(h.timers.size,0);});
