import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source=readFileSync('src/data/spotlight.ts','utf8');
const exports={};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
const profile=exports.spotlightProfile;
const routes=['/services/',...readdirSync('dist/services',{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>`/services/${e.name}/`)];
const html=route=>readFileSync('dist'+route+'index.html','utf8');

test('every discovered service route has one medium-intensity spotlight',()=>{
  assert(routes.length>1);
  for(const route of routes){
    assert.equal(profile(route),'medium',route);
    const page=html(route);
    assert.match(page,/<body\b[^>]*data-spotlight="medium"/);
    assert.equal((page.match(/class="home-pointer-layer"/g)||[]).length,1,route);
    assert.equal((page.match(/class="home-pointer-light"/g)||[]).length,1,route);
  }
});
test('Home, About and Contact have explicit original/low/subtle profiles',()=>{
  for(const [route,expected] of [['/','home'],['/about/','low'],['/contact/','subtle']]){
    assert.equal(profile(route),expected);assert(html(route).includes(`data-spotlight="${expected}"`));
  }
});
test('legal, Pulse and unrelated routes do not mount the light',()=>{
  for(const route of ['/privacy/','/it-keepers-pulse/','/blog/','/why-itkeepers/','/how-we-work/']){
    assert.equal(profile(route),undefined);assert(!html(route).includes('class="home-pointer-layer"'));assert(!/<body[^>]*data-spotlight/.test(html(route)));
  }
  assert.equal(profile('/terms/'),undefined);assert.equal(profile('/services-archive/'),undefined);
});
test('shared component imports the existing controller once and Home has no duplicate import',()=>{
  const component=readFileSync('src/components/PointerSpotlight.astro','utf8');
  assert.equal((component.match(/import '\.\.\/scripts\/home-motion'/g)||[]).length,1);
  assert(!readFileSync('src/pages/index.astro','utf8').includes('scripts/home-motion'));
  const controller=readFileSync('src/scripts/home-motion.ts','utf8');
  assert.equal((controller.match(/addEventListener\('pointermove'/g)||[]).length,1);
  assert(!controller.includes('getBoundingClientRect'));
});
