import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
test('global control retains user pause through media changes and leaves focus/storage alone',()=>{
 const source=ts.transpileModule(fs.readFileSync('src/scripts/page-motion-control.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const events=new Map(),attributes=new Map(),choices=[];
 const media={matches:false,addEventListener(n,f){events.set('media',f)}};
 const button={hidden:true,setAttribute(n,v){attributes.set(n,v)},addEventListener(n,f){events.set(n,f)}};
 const document={documentElement:{toggleAttribute(n,on){attributes.set(n,on)}},querySelector(){return{setAttribute(n,v){attributes.set(n,v)}}},dispatchEvent(e){choices.push(e.detail)}};
 const exports={};vm.runInNewContext(source,{exports,document,matchMedia:()=>media,CustomEvent:class{constructor(n,o){this.detail=o.detail}}});
 exports.mountPageMotionControl(button);assert.equal(button.hidden,false);assert.equal(button.textContent,'Pause motion');
 events.get('click')();assert.equal(button.textContent,'Resume motion');assert.equal(attributes.get('data-motion-paused'),true);
 assert(attributes.has('data-headline-entered'),'pause finishes an entrance instead of retaining an invisible frame');
 media.matches=true;events.get('media')();assert.equal(button.disabled,true);
 media.matches=false;events.get('media')();assert.equal(button.textContent,'Resume motion');assert.equal(choices.at(-1),true);
 events.get('click')();assert.equal(choices.at(-1),false);
});
