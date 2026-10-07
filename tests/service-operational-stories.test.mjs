import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
const compiled=ts.transpileModule(readFileSync(new URL('../src/scripts/service-operational-stories.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
class Effect { constructor(target){this.target=target;} }
const exports={};vm.runInNewContext(compiled,{exports,KeyframeEffect:Effect});
function story(kind){const logs=[];const svgs=[0,1].map(i=>({pauseAnimations(){logs.push(['pause',i])},unpauseAnimations(){logs.push(['resume',i])},setCurrentTime(t){logs.push(['time',i,t])}}));const visual={dataset:{phase:'settled'},querySelectorAll(){return svgs},getAnimations(){return []}};const timeline=exports.createServiceStory({querySelector(){return visual}},{later(){throw new Error('Adapter must not schedule independent work')}},kind);return{timeline,visual,logs};}
for(const kind of ['cloud','security']){
 test(kind+' adapter waits for shared lifecycle and uses the approved duration',()=>{const h=story(kind);assert.equal(h.visual.dataset.phase,'idle');assert.equal(h.visual.dataset.motion,'paused');assert.equal(h.timeline.duration,kind==='cloud'?4400:5000);h.timeline.activity(true);h.timeline.play();assert.equal(h.visual.dataset.phase,'play');assert.equal(h.visual.dataset.motion,'running');assert.equal(h.logs.filter(x=>x[0]==='resume').length,0,'SMIL pulses wait until settlement');});
 test(kind+' ambient playback pauses and resumes independently of the completed story',()=>{const h=story(kind);h.timeline.activity(true);h.timeline.play();h.timeline.settle();assert.equal(h.visual.dataset.phase,'settled');assert.equal(h.logs.filter(x=>x[0]==='resume').length,2);h.timeline.activity(false);assert.equal(h.visual.dataset.motion,'paused');h.timeline.activity(true);assert.equal(h.visual.dataset.phase,'settled');assert.equal(h.visual.dataset.motion,'running');});
 test(kind+' reduced/static settlement does not start ambient motion',()=>{const h=story(kind);h.timeline.settle();assert.equal(h.visual.dataset.phase,'settled');assert.equal(h.visual.dataset.motion,'paused');assert.equal(h.logs.filter(x=>x[0]==='resume').length,0);});
}
test('ambient pause freezes descendant transitions but leaves the shared entrance alone',()=>{
 const h=story('cloud'),events=[];
 const entrance={effect:new Effect(h.visual),playState:'paused',pause(){events.push('entrance-pause')},play(){events.push('entrance-play')}};
 const transition={effect:new Effect({}),playState:'paused',pause(){events.push('transition-pause')},play(){events.push('transition-play')}};
 h.visual.getAnimations=()=>[entrance,transition];h.timeline.activity(false);h.timeline.activity(true);
 assert.deepEqual(events,['transition-pause','transition-play']);
});
test('production retains the approved SVG hierarchy and mobile variants without preview harness',()=>{const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');for(const [name,labels] of [['cloud-ecosystem',['User','Entra ID','Microsoft 365','Devices','Email &amp; Collaboration','ITKeepers','Managed in context']],['security-badge',['Identity','Endpoint','Network','Operations','Recovery','Business']]]){const figure=html.match(new RegExp('<figure[^>]+data-animation="'+name+'"[\\s\\S]*?</figure>'))[0];for(const label of labels)assert.ok(figure.includes(label),label);assert.equal((figure.match(/role="img"/g)||[]).length,2);assert.match(figure,/data-phase="settled"/);assert.doesNotMatch(figure,/onclick|Final frame|Replay|Google|AWS|<script/);}});
