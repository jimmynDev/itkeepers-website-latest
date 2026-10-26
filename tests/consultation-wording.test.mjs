import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
test('published HTML and browser scripts use consultation wording throughout',()=>{
 const oldWording=new RegExp('\\bIT '+'review\\b','i');
 for(const f of files(fileURLToPath(new URL('../dist/',import.meta.url))).filter(f=>/\.(html|js)$/.test(f)))assert.doesNotMatch(readFileSync(f,'utf8'),oldWording,f);
 const home=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 for(const label of ['Free IT Consultation','Book a Free IT Consultation','Book your free IT consultation.','Request my free IT consultation'])assert.ok(home.includes(label),label);
 assert.match(home,/href="\/contact\/\?type=review"/,'Existing inquiry links retain their compatible URL');
});
