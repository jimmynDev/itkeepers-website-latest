import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import sharp from 'sharp';
import { parse } from 'parse5';
const imagePath = '/assets/itkeepers-og-v2.png';
const alt = 'ITKeepers. Your IT person is a team. Managed IT, Cybersecurity, Cloud and Infrastructure. Lebanon.';
const source = readFileSync(new URL('../public'+imagePath, import.meta.url));
const walk = node => [node, ...(node.childNodes || []).flatMap(walk)];
const attr = (node,key) => node.attrs?.find(a=>a.name===key)?.value;
const files = dir => readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(`${dir}/${e.name}`):e.name.endsWith('.html')?[`${dir}/${e.name}`]:[]);

test('social artwork is a complete opaque 1200x630 PNG with readable white/cyan headline colors', async()=>{
  assert.equal(source.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,1200);assert.equal(info.height,630);assert.equal(info.channels,4);
  assert(source.length<300*1024,'Keep this sharing asset within the project 300KB delivery budget');
  let cyan=0,white=0;
  for(let y=0;y<630;y++)for(let x=0;x<1200;x++){
    const i=(y*1200+x)*4;assert.equal(data[i+3],255);
    if(x<720&&y>180&&y<380){
      if(data[i]===56&&data[i+1]===189&&data[i+2]===248)cyan++;
      if(data[i]===247&&data[i+1]===250&&data[i+2]===255)white++;
    }
  }
  assert(cyan>3000);assert(white>7000);
});

test('production and staging share the same versioned PNG and complete singleton social metadata on every page',()=>{
  for(const [dir,origin]of [['dist','https://itkeepers.com'],['dist-staging','https://itkeepers-v2-staging.jimnassar99.workers.dev']]){
    const pages=files(dir);assert.equal(pages.length,20);
    assert.deepEqual(readFileSync(dir+imagePath),source);
    for(const file of pages){
      const nodes=walk(parse(readFileSync(file,'utf8')));
      const meta=key=>nodes.filter(n=>n.tagName==='meta'&&(attr(n,'property')===key||attr(n,'name')===key)).map(n=>attr(n,'content'));
      assert.deepEqual(meta('og:image'),[origin+imagePath],file);
      assert.deepEqual(meta('twitter:image'),[origin+imagePath],file);
      assert.deepEqual(meta('og:image:width'),['1200']);assert.deepEqual(meta('og:image:height'),['630']);
      assert.deepEqual(meta('og:image:type'),['image/png']);assert.deepEqual(meta('twitter:card'),['summary_large_image']);
      assert.deepEqual(meta('og:image:alt'),[alt]);assert.deepEqual(meta('twitter:image:alt'),[alt]);
    }
  }
});
