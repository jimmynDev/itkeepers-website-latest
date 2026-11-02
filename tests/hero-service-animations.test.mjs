import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(name, globals) {
 const exports={};const source=fs.readFileSync(`src/scripts/${name}.ts`,'utf8');
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,...globals});return exports;
}
function radarHarness(){
 let now=0,next=0;const frames=new Map(),events=new Map(),classes=new Set();
 const ctx=new Proxy({},{get(t,k){return t[k]??(()=>{});}});
 const canvas={width:300,height:150,getContext(){return ctx;}};
 const status={textContent:''};const radar={dataset:{},classList:{toggle(k,v){if(v)classes.add(k);else classes.delete(k);}},getBoundingClientRect(){return{width:280};},querySelector(s){return s==='canvas'?canvas:status;}};
 let resize,disconnected=false;
 const reduced={matches:false};
 const globals={window:{devicePixelRatio:2,matchMedia(){return reduced;},addEventListener(n,f){events.set(n,f);},removeEventListener(n){events.delete(n);}},performance:{now:()=>now},requestAnimationFrame(f){frames.set(++next,f);return next;},cancelAnimationFrame(id){frames.delete(id);},ResizeObserver:class{constructor(f){resize=f;}observe(){}disconnect(){disconnected=true;}}};
 const timeline=load('cybersecurity-radar',globals).createRadarTimeline({querySelector(){return radar;}});
 return{timeline,radar,canvas,status,frames,events,classes,reduced,resize(){resize();},get disconnected(){return disconnected;},advance(ms){now+=ms;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(f=>f(now));}};
}
test('radar retains all three source phases across repeated cycles',()=>{
 const h=radarHarness();assert.equal(h.radar.dataset.radarPhase,'contained');assert.equal(h.canvas.width,560);assert.equal(h.frames.size,0);
 h.timeline.activity(true);assert.equal(h.frames.size,1);assert.equal(h.radar.dataset.radarPhase,'approach');
 h.advance(4000);assert.equal(h.status.textContent,'Threat blocked');assert.ok(h.classes.has('is-threat'));
 h.advance(2000);assert.equal(h.status.textContent,'Threat contained');assert.ok(!h.classes.has('is-threat'));
 h.advance(3000);assert.equal(h.status.textContent,'Endpoint watched');h.advance(3200);assert.equal(h.status.textContent,'Threat blocked');
});
test('radar parks its only frame clock without resetting elapsed progress and disposes cleanly',()=>{
 const h=radarHarness();h.timeline.activity(true);h.advance(4000);h.timeline.activity(false);assert.equal(h.frames.size,0);
 h.advance(60000);assert.equal(h.radar.dataset.radarPhase,'intercept');h.timeline.activity(true);h.timeline.activity(true);assert.equal(h.frames.size,1);
 h.advance(100);assert.equal(h.radar.dataset.radarPhase,'intercept');h.timeline.activity(false);h.timeline.settle();assert.equal(h.status.textContent,'Threat contained');
 h.timeline.dispose();assert.ok(h.disconnected);assert.equal(h.events.size,0);assert.equal(h.frames.size,0);
});
test('repeated reduced-motion changes return to containment, including while already offscreen',()=>{
 const h=radarHarness();h.timeline.activity(true);h.advance(4000);h.reduced.matches=true;h.timeline.activity(false);assert.equal(h.radar.dataset.radarPhase,'contained');
 h.reduced.matches=false;h.timeline.activity(true);assert.equal(h.radar.dataset.radarPhase,'intercept');h.timeline.activity(false);h.reduced.matches=true;h.timeline.activity(false);h.resize();assert.equal(h.radar.dataset.radarPhase,'contained');assert.equal(h.frames.size,0);
});
function cloudHarness(){
 const visual={dataset:{active:'entra'}};let paused=true;const starts=[];
 const buttons=['entra','exchange','intune','sharepoint'].map(id=>({dataset:{id},listeners:new Map(),attributes:{},setAttribute(k,v){this.attributes[k]=v;},addEventListener(n,f){this.listeners.set(n,f);},removeEventListener(n){this.listeners.delete(n);},click(){this.listeners.get('click')({currentTarget:this});}}));
 const network={pauseAnimations(){paused=true;},unpauseAnimations(){paused=false;},setCurrentTime(){},querySelectorAll(){return [0,2.8,5.5,2.3,3.8,.8,3.2,.1].map(delay=>({dataset:{signalDelay:delay},beginElementAt(v){starts.push(v);}}));}};
 const root={querySelector(s){return s==='[data-animation-visual]'?visual:s==='.network'?network:null;},querySelectorAll(){return buttons;}};
 const timeline=load('cloud-hero-animation',{}).createCloudHeroTimeline(root);
 return{timeline,visual,buttons,starts,get paused(){return paused;}};
}
test('cloud selection works while motion is paused, remains selected on resume, and clocks start once',()=>{
 const h=cloudHarness();h.timeline.activity(true);assert.equal(h.starts.length,8);assert.ok(!h.paused);
 h.timeline.activity(false);h.buttons[2].click();assert.equal(h.visual.dataset.active,'intune');
 assert.equal(h.buttons[2].attributes['aria-pressed'],'true');assert.equal(h.buttons[0].attributes['aria-pressed'],'false');
 h.timeline.activity(true);h.timeline.activity(true);assert.equal(h.starts.length,8);assert.equal(h.visual.dataset.active,'intune');
 h.timeline.dispose();assert.ok(h.paused);assert.ok(h.buttons.every(b=>!b.listeners.size));
});
test('cloud instances keep independent selection and respect a static first render',()=>{
 const a=cloudHarness(),b=cloudHarness();a.timeline.settle();assert.equal(a.starts.length,0);assert.ok(a.paused);
 a.buttons[3].click();assert.equal(a.visual.dataset.active,'sharepoint');assert.equal(b.visual.dataset.active,'entra');
 a.timeline.activity(true);assert.equal(a.starts.length,8);assert.equal(a.visual.dataset.active,'sharepoint');
});

test('dedicated hero compositions never mount in the restored homepage sections',()=>{
 const home=fs.readFileSync('dist/index.html','utf8'),cloud=fs.readFileSync('dist/services/microsoft-cloud/index.html','utf8'),security=fs.readFileSync('dist/services/cybersecurity/index.html','utf8');
 assert.equal((home.match(/data-animation="cloud-ecosystem"/g)||[]).length,1);assert.equal((home.match(/data-animation="security-badge"/g)||[]).length,1);
 assert.doesNotMatch(home,/data-animation="(?:cloud-hero|cybersecurity-hero-radar)"/);
 assert.equal((cloud.match(/data-animation="cloud-hero"/g)||[]).length,1);assert.equal((security.match(/data-animation="cybersecurity-hero-radar"/g)||[]).length,1);
 for(const label of ['Entra ID','Microsoft 365','Intune','Exchange','SharePoint'])assert.ok(cloud.includes(label),label);
 const services=fs.readFileSync('src/components/Services.astro','utf8');assert.doesNotMatch(services,/CloudHeroAnimation|CybersecurityHeroRadar/);
 const rules=fs.readFileSync('public/_redirects','utf8');assert.match(rules,/^\/services\/cloud\/ \/services\/microsoft-cloud\/ 301$/m);
});
