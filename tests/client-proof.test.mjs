import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const compiled=ts.transpileModule(readFileSync(new URL('../src/scripts/client-proof.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return{promise,resolve,reject};};
function events(properties={}) {
  const handlers=new Map();
  return Object.assign(properties,{addEventListener(name,fn){if(!handlers.has(name))handlers.set(name,new Set());handlers.get(name).add(fn);},removeEventListener(name,fn){handlers.get(name)?.delete(fn);},emit(name){return Promise.all([...(handlers.get(name)??[])].map(fn=>fn({currentTarget:this})));},count(name){return handlers.get(name)?.size??0;}});
}
function fixture({pending=false}={}) {
  const items=[1,2].map(i=>({id:`qa-${i}`,label:`QA media ${i}`,approved:true,sources:[{src:`/qa-${i}.webm`,type:'video/webm'}],poster:`/qa-${i}.png`,captions:[{src:`/qa-${i}.vtt`,srclang:'en',label:'English'}],transcript:`/qa-${i}.txt`}));
  const document=events({hidden:false,activeElement:{name:'original'},createElement:tag=>({tag})});
  const window=events({IntersectionObserver:true});
  const facade={hidden:false},play=events({disabled:false,hidden:true,focus(){document.activeElement=this;}}),frame={name:'stable frame'},poster={},transcript={},label={},status={textContent:''};
  const buttons=items.map(item=>events({dataset:{proofSelect:item.id},disabled:false,attributes:{},setAttribute(name,value){this.attributes[name]=value;}}));
  const video={hidden:true,children:[],loads:0,pauses:0,plays:0,attributes:{},replaceChildren(){this.children=[];},removeAttribute(name){delete this.attributes[name];},setAttribute(name,value){this.attributes[name]=value;},append(child){this.children.push(child);},querySelector(tag){return this.children.find(child=>child.tag===tag);},load(){this.loads++;},pause(){this.pauses++;},play(){this.plays++;return this.nextPlay?.promise??Promise.resolve();},focus(){document.activeElement=this;}};
  const elements={'[data-proof-config]':pending?null:{textContent:JSON.stringify(items)},'[data-proof-video]':pending?null:video,'[data-proof-facade]':facade,'[data-proof-play]':play,'[data-proof-poster]':poster,'[data-proof-transcript]':transcript,'[data-proof-video-label]':label,'[data-proof-status]':status,'.proof-media-frame':frame};
  const root={querySelector:key=>elements[key],querySelectorAll:()=>buttons};
  const scope={querySelectorAll:()=>[root]},observers=[];
  class Observer {constructor(callback){this.callback=callback;observers.push(this);}observe(element){this.element=element;}disconnect(){this.disconnected=true;}exit(){this.callback([{isIntersecting:false}]);}}
  const exports={};vm.runInNewContext(compiled,{exports,document,window,IntersectionObserver:Observer});
  return{initialize:()=>exports.initializeClientProof(scope),items,document,window,facade,play,frame,poster,transcript,label,status,buttons,video,observers};
}

test('pending testimonial slots install no player, observer or interaction handlers',()=>{
  const h=fixture({pending:true});h.initialize();assert.equal(h.observers.length,0);assert.equal(h.play.count('click'),0);assert.equal(h.video.loads,0);assert.equal(h.document.count('visibilitychange'),0);
});
test('explicit playback loads only selected sources and captions; manual selection releases prior media',async()=>{
  const h=fixture();h.initialize();assert.equal(h.video.loads,0);assert.equal(h.play.hidden,false);await h.play.emit('click');assert.equal(h.video.plays,1);assert.deepEqual(h.video.children.map(x=>x.src),['/qa-1.webm','/qa-1.vtt']);assert.equal(h.document.activeElement,h.video);assert.equal(h.video.hidden,false);assert.equal(h.facade.hidden,true);assert.equal(h.video.children[1].kind,'captions');assert.equal(h.video.children[1].default,true);
  await h.buttons[1].emit('click');assert.equal(h.video.children.length,0);assert.equal(h.video.hidden,true);assert.equal(h.facade.hidden,false);assert.equal(h.poster.src,'/qa-2.png');assert.equal(h.transcript.href,'/qa-2.txt');assert.equal(h.buttons[1].attributes['aria-pressed'],'true');await h.play.emit('click');assert.deepEqual(h.video.children.map(x=>x.src),['/qa-2.webm','/qa-2.vtt']);
});
test('offscreen pause invalidates pending playback without error status or moving keyboard focus',async()=>{
  const h=fixture();h.initialize();assert.equal(h.observers[0].element,h.frame);const original=h.document.activeElement;h.video.nextPlay=deferred();const started=h.play.emit('click');h.observers[0].exit();h.video.nextPlay.reject(new Error('Intentional pause'));await started;assert.equal(h.document.activeElement,original);assert.equal(h.status.textContent,'');assert.equal(h.play.disabled,false);assert(h.video.pauses>0);
});
test('hidden document and changed selection invalidate stale playback completion',async()=>{
  for(const reason of ['hidden','selection']){const h=fixture();h.initialize();const original=h.document.activeElement;h.video.nextPlay=deferred();const started=h.play.emit('click');if(reason==='hidden'){h.document.hidden=true;await h.document.emit('visibilitychange');}else await h.buttons[1].emit('click');h.video.nextPlay.resolve();await started;assert.equal(h.document.activeElement,original);assert.equal(h.status.textContent,'');assert.equal(h.play.disabled,false);}
});
test('repeated initialization and cleanup leave one controller and release media listeners',async()=>{
  const h=fixture();h.initialize();h.initialize();assert.equal(h.observers.length,1);assert.equal(h.play.count('click'),1);await h.document.emit('astro:before-swap');assert(h.observers[0].disconnected);assert.equal(h.play.count('click'),0);assert.equal(h.document.count('visibilitychange'),0);assert.equal(h.window.count('pagehide'),0);assert.equal(h.video.children.length,0);
});
